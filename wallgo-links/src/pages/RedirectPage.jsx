import React, { useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Zap, ExternalLink, AlertCircle, CheckCircle2,
  Activity, Shield, Clock, ArrowRight
} from 'lucide-react';
import api from '../utils/api';

// ─────────────────────────────────────────────
// Utility: safely inject and execute ad scripts
// ─────────────────────────────────────────────
function injectScript(htmlString) {
  if (!htmlString) return;
  const wrapper = document.createElement('div');
  wrapper.innerHTML = htmlString;
  const scripts = wrapper.querySelectorAll('script');
  scripts.forEach(old => {
    const s = document.createElement('script');
    if (old.src) {
      s.src = old.src;
      s.async = true;
    } else {
      s.textContent = old.textContent;
    }
    document.body.appendChild(s);
  });
}

// ─────────────────────────────────────────────
// Utility: inject ad into a specific container
// ─────────────────────────────────────────────
function AdSlot({ code, style }) {
  const ref = useRef(null);
  const injected = useRef(false);

  useEffect(() => {
    if (!code || injected.current || !ref.current) return;
    injected.current = true;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = code;
    const allNodes = Array.from(wrapper.childNodes);
    allNodes.forEach(node => {
      if (node.tagName === 'SCRIPT') {
        const s = document.createElement('script');
        if (node.src) { s.src = node.src; s.async = true; }
        else s.textContent = node.textContent;
        ref.current.appendChild(s);
      } else {
        ref.current.appendChild(node.cloneNode(true));
      }
    });
  }, [code]);

  return <div ref={ref} style={style} />;
}

// ─────────────────────────────────────────────
// Timer Ring Component
// ─────────────────────────────────────────────
function TimerRing({ seconds, total, size = 80 }) {
  const r = (size / 2) - 6;
  const circ = 2 * Math.PI * r;
  const progress = circ - (seconds / total) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#e2e8f0" strokeWidth="5" />
      <circle
        cx={size/2} cy={size/2} r={r} fill="none" stroke="#2563eb" strokeWidth="5"
        strokeDasharray={circ} strokeDashoffset={progress}
        style={{ transition: '1s linear', strokeLinecap: 'round' }}
      />
      <text
        x="50%" y="50%" textAnchor="middle" dy=".35em"
        style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fontSize: '1.2rem', fontWeight: 900, fill: '#1e293b' }}
      >{seconds}</text>
    </svg>
  );
}

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
const STEP_TIMERS = { 1: 7, 2: 15, 3: 5 };

const RedirectPage = () => {
  const { alias: urlAlias } = useParams();
  const [searchParams] = useSearchParams();

  const [config, setConfig]         = useState(null);
  const [linkDetails, setLinkDetails] = useState(null);
  const [step, setStep]             = useState(1);
  const [timerSeconds, setTimerSec] = useState(STEP_TIMERS[1]);
  const [totalTimer, setTotalTimer] = useState(STEP_TIMERS[1]);
  const [canProceed, setCanProceed] = useState(false);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);
  const [finalUrl, setFinalUrl]     = useState(null);
  const smartlinkFired              = useRef(false);
  const popunderFired               = useRef(false);

  const alias = urlAlias || searchParams.get('alias');

  // ── 1. LOAD DATA ──────────────────────────────
  useEffect(() => {
    if (!alias) { setLoading(false); setError(true); return; }

    (async () => {
      try {
        const [adRes, linkRes] = await Promise.all([
          api.get('/pages/settings/ad-config'),
          api.get(`/links/details/${alias}`)
        ]);
        const conf = adRes.data.value || adRes.data;
        setConfig(conf);
        setLinkDetails(linkRes.data);

        // Fire Popunder + Social Bar on page 1 load (first trigger)
        if (!popunderFired.current) {
          popunderFired.current = true;
          injectScript(conf.adCodes?.popunder);
          injectScript(conf.adCodes?.socialBar);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    })();
  }, [alias]);

  // ── 2. COUNTDOWN TIMER ────────────────────────
  useEffect(() => {
    if (loading || error) return;
    if (timerSeconds <= 0) {
      setCanProceed(true);
      // Auto-advance to final redirect on step 3 when timer hits 0
      if (step === 3 && finalUrl) {
        window.location.href = finalUrl;
      }
      return;
    }
    const t = setTimeout(() => setTimerSec(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timerSeconds, loading, error, step, finalUrl]);

  // ── 3. STEP 2 SIDE-EFFECTS ───────────────────
  useEffect(() => {
    if (step !== 2 || !config) return;

    // Popunder second fire on step 2 load
    injectScript(config.adCodes?.popunder);

    // Disable right-click + inspect during monetization step
    const noContext = e => e.preventDefault();
    const noKeys = e => {
      if (e.key === 'F12' || (e.ctrlKey && e.shiftKey && ['I','J','C'].includes(e.key)) || (e.ctrlKey && e.key === 'U')) {
        e.preventDefault();
      }
    };
    document.addEventListener('contextmenu', noContext);
    document.addEventListener('keydown', noKeys);

    // Smartlink background trigger after 3 seconds
    const slt = setTimeout(() => {
      if (config.smartlink && !smartlinkFired.current) {
        smartlinkFired.current = true;
        // Open as a new tab (most effective for smartlinks)
        const a = document.createElement('a');
        a.href = config.smartlink;
        a.target = '_blank';
        a.rel = 'noopener';
        a.click();
      }
    }, 3500);

    return () => {
      clearTimeout(slt);
      document.removeEventListener('contextmenu', noContext);
      document.removeEventListener('keydown', noKeys);
    };
  }, [step, config]);

  // ── 4. STEP 3 — PRE-FETCH FINAL URL ─────────
  useEffect(() => {
    if (step === 3 && linkDetails?.alias && !finalUrl) {
      api.get(`/links/resolve/${linkDetails.alias}`)
        .then(r => setFinalUrl(r.data.originalUrl))
        .catch(() => {});
      // Optional: third popunder trigger
      if (config?.adCodes?.popunder) injectScript(config.adCodes.popunder);
    }
  }, [step]);

  // ── STEP TRANSITIONS ──────────────────────────
  const goToStep = (next) => {
    setStep(next);
    const t = next === 2 ? (config?.timer || STEP_TIMERS[2]) : STEP_TIMERS[next];
    setTimerSec(t);
    setTotalTimer(t);
    setCanProceed(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalRedirect = () => {
    if (finalUrl) window.location.href = finalUrl;
  };

  // ── LOADING ───────────────────────────────────
  if (loading) return (
    <div style={styles.fullCenter}>
      <div style={styles.loadingCard}>
        <div style={styles.spinner}>
          <Activity size={32} color="#2563eb" className="spin" />
        </div>
        <p style={{ fontSize: '0.9rem', fontWeight: 700, color: '#64748b' }}>Preparing your link securely…</p>
      </div>
    </div>
  );

  if (error || !linkDetails) return (
    <div style={styles.fullCenter}>
      <div style={styles.errorCard}>
        <AlertCircle size={56} color="#ef4444" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontWeight: 900, marginBottom: '0.5rem' }}>Link Not Found</h2>
        <p style={{ color: '#64748b', marginBottom: '2rem', fontSize: '0.9rem' }}>This link has expired or does not exist.</p>
        <Link to="/" style={styles.primaryBtn}>← Back to Home</Link>
      </div>
    </div>
  );

  const step2Timer = config?.timer || STEP_TIMERS[2];
  const step2Progress = step === 2 ? Math.round(((step2Timer - timerSeconds) / step2Timer) * 100) : 0;

  // ─────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────
  return (
    <div style={{ minHeight: '100vh', background: '#f0f4f8', fontFamily: "'Inter', sans-serif", color: '#1e293b' }}>

      {/* ── TOP BANNER AD ── */}
      <div style={styles.topBanner}>
        <AdSlot code={config?.adCodes?.top} style={{ width: '728px', maxWidth: '100%', minHeight: '90px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} />
      </div>

      {/* ── NAVBAR ── */}
      <nav style={styles.nav}>
        <div style={styles.navInner}>
          <Link to="/" style={styles.logo}>
            <div style={styles.logoIcon}><Zap size={18} color="white" fill="white" /></div>
            <span>Wallgo<span style={{ color: '#2563eb' }}>Links</span></span>
          </Link>
          <div style={styles.secureTag}>
            <Shield size={12} color="#10b981" /> SECURE LINK GATEWAY
          </div>
        </div>
      </nav>

      {/* ── STEP PROGRESS ── */}
      <div style={styles.progressWrap}>
        {[1, 2, 3].map(i => (
          <div key={i} style={{ ...styles.progressBar, background: step >= i ? '#2563eb' : '#cbd5e1' }}>
            {step > i && <div style={styles.progressFill} />}
          </div>
        ))}
      </div>

      {/* ─────────────────────────────────────── */}
      {/* PAGE 1: HUMAN VERIFICATION              */}
      {/* ─────────────────────────────────────── */}
      {step === 1 && (
        <main style={styles.main}>
          <div style={styles.card}>
            <div style={styles.stepBadge}>STEP 1 OF 3 · VERIFICATION</div>
            <h1 style={styles.heading}>🔐 Your link is almost ready</h1>
            <p style={styles.subtext}>Please complete the human verification to continue.</p>

            <div style={styles.verifyBox}>
              {!canProceed ? (
                <>
                  <TimerRing seconds={timerSeconds} total={STEP_TIMERS[1]} />
                  <p style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', letterSpacing: '0.08em', marginTop: '0.5rem' }}>VERIFYING SOURCE…</p>
                </>
              ) : (
                <button onClick={() => goToStep(2)} style={styles.bigGreenBtn}>
                  <CheckCircle2 size={22} /> I AM HUMAN · CONTINUE
                </button>
              )}
            </div>

            <div style={styles.adLabel}>ADVERTISEMENT</div>
            <AdSlot
              code={config?.adCodes?.content}
              style={{ minHeight: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem' }}
            />
          </div>
        </main>
      )}

      {/* ─────────────────────────────────────── */}
      {/* PAGE 2: MAIN ADS PAGE                   */}
      {/* ─────────────────────────────────────── */}
      {step === 2 && (
        <main style={styles.main}>
          <div style={styles.card}>
            <div style={{ ...styles.stepBadge, background: '#fef3c7', color: '#92400e' }}>STEP 2 OF 3 · GENERATING LINK</div>
            <h1 style={styles.heading}>⚡ Generating your download link…</h1>
            <p style={styles.subtext}>Please wait while we prepare your secure link. Do not close this page.</p>

            {/* Progress Bar */}
            <div style={styles.progressTrack}>
              <div style={{ ...styles.progressFill2, width: `${step2Progress}%` }} />
            </div>
            <p style={{ textAlign: 'center', fontSize: '0.8rem', fontWeight: 700, color: '#64748b', marginBottom: '1.5rem' }}>
              {canProceed ? '✅ Link Ready! Click continue to proceed.' : `Please wait ${timerSeconds}s…`}
            </p>

            {/* Dual Ad Banners */}
            <div style={styles.adGrid}>
              <div style={styles.adBox}>
                <div style={styles.adLabel}>SPONSORED</div>
                <AdSlot
                  code={config?.adCodes?.content}
                  style={{ minHeight: '250px', width: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                />
              </div>
              <div style={styles.adBox}>
                <div style={styles.adLabel}>SPONSORED</div>
                <AdSlot
                  code={config?.adCodes?.sidebar}
                  style={{ minHeight: '250px', width: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                />
              </div>
            </div>

            {/* Continue Button / Waiting Indicator */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              {!canProceed ? (
                <div style={styles.waitingRow}>
                  <Activity size={20} className="spin" color="#2563eb" />
                  <span style={{ fontWeight: 700, color: '#64748b' }}>Processing… {timerSeconds}s remaining</span>
                </div>
              ) : (
                <button onClick={() => goToStep(3)} style={styles.bigBlueBtn}>
                  CONTINUE <ArrowRight size={20} />
                </button>
              )}
            </div>
          </div>
        </main>
      )}

      {/* ─────────────────────────────────────── */}
      {/* PAGE 3: FINAL REDIRECT                  */}
      {/* ─────────────────────────────────────── */}
      {step === 3 && (
        <main style={styles.main}>
          <div style={styles.card}>
            <div style={{ ...styles.stepBadge, background: '#dcfce7', color: '#166534' }}>STEP 3 OF 3 · REDIRECTING</div>
            <h1 style={styles.heading}>🎉 Your link is ready!</h1>
            <p style={styles.subtext}>Redirecting you to the destination in {canProceed ? '0' : timerSeconds} seconds…</p>

            <AdSlot
              code={config?.adCodes?.sidebar}
              style={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '1rem', marginBottom: '2rem' }}
            />

            {!canProceed ? (
              <div style={{ textAlign: 'center' }}>
                <TimerRing seconds={timerSeconds} total={STEP_TIMERS[3]} size={90} />
                <p style={{ fontSize: '0.8rem', color: '#94a3b8', marginTop: '0.5rem', fontWeight: 700 }}>Auto-redirecting shortly…</p>
              </div>
            ) : (
              <button onClick={handleFinalRedirect} style={styles.bigGreenBtnLarge}>
                <ExternalLink size={24} /> GET MY LINK NOW
              </button>
            )}

            <p style={{ marginTop: '2rem', fontSize: '0.7rem', color: '#cbd5e1', textAlign: 'center' }}>
              Powered by WallgoLinks · Secure Redirect Technology
            </p>
          </div>
        </main>
      )}

      {/* ── BOTTOM BANNER ── */}
      <div style={{ textAlign: 'center', padding: '1rem', borderTop: '1px solid #e2e8f0', marginTop: '2rem', background: '#fff' }}>
        <div style={styles.adLabel}>ADVERTISEMENT</div>
        <AdSlot code={config?.adCodes?.top} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: '90px', maxWidth: '100%' }} />
      </div>

      {/* ── FOOTER ── */}
      <footer style={styles.footer}>
        <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>© 2026 WallgoLinks · Real-time Ad Auctioning</p>
        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.75rem' }}>
          {['terms', 'privacy', 'dmca'].map(s => (
            <Link key={s} to={`/pages/${s}`} style={{ fontSize: '0.75rem', color: '#64748b', textDecoration: 'none', fontWeight: 700, textTransform: 'capitalize' }}>{s.toUpperCase()}</Link>
          ))}
        </div>
      </footer>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 640px) {
          .ad-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

// ─────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────
const styles = {
  fullCenter: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8', padding: '1rem' },
  loadingCard: { background: '#fff', borderRadius: '24px', padding: '3rem', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' },
  spinner: { width: 64, height: 64, borderRadius: '50%', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  errorCard: { background: '#fff', borderRadius: '24px', padding: '3rem', textAlign: 'center', boxShadow: '0 10px 30px rgba(0,0,0,0.08)', maxWidth: '400px' },
  primaryBtn: { display: 'inline-block', background: '#2563eb', color: '#fff', padding: '0.875rem 2rem', borderRadius: '50px', fontWeight: 800, textDecoration: 'none', fontSize: '0.9rem' },
  topBanner: { width: '100%', minHeight: '90px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px 0' },
  nav: { background: '#fff', borderBottom: '1px solid #e2e8f0', position: 'sticky', top: 0, zIndex: 100 },
  navInner: { maxWidth: '900px', margin: '0 auto', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 900, color: '#1e293b', letterSpacing: '-0.03em' },
  logoIcon: { background: '#2563eb', padding: '0.35rem', borderRadius: '8px' },
  secureTag: { display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', padding: '5px 12px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em' },
  progressWrap: { maxWidth: '900px', margin: '1rem auto 0', padding: '0 1rem', display: 'flex', gap: '8px' },
  progressBar: { flex: 1, height: '5px', borderRadius: '10px', transition: '0.4s', overflow: 'hidden' },
  progressFill: { height: '100%', width: '100%', background: '#2563eb' },
  main: { maxWidth: '900px', margin: '1.5rem auto', padding: '0 1rem 2rem' },
  card: { background: '#fff', borderRadius: '24px', padding: '2.5rem 2rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
  stepBadge: { display: 'inline-block', background: '#eff6ff', color: '#1d4ed8', fontSize: '0.65rem', fontWeight: 900, letterSpacing: '0.08em', padding: '5px 12px', borderRadius: '20px', marginBottom: '1.25rem' },
  heading: { fontSize: '1.65rem', fontWeight: 900, marginBottom: '0.5rem', color: '#0f172a' },
  subtext: { color: '#64748b', fontWeight: 600, fontSize: '0.9rem', marginBottom: '2rem' },
  verifyBox: { background: '#f8fafc', border: '2px dashed #cbd5e1', borderRadius: '20px', padding: '2.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '2rem' },
  adLabel: { fontSize: '0.6rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.1em', textAlign: 'center', marginBottom: '0.75rem', textTransform: 'uppercase' },
  bigGreenBtn: { display: 'flex', alignItems: 'center', gap: '10px', background: '#1e293b', color: '#fff', border: 'none', padding: '1.1rem 2rem', borderRadius: '50px', fontSize: '1.05rem', fontWeight: 900, cursor: 'pointer', width: '100%', justifyContent: 'center' },
  bigGreenBtnLarge: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', background: '#10b981', color: '#fff', border: 'none', padding: '1.25rem 2.5rem', borderRadius: '50px', fontSize: '1.2rem', fontWeight: 900, cursor: 'pointer', width: '100%', boxShadow: '0 8px 20px rgba(16,185,129,0.3)' },
  bigBlueBtn: { display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#2563eb', color: '#fff', border: 'none', padding: '1.1rem 3rem', borderRadius: '50px', fontSize: '1.1rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 8px 20px rgba(37,99,235,0.25)' },
  progressTrack: { width: '100%', height: '10px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', marginBottom: '0.75rem' },
  progressFill2: { height: '100%', background: 'linear-gradient(90deg, #2563eb 0%, #60a5fa 100%)', transition: '1s linear', borderRadius: '10px' },
  adGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' },
  adBox: { background: '#f8fafc', borderRadius: '16px', padding: '1.25rem', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center' },
  waitingRow: { display: 'inline-flex', alignItems: 'center', gap: '12px', background: '#f1f5f9', padding: '1rem 2rem', borderRadius: '50px' },
  footer: { background: '#fff', borderTop: '1px solid #e2e8f0', padding: '2rem 1rem', textAlign: 'center' },
};

export default RedirectPage;
