import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import {
  Zap, ExternalLink, AlertCircle, CheckCircle, Shield,
  X, Clock, ArrowRight, Lock, Activity
} from 'lucide-react';
import api from '../utils/api';

// ─── Background websites for pages 1–3 ───────────────────────────
const BG_SITES = [
  'https://www.pastex.online/',
  'https://www.wallgo.in/',
  'https://www.pychart.in/',
];

// ─── Inject ad script tags into document body ─────────────────────
function injectScript(htmlString) {
  if (!htmlString) return;
  const tmp = document.createElement('div');
  tmp.innerHTML = htmlString;
  tmp.querySelectorAll('script').forEach(old => {
    const s = document.createElement('script');
    if (old.src) { s.src = old.src; s.async = true; }
    else s.textContent = old.textContent;
    document.body.appendChild(s);
  });
}

// ─── AdSlot: renders ad code inside a ref div (once) ─────────────
function AdSlot({ code, style }) {
  const ref = useRef(null);
  const done = useRef(false);
  useEffect(() => {
    if (!code || done.current || !ref.current) return;
    done.current = true;
    const tmp = document.createElement('div');
    tmp.innerHTML = code;
    Array.from(tmp.childNodes).forEach(node => {
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

// ─── Closeable Popup Ad Modal ─────────────────────────────────────
function PopupAd({ code, onClose }) {
  return (
    <div style={S.popupOverlay}>
      <div style={S.popupBox}>
        <div style={S.popupHeader}>
          <span style={{ fontSize: '0.7rem', fontWeight: 900, color: '#94a3b8', letterSpacing: '0.08em' }}>ADVERTISEMENT</span>
          <button onClick={onClose} style={S.closeBtn} title="Close Ad">
            <X size={16} />
          </button>
        </div>
        <AdSlot
          code={code}
          style={{ minWidth: '300px', minHeight: '250px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        />
        <p style={{ fontSize: '0.7rem', color: '#cbd5e1', textAlign: 'center', padding: '0.5rem 0 0' }}>
          Close this ad to continue
        </p>
      </div>
    </div>
  );
}

// ─── Timer Ring SVG ───────────────────────────────────────────────
function Ring({ sec, total, size = 72 }) {
  const r = size / 2 - 5;
  const circ = 2 * Math.PI * r;
  const offset = circ - (sec / total) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={4} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#fff" strokeWidth={4}
        strokeDasharray={circ} strokeDashoffset={offset}
        style={{ transition: '1s linear', strokeLinecap: 'round' }} />
      <text x="50%" y="50%" textAnchor="middle" dy=".35em"
        style={{ transform: 'rotate(90deg)', transformOrigin: '50% 50%', fontSize: size * 0.28, fontWeight: 900, fill: '#fff' }}>
        {sec}
      </text>
    </svg>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────
const TIMERS = { 1: 0, 2: 15, 3: 10, 4: 5 }; // page 1 = no timer (just click)

export default function RedirectPage() {
  const { alias: urlAlias } = useParams();
  const [searchParams] = useSearchParams();
  const alias = urlAlias || searchParams.get('alias');

  const [config, setConfig]         = useState(null);
  const [linkDetails, setLinkDetails] = useState(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState(false);
  const [page, setPage]             = useState(1);           // 1–4
  const [timeLeft, setTimeLeft]     = useState(TIMERS[2]);
  const [canProceed, setCanProceed] = useState(false);
  const [showPopup, setShowPopup]   = useState(false);
  const [captchaChecked, setCaptchaChecked] = useState(false);
  const [finalUrl, setFinalUrl]     = useState(null);
  const popFired = useRef({});

  // ── Load config + link ──────────────────────────────────────────
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
        // Fire popunder on first load
        injectScript(conf.adCodes?.popunder);
        injectScript(conf.adCodes?.socialBar);
      } catch { setError(true); }
      finally { setLoading(false); }
    })();
  }, [alias]);

  // ── Countdown timer ─────────────────────────────────────────────
  useEffect(() => {
    if (loading || page === 1) return; // page 1 has no countdown
    if (timeLeft <= 0) { setCanProceed(true); return; }
    const t = setTimeout(() => setTimeLeft(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, loading, page]);

  // ── Show popup ad 3s after entering page 2 or 3 ─────────────────
  useEffect(() => {
    if (loading || (page !== 2 && page !== 3)) return;
    if (popFired.current[page]) return;
    popFired.current[page] = true;
    const t = setTimeout(() => setShowPopup(true), 3000);
    // Also fire popunder again on page 2
    if (page === 2 && config?.adCodes?.popunder) injectScript(config.adCodes.popunder);
    return () => clearTimeout(t);
  }, [page, loading, config]);

  // ── Prefetch final URL on page 4 ─────────────────────────────────
  useEffect(() => {
    if (page === 4 && linkDetails?.alias && !finalUrl) {
      api.get(`/links/resolve/${linkDetails.alias}`)
        .then(r => setFinalUrl(r.data.originalUrl))
        .catch(() => {});
      if (config?.adCodes?.popunder) injectScript(config.adCodes.popunder);
    }
  }, [page]);

  // ── Auto-redirect on page 4 when timer ends ───────────────────
  useEffect(() => {
    if (page === 4 && canProceed && finalUrl) {
      // Give 1 extra second then auto-go
      const t = setTimeout(() => { window.location.href = finalUrl; }, 1200);
      return () => clearTimeout(t);
    }
  }, [canProceed, finalUrl, page]);

  const goToPage = useCallback((next) => {
    setPage(next);
    if (next > 1 && next < 4) {
      const dur = next === 2 ? (config?.timer || TIMERS[2]) : TIMERS[next];
      setTimeLeft(dur);
    } else if (next === 4) {
      setTimeLeft(TIMERS[4]);
    }
    setCanProceed(false);
    setShowPopup(false);
    setCaptchaChecked(false);
  }, [config]);

  // ── Loading ──────────────────────────────────────────────────────
  if (loading) return (
    <div style={S.centeredScreen}>
      <div style={S.loadCard}>
        <Activity size={32} color="#6366f1" className="spin" />
        <p style={{ color: '#64748b', fontWeight: 700, fontSize: '0.9rem' }}>Preparing your link…</p>
      </div>
    </div>
  );

  if (error || !linkDetails) return (
    <div style={S.centeredScreen}>
      <div style={{ ...S.loadCard, gap: '1rem' }}>
        <AlertCircle size={48} color="#ef4444" />
        <h2 style={{ fontWeight: 900 }}>Link Not Found</h2>
        <Link to="/" style={S.btnBlue}>← Go Home</Link>
      </div>
    </div>
  );

  const bgSite = BG_SITES[page - 1]; // undefined for page 4
  const totalTimer = page === 2 ? (config?.timer || TIMERS[2]) : (TIMERS[page] || 5);
  const progress = page > 1 && page < 4 ? Math.round(((totalTimer - timeLeft) / totalTimer) * 100) : 0;

  // ─────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────
  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', fontFamily: "'Inter', sans-serif" }}>

      {/* ── Popup Ad (closeable) ── */}
      {showPopup && (
        <PopupAd
          code={config?.adCodes?.sidebar || config?.adCodes?.content}
          onClose={() => setShowPopup(false)}
        />
      )}

      {/* ── PAGES 1–3: Background iframe ── */}
      {page <= 3 && (
        <iframe
          src={bgSite}
          title="background-site"
          style={S.iframe}
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
        />
      )}

      {/* ── PAGE 4: Solid background ── */}
      {page === 4 && <div style={S.solidBg} />}

      {/* ── Dark scrim under the card ── */}
      <div style={S.scrim} />

      {/* ═══════════════════════════════════════════════════════ */}
      {/* PAGE 1: Human Verification                             */}
      {/* ═══════════════════════════════════════════════════════ */}
      {page === 1 && (
        <div style={S.cardWrap}>
          <div style={S.card}>
            {/* Step dots */}
            <div style={S.dots}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ ...S.dot, background: i <= page ? '#6366f1' : 'rgba(255,255,255,0.25)' }} />
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={S.iconCircle}><Shield size={20} color="#6366f1" /></div>
              <h2 style={S.cardTitle}>Verify You're Human</h2>
            </div>
            <p style={S.cardSub}>Complete this step to unlock your link safely.</p>

            {/* Captcha-style checkbox */}
            <div style={S.captchaBox} onClick={() => setCaptchaChecked(true)}>
              <div style={{ ...S.checkbox, background: captchaChecked ? '#10b981' : '#fff', borderColor: captchaChecked ? '#10b981' : '#cbd5e1' }}>
                {captchaChecked && <CheckCircle size={18} color="white" fill="white" />}
              </div>
              <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>I am not a robot</span>
              <img src="https://www.gstatic.com/recaptcha/api2/logo_48.png" alt="captcha" style={{ width: 32, marginLeft: 'auto', opacity: 0.6 }} />
            </div>

            {captchaChecked && (
              <button onClick={() => goToPage(2)} style={S.btnPrimary}>
                CONTINUE <ArrowRight size={18} />
              </button>
            )}

            <p style={S.poweredBy}>🔒 Secured by WallgoLinks Gateway</p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* PAGE 2: Ads Page (wallgo.in background)                */}
      {/* ═══════════════════════════════════════════════════════ */}
      {page === 2 && (
        <div style={S.cardWrap}>
          <div style={S.card}>
            <div style={S.dots}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ ...S.dot, background: i <= page ? '#6366f1' : 'rgba(255,255,255,0.25)' }} />
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={S.iconCircle}><Clock size={20} color="#6366f1" /></div>
              <h2 style={S.cardTitle}>Generating Your Link…</h2>
            </div>
            <p style={S.cardSub}>Please wait while we process your request. Do not close this page.</p>

            {/* Circular timer + progress */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <Ring sec={timeLeft} total={totalTimer} size={80} />
              <div style={S.progressTrack}>
                <div style={{ ...S.progressFill, width: `${progress}%` }} />
              </div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
                {canProceed ? '✅ Link ready! Click continue.' : `Processing… ${timeLeft}s remaining`}
              </p>
            </div>

            {canProceed ? (
              <button onClick={() => goToPage(3)} style={S.btnPrimary}>
                CONTINUE <ArrowRight size={18} />
              </button>
            ) : (
              <div style={S.waitPill}>
                <Activity size={16} className="spin" /> Waiting for timer…
              </div>
            )}

            <p style={S.poweredBy}>🔒 Secured by WallgoLinks Gateway</p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* PAGE 3: (pychart.in background)                        */}
      {/* ═══════════════════════════════════════════════════════ */}
      {page === 3 && (
        <div style={S.cardWrap}>
          <div style={S.card}>
            <div style={S.dots}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ ...S.dot, background: i <= page ? '#10b981' : 'rgba(255,255,255,0.25)' }} />
              ))}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <div style={{ ...S.iconCircle, background: 'rgba(16,185,129,0.15)' }}><Lock size={20} color="#10b981" /></div>
              <h2 style={S.cardTitle}>Almost There…</h2>
            </div>
            <p style={S.cardSub}>Final verification step. Your link will be ready shortly.</p>

            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
              <Ring sec={timeLeft} total={TIMERS[3]} size={80} />
              <div style={S.progressTrack}>
                <div style={{ ...S.progressFill, width: `${Math.round(((TIMERS[3] - timeLeft) / TIMERS[3]) * 100)}%`, background: 'linear-gradient(90deg, #10b981, #34d399)' }} />
              </div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'rgba(255,255,255,0.6)' }}>
                {canProceed ? '✅ Ready! Click to get your link.' : `Processing… ${timeLeft}s remaining`}
              </p>
            </div>

            {canProceed ? (
              <button onClick={() => goToPage(4)} style={{ ...S.btnPrimary, background: 'linear-gradient(135deg, #10b981, #059669)' }}>
                GET MY LINK <ArrowRight size={18} />
              </button>
            ) : (
              <div style={S.waitPill}>
                <Activity size={16} className="spin" /> Almost done…
              </div>
            )}

            <p style={S.poweredBy}>🔒 Secured by WallgoLinks Gateway</p>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════ */}
      {/* PAGE 4: FINAL REDIRECT PAGE                            */}
      {/* ═══════════════════════════════════════════════════════ */}
      {page === 4 && (
        <div style={{ ...S.cardWrap, alignItems: 'center' }}>
          {/* Logo Bar */}
          <div style={S.page4Wrap}>
            <nav style={S.page4Nav}>
              <Link to="/" style={S.logo}>
                <div style={S.logoIcon}><Zap size={18} color="white" fill="white" /></div>
                <span>Wallgo<span style={{ color: '#6366f1' }}>Links</span></span>
              </Link>
              <div style={S.secureTag}><Shield size={12} color="#10b981" /> SECURE GATEWAY</div>
            </nav>

            {/* Step progress */}
            <div style={{ display: 'flex', gap: '8px', padding: '0 1.5rem', marginBottom: '1.5rem' }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{ flex: 1, height: '5px', borderRadius: '10px', background: i <= 4 ? '#6366f1' : '#e2e8f0', transition: '0.3s' }} />
              ))}
            </div>

            <div style={S.page4Card}>
              <div style={S.page4Icon}>🎉</div>
              <h1 style={S.page4Title}>Your Link is Ready!</h1>
              <p style={S.page4Sub}>You will be redirected to your destination in a moment.</p>

              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                <Ring sec={timeLeft} total={TIMERS[4]} size={92} />
              </div>

              {/* Ad banner on final page */}
              {(config?.adCodes?.sidebar || config?.adCodes?.content) && (
                <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                  <p style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 900, marginBottom: '8px', letterSpacing: '0.08em' }}>ADVERTISEMENT</p>
                  <div style={{ display: 'inline-block', background: '#f8fafc', borderRadius: '12px', padding: '0.75rem', border: '1px solid #e2e8f0' }}>
                    <AdSlot
                      code={config?.adCodes?.sidebar || config?.adCodes?.content}
                      style={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    />
                  </div>
                </div>
              )}

              {canProceed ? (
                <button onClick={() => finalUrl && (window.location.href = finalUrl)} style={S.page4Btn}>
                  <ExternalLink size={22} /> GET MY LINK NOW
                </button>
              ) : (
                <div style={S.page4Wait}>
                  <Activity size={18} className="spin" color="#6366f1" />
                  <span>Auto-redirecting in {timeLeft}s…</span>
                </div>
              )}
            </div>

            <footer style={S.page4Footer}>
              <p style={{ fontSize: '0.75rem', color: '#94a3b8' }}>© 2026 WallgoLinks · Secure Link Network</p>
              <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                {['terms','privacy','dmca'].map(s => (
                  <Link key={s} to={`/pages/${s}`} style={{ fontSize: '0.75rem', color: '#64748b', textDecoration: 'none', fontWeight: 700 }}>{s.toUpperCase()}</Link>
                ))}
              </div>
            </footer>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        * { box-sizing: border-box; margin: 0; padding: 0; }
      `}</style>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────
const S = {
  centeredScreen: { position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f4f8' },
  loadCard: { background: '#fff', borderRadius: '20px', padding: '3rem 2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' },

  // Popup
  popupOverlay: { position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)' },
  popupBox: { background: '#fff', borderRadius: '20px', padding: '1.5rem', maxWidth: '360px', width: '90%', boxShadow: '0 24px 60px rgba(0,0,0,0.4)' },
  popupHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' },
  closeBtn: { background: '#f1f5f9', border: 'none', borderRadius: '8px', padding: '0.4rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' },

  // Iframe background
  iframe: { position: 'absolute', inset: 0, width: '100%', height: '100%', border: 'none', zIndex: 1 },
  solidBg: { position: 'absolute', inset: 0, background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)', zIndex: 1 },
  scrim: { position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(2px)', zIndex: 2 },

  // Floating card (pages 1–3)
  cardWrap: { position: 'absolute', inset: 0, zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' },
  card: {
    background: 'rgba(15, 23, 42, 0.88)',
    backdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '28px',
    padding: '2rem 1.75rem',
    width: '100%',
    maxWidth: '420px',
    color: '#fff',
    boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
  },
  dots: { display: 'flex', gap: '8px', marginBottom: '1.5rem' },
  dot: { flex: 1, height: '4px', borderRadius: '4px', transition: '0.3s' },
  iconCircle: { width: 40, height: 40, borderRadius: '12px', background: 'rgba(99,102,241,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  cardTitle: { fontSize: '1.25rem', fontWeight: 900, color: '#fff' },
  cardSub: { fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', fontWeight: 600, marginBottom: '1.5rem', lineHeight: 1.5 },

  // Captcha
  captchaBox: { display: 'flex', alignItems: 'center', gap: '0.875rem', background: '#fff', borderRadius: '12px', padding: '1rem 1.25rem', cursor: 'pointer', marginBottom: '1.25rem', border: '2px solid #e2e8f0', transition: '0.2s' },
  checkbox: { width: 24, height: 24, borderRadius: '6px', border: '2px solid #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: '0.2s' },

  // Buttons
  btnPrimary: { width: '100%', padding: '1rem', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg, #6366f1, #4f46e5)', color: '#fff', fontSize: '1rem', fontWeight: 900, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', boxShadow: '0 8px 20px rgba(99,102,241,0.4)', marginBottom: '1rem' },
  btnBlue: { background: '#6366f1', color: '#fff', padding: '0.75rem 2rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem', display: 'inline-block' },
  waitPill: { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '50px', padding: '0.875rem', fontSize: '0.875rem', fontWeight: 700, color: 'rgba(255,255,255,0.7)', marginBottom: '1rem' },
  poweredBy: { textAlign: 'center', fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', fontWeight: 700 },

  // Progress bar
  progressTrack: { width: '100%', height: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '6px', overflow: 'hidden' },
  progressFill: { height: '100%', background: 'linear-gradient(90deg, #6366f1, #818cf8)', borderRadius: '6px', transition: '1s linear' },

  // Page 4 specific
  page4Wrap: { width: '100%', maxWidth: '700px', zIndex: 10 },
  page4Nav: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.97)', borderBottom: '1px solid #e2e8f0', borderRadius: '20px 20px 0 0' },
  logo: { display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', fontSize: '1.15rem', fontWeight: 900, color: '#0f172a', letterSpacing: '-0.03em' },
  logoIcon: { background: '#6366f1', padding: '0.35rem', borderRadius: '8px' },
  secureTag: { display: 'flex', alignItems: 'center', gap: '6px', background: '#f1f5f9', padding: '4px 12px', borderRadius: '20px', fontSize: '0.65rem', fontWeight: 800, color: '#64748b', letterSpacing: '0.05em' },
  page4Card: { background: '#fff', padding: '2.5rem 2rem', textAlign: 'center' },
  page4Icon: { fontSize: '3rem', marginBottom: '0.75rem' },
  page4Title: { fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginBottom: '0.5rem' },
  page4Sub: { color: '#64748b', fontSize: '0.875rem', fontWeight: 600, marginBottom: '2rem' },
  page4Btn: { display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'linear-gradient(135deg, #10b981, #059669)', color: '#fff', border: 'none', padding: '1.25rem 3rem', borderRadius: '50px', fontSize: '1.2rem', fontWeight: 900, cursor: 'pointer', boxShadow: '0 12px 30px rgba(16,185,129,0.35)', marginTop: '0.5rem' },
  page4Wait: { display: 'inline-flex', alignItems: 'center', gap: '10px', background: '#f1f5f9', padding: '1rem 2rem', borderRadius: '50px', fontSize: '0.9rem', fontWeight: 700, color: '#64748b' },
  page4Footer: { background: 'rgba(255,255,255,0.97)', borderTop: '1px solid #e2e8f0', padding: '1.25rem', textAlign: 'center', borderRadius: '0 0 20px 20px' },
};
