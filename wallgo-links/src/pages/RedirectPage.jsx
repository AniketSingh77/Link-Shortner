import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { AlertCircle, ExternalLink, Zap, Shield } from 'lucide-react';
import api from '../utils/api';

// ─── Monetag Zone Config ───────────────────────────────────────────
const MONETAG = {
  popunder:  { src: 'https://5gvci.com/act/files/tag.min.js?z=10767360' },
  socialBar: { zone: '10767370', src: 'https://nap5k.com/tag.min.js' },
  vignette:  { zone: '10767382', src: 'https://izcle.com/vignette.min.js' },
};

const firedOnce = new Set();
function injectAd({ src, zone } = {}, key) {
  if (key && firedOnce.has(key)) return;
  if (key) firedOnce.add(key);
  const s = document.createElement('script');
  s.src = src;
  s.async = true;
  s.className = 'monetag-ad';
  if (zone) s.setAttribute('data-zone', zone);
  if (key === 'popunder') s.setAttribute('data-cfasync', 'false');
  document.body.appendChild(s);
}
function fireVignette() {
  const s = document.createElement('script');
  s.src = MONETAG.vignette.src + '?t=' + Date.now();
  s.setAttribute('data-zone', MONETAG.vignette.zone);
  s.className = 'monetag-ad';
  document.body.appendChild(s);
}

// ─── Fake article content for each blog step ───────────────────────
const ARTICLES = [
  {
    siteName: 'EarnBlog India',
    favicon: '💰',
    category: 'MAKE MONEY ONLINE',
    title: 'Top 10 Websites That Pay You For Sharing Links in 2026',
    author: 'Priya Sharma',
    date: 'March 20, 2026',
    readTime: '5 min read',
    heroColor: '#1e3a5f',
    paragraphs: [
      'In today\'s digital age, earning money online has become more accessible than ever before. With millions of Indians gaining internet access every year, the opportunities for online income have multiplied significantly.',
      'Link shortening platforms have emerged as one of the simplest ways to monetize your content. By simply shortening URLs and sharing them with your audience, you can earn a commission for every visitor who accesses your links.',
      'The best part? You don\'t need any technical skills, investment, or special equipment. All you need is a smartphone and an internet connection to start earning from link monetization.',
      'Many Indian creators are already earning ₹10,000 to ₹50,000 per month purely from sharing short links on WhatsApp groups, Telegram channels, and social media. The key is consistent sharing and a large audience.',
      'To maximize your earnings, focus on sharing links related to trending topics like movie downloads, government schemes, job notifications, and tech deals. These categories attract the highest traffic and pay the best rates.',
    ],
  },
  {
    siteName: 'TechGuru Daily',
    favicon: '🚀',
    category: 'DIGITAL EARNINGS',
    title: 'How Telegram Channel Owners Are Earning Lakhs Every Month',
    author: 'Rahul Verma',
    date: 'March 18, 2026',
    readTime: '7 min read',
    heroColor: '#1a3a2a',
    paragraphs: [
      'Telegram has become the go-to platform for Indian content creators looking to build a loyal audience and monetize their content without restrictions. With over 500 million active users, the potential is massive.',
      'Successful Telegram channel owners are using multiple monetization strategies simultaneously. Sponsored posts, paid memberships, and link monetization are the three pillars of a profitable Telegram channel.',
      'Link monetization through URL shorteners is the most passive of these methods. Channel owners simply replace direct download links with shortened, monetized versions. Every click translates to direct revenue.',
      'The math is simple: if your channel gets 10,000 clicks per day and you earn $2 per 1000 visitors, that\'s $20 per day or ₹60,000 per month — without creating any new content.',
      'The secret to scaling this income is growing your subscriber count. Focus on providing genuine value — exclusive content, fast updates, and helpful resources that keep people coming back.',
    ],
  },
];

// ─── Step config: wait time in seconds per step ───────────────────
const WAIT_SECS = [15, 15];  // 2 blog steps, then final page

// ─────────────────────────────────────────────────────────────────
// BLOG ARTICLE PAGE (Steps 1 & 2)
// ─────────────────────────────────────────────────────────────────
function BlogPage({ stepIndex, onContinue }) {
  const art = ARTICLES[stepIndex];
  // phase: 'wait' (show instruction) | 'counting' (user returned) | 'done' (show continue)
  const [phase, setPhase] = useState('wait');
  const [secs, setSecs]   = useState(WAIT_SECS[stepIndex]);
  const [adClicked, setAdClicked] = useState(false);
  const leftRef = useRef(false);

  // Detect user leaving (ad click) then returning
  useEffect(() => {
    if (phase !== 'wait') return;
    const handler = () => {
      if (document.visibilityState === 'hidden') {
        leftRef.current = true;
      } else if (document.visibilityState === 'visible' && leftRef.current) {
        leftRef.current = false;
        setPhase('counting');
        setSecs(WAIT_SECS[stepIndex]);
      }
    };
    document.addEventListener('visibilitychange', handler);
    return () => document.removeEventListener('visibilitychange', handler);
  }, [phase, stepIndex]);

  // Countdown tick
  useEffect(() => {
    if (phase !== 'counting') return;
    if (secs <= 0) { setPhase('done'); return; }
    const t = setTimeout(() => setSecs(s => s - 1), 1000);
    return () => clearTimeout(t);
  }, [phase, secs]);

  const handleAdClick = () => {
    setAdClicked(true);
    // popunder fires globally on click — just update UI
  };

  const handleContinue = () => {
    fireVignette(); // fire full-screen ad between steps
    onContinue();
  };

  return (
    <div style={B.page}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Merriweather:wght@400;700;900&family=Inter:wght@400;500;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        body { margin: 0; }
        .blog-p { font-size: 1rem; line-height: 1.8; color: #374151; margin-bottom: 1.25rem; }
        .blog-tag { display: inline-block; background: #eff6ff; color: #2563eb; font-size: 0.7rem; font-weight: 800; padding: 3px 10px; border-radius: 20px; letter-spacing: 0.05em; }
        .cont-btn:hover { transform: translateY(-2px); box-shadow: 0 12px 28px rgba(37,99,235,0.45) !important; }
        .ad-box:hover { border-color: #f59e0b !important; background: #fffbeb !important; }
        @media (max-width: 600px) {
          .blog-title { font-size: 1.4rem !important; }
          .blog-content { padding: 0 1rem !important; }
        }
      `}</style>

      {/* ── TOP INSTRUCTION BANNER ── */}
      <div style={B.topBanner}>
        <span style={{ fontSize: '1.1rem' }}>📢</span>
        <div>
          <div style={{ fontWeight: 800, fontSize: '0.85rem' }}>
            CLICK BANNER BELOW — WAIT {WAIT_SECS[stepIndex]} SECONDS — COME BACK TO GET LINK
          </div>
          <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '2px' }}>
            👇 नीचे फोटो पर क्लिक करें, {WAIT_SECS[stepIndex]} सेकंड रुकें, और वापस आएं
          </div>
        </div>
        <div style={B.stepBadge}>
          Step {stepIndex + 1}/3
        </div>
      </div>

      {/* ── BLOG HEADER ── */}
      <header style={B.header}>
        <div style={B.headerInner}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '1.5rem' }}>{art.favicon}</span>
            <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#111', fontFamily: 'Merriweather, serif' }}>
              {art.siteName}
            </span>
          </div>
          <nav style={{ display: 'flex', gap: '1rem' }}>
            {['Home', 'Tech', 'Finance', 'Earn'].map(n => (
              <span key={n} style={{ fontSize: '0.8rem', color: '#6b7280', cursor: 'pointer', fontWeight: 600 }}>{n}</span>
            ))}
          </nav>
        </div>
      </header>

      <div style={B.contentWrap} className="blog-content">

        {/* ── ARTICLE HEADER ── */}
        <div style={{ background: art.heroColor, color: '#fff', padding: '2rem 1.5rem', borderRadius: '16px', marginBottom: '1.5rem' }}>
          <span className="blog-tag" style={{ background: 'rgba(255,255,255,0.2)', color: '#fff', marginBottom: '0.75rem', display: 'inline-block' }}>
            {art.category}
          </span>
          <h1 className="blog-title" style={{ fontSize: '1.75rem', fontWeight: 900, lineHeight: 1.3, marginBottom: '1rem', fontFamily: 'Merriweather, serif' }}>
            {art.title}
          </h1>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', fontSize: '0.8rem', opacity: 0.85 }}>
            <span>✍️ {art.author}</span>
            <span>📅 {art.date}</span>
            <span>⏱ {art.readTime}</span>
          </div>
        </div>

        {/* ── AD CLICK SECTION ── */}
        <div
          className="ad-box"
          onClick={handleAdClick}
          style={{
            border: `2px dashed ${phase === 'done' ? '#10b981' : '#f59e0b'}`,
            borderRadius: '16px',
            padding: '1.5rem',
            textAlign: 'center',
            background: phase === 'done' ? '#f0fdf4' : '#fffbeb',
            marginBottom: '1.5rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
          }}
        >
          <p style={{ fontSize: '0.6rem', fontWeight: 900, color: '#92400e', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>
            ADVERTISEMENT
          </p>

          {/* PHASE: wait — show clickable ad prompt */}
          {phase === 'wait' && (
            <>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                {adClicked ? '⏳' : '👆'}
              </div>
              <div style={{
                background: adClicked ? '#d1fae5' : 'linear-gradient(135deg, #f59e0b, #ef4444)',
                color: '#fff',
                borderRadius: '50px',
                padding: '0.875rem 2rem',
                fontWeight: 900,
                fontSize: '1rem',
                display: 'inline-block',
                marginBottom: '0.75rem',
                boxShadow: '0 4px 15px rgba(245,158,11,0.4)',
              }}>
                {adClicked ? '✅ Waiting... Please come back!' : '👉 CLICK HERE & WAIT & COME BACK'}
              </div>
              <p style={{ fontSize: '0.8rem', color: '#92400e', fontWeight: 600 }}>
                {adClicked
                  ? 'Stay on the ad for a few seconds, then press the back button'
                  : `Click the button above → Wait ${WAIT_SECS[stepIndex]} seconds → Press back → Get Link`}
              </p>
            </>
          )}

          {/* PHASE: counting — countdown after returning */}
          {phase === 'counting' && (
            <>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>⌛</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#065f46', marginBottom: '0.75rem' }}>
                ✅ Great! You came back. Please wait...
              </div>
              <div style={{
                width: '80px', height: '80px',
                borderRadius: '50%',
                background: `conic-gradient(#10b981 ${((WAIT_SECS[stepIndex] - secs) / WAIT_SECS[stepIndex]) * 360}deg, #d1fae5 0deg)`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                margin: '0 auto 0.75rem',
                boxShadow: '0 4px 15px rgba(16,185,129,0.3)',
              }}>
                <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
                  <span style={{ fontSize: '1.4rem', fontWeight: 900, color: '#059669', lineHeight: 1 }}>{secs}</span>
                  <span style={{ fontSize: '0.55rem', color: '#6b7280', fontWeight: 700 }}>secs</span>
                </div>
              </div>
              <p style={{ fontSize: '0.8rem', color: '#047857', fontWeight: 700 }}>
                Scroll down after {secs}s to get your link
              </p>
            </>
          )}

          {/* PHASE: done — show continue button */}
          {phase === 'done' && (
            <>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎉</div>
              <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#065f46', marginBottom: '1rem' }}>
                ✅ Verified! Scroll down and click CONTINUE
              </div>
            </>
          )}
        </div>

        {/* CONTINUE button — shown only when done */}
        {phase === 'done' && (
          <button
            className="cont-btn"
            onClick={handleContinue}
            style={{
              width: '100%', padding: '1.1rem',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff', border: 'none', borderRadius: '50px',
              fontSize: '1.05rem', fontWeight: 900,
              cursor: 'pointer', marginBottom: '1.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: '0 8px 20px rgba(37,99,235,0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            Scroll down And Click <span style={{ fontSize: '1.2rem' }}>CONTINUE</span> →
          </button>
        )}

        {/* ── ARTICLE CONTENT ── */}
        <div style={{ borderLeft: '4px solid #2563eb', paddingLeft: '1.25rem', marginBottom: '1.5rem', background: '#eff6ff', padding: '1rem 1rem 1rem 1.25rem', borderRadius: '0 12px 12px 0' }}>
          <p style={{ fontSize: '0.85rem', fontStyle: 'italic', color: '#1d4ed8', fontWeight: 600, margin: 0 }}>
            "The best time to start earning online was yesterday. The second best time is right now."
          </p>
        </div>

        {art.paragraphs.map((p, i) => (
          <p key={i} className="blog-p">{p}</p>
        ))}

        {/* ── TAGS ── */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '2rem' }}>
          {['Online Earning', 'India 2026', 'Link Shortener', 'Passive Income'].map(t => (
            <span key={t} className="blog-tag">#{t.replace(' ', '')}</span>
          ))}
        </div>

        {/* ── BOTTOM CONTINUE (repeat for scrollers) ── */}
        {phase === 'done' && (
          <button
            className="cont-btn"
            onClick={handleContinue}
            style={{
              width: '100%', padding: '1.1rem',
              background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
              color: '#fff', border: 'none', borderRadius: '50px',
              fontSize: '1.05rem', fontWeight: 900,
              cursor: 'pointer', marginBottom: '2rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              boxShadow: '0 8px 20px rgba(37,99,235,0.35)',
              transition: 'all 0.2s ease',
            }}
          >
            CONTINUE →
          </button>
        )}
      </div>

      {/* ── BLOG FOOTER ── */}
      <footer style={B.footer}>
        <p style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
          © 2026 {art.siteName} · All rights reserved · Powered by WallgoLinks
        </p>
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// FINAL PAGE (Step 3) — Arolinks style
// ─────────────────────────────────────────────────────────────────
function FinalPage({ alias, onGetLink }) {
  const [secs, setSecs]   = useState(6);
  const [ready, setReady] = useState(false);
  const [url, setUrl]     = useState(null);

  useEffect(() => {
    // Fetch real URL
    api.get(`/links/resolve/${alias}`)
      .then(r => setUrl(r.data.originalUrl))
      .catch(() => {});
    // 6s countdown
    let c = 6;
    const t = setInterval(() => {
      c--;
      setSecs(c);
      if (c <= 0) { clearInterval(t); setReady(true); }
    }, 1000);
    return () => clearInterval(t);
  }, [alias]);

  const handleGet = () => {
    if (url) { window.location.href = url; }
    else { onGetLink?.(); }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f0f4ff', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap');
        * { box-sizing: border-box; }
        .get-btn:hover { transform: translateY(-3px) !important; box-shadow: 0 18px 40px rgba(37,99,235,0.5) !important; }
      `}</style>

      {/* Nav */}
      <nav style={{ width: '100%', maxWidth: '600px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none', fontWeight: 900, fontSize: '1.1rem', color: '#111' }}>
          <div style={{ background: '#2563eb', borderRadius: '8px', padding: '5px 8px' }}>
            <Zap size={16} color="white" fill="white" />
          </div>
          Wallgo<span style={{ color: '#2563eb' }}>Links</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#fff', border: '1px solid #e2e8f0', borderRadius: '20px', padding: '4px 12px', fontSize: '0.7rem', fontWeight: 800, color: '#64748b' }}>
          <Shield size={12} color="#10b981" /> SECURE
        </div>
      </nav>

      {/* Progress bar */}
      <div style={{ width: '100%', maxWidth: '600px', padding: '0 1.5rem', marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[1, 2, 3].map(i => (
            <div key={i} style={{ flex: 1, height: '5px', borderRadius: '10px', background: '#2563eb' }} />
          ))}
        </div>
        <p style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700, marginTop: '6px', textAlign: 'center' }}>
          You are currently on step <strong style={{ color: '#2563eb' }}>3/3</strong> — Final Step!
        </p>
      </div>

      {/* Main card */}
      <div style={{ width: '100%', maxWidth: '520px', background: '#fff', borderRadius: '24px', boxShadow: '0 20px 60px rgba(0,0,0,0.1)', overflow: 'hidden', margin: '0 1rem 2rem' }}>

        {/* Telegram join section */}
        <div style={{ background: 'linear-gradient(135deg, #0088cc, #0066aa)', padding: '1.75rem 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✈️</div>
          <h2 style={{ color: '#fff', fontWeight: 900, fontSize: '1.2rem', marginBottom: '0.25rem' }}>
            ⬇️ JOIN OUR TELEGRAM CHANNEL TO <span style={{ color: '#ffd700' }}>GET LINK.</span> ⬇️
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.8rem', fontWeight: 600 }}>
            Get exclusive links, latest updates & more!
          </p>
          <a
            href="https://t.me/wallgolinks"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              background: '#fff', color: '#0088cc',
              borderRadius: '50px', padding: '0.75rem 2rem',
              fontWeight: 900, fontSize: '0.9rem', textDecoration: 'none',
              marginTop: '1rem', boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
            }}
          >
            ✈️ Join Our WallgoLinks Telegram Channel
          </a>
        </div>

        {/* Countdown + Get Link */}
        <div style={{ padding: '2rem 1.5rem', textAlign: 'center' }}>
          <p style={{ fontSize: '1rem', fontWeight: 700, color: '#374151', marginBottom: '1.25rem' }}>
            Your link is almost ready.
          </p>

          {/* Circle countdown */}
          <div style={{ position: 'relative', width: '100px', height: '100px', margin: '0 auto 1.5rem' }}>
            <svg width="100" height="100" style={{ transform: 'rotate(-90deg)' }}>
              <circle cx="50" cy="50" r="44" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="44" fill="none"
                stroke="#2563eb" strokeWidth="8"
                strokeDasharray={2 * Math.PI * 44}
                strokeDashoffset={2 * Math.PI * 44 * (secs / 6)}
                style={{ transition: '1s linear', strokeLinecap: 'round' }}
              />
            </svg>
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e40af', lineHeight: 1 }}>{secs}</span>
              <span style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: 700 }}>Seconds</span>
            </div>
          </div>

          {ready ? (
            <button
              className="get-btn"
              onClick={handleGet}
              style={{
                width: '100%', padding: '1.25rem',
                background: 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                color: '#fff', border: 'none', borderRadius: '50px',
                fontSize: '1.2rem', fontWeight: 900,
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                boxShadow: '0 10px 25px rgba(37,99,235,0.35)',
                transition: 'all 0.2s ease',
              }}
            >
              <ExternalLink size={22} /> Get Link
            </button>
          ) : (
            <div style={{ background: '#f1f5f9', borderRadius: '50px', padding: '1rem 2rem', fontSize: '0.85rem', fontWeight: 700, color: '#94a3b8', display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
              ⏳ Please wait {secs} seconds...
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer style={{ textAlign: 'center', padding: '1rem', fontSize: '0.75rem', color: '#94a3b8' }}>
        © 2026 WallgoLinks ·{' '}
        {['terms', 'privacy', 'dmca'].map((s, i) => (
          <span key={s}>
            <Link to={`/pages/${s}`} style={{ color: '#64748b', textDecoration: 'none', fontWeight: 700 }}>{s.toUpperCase()}</Link>
            {i < 2 && ' · '}
          </span>
        ))}
      </footer>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// MAIN REDIRECT COMPONENT
// ─────────────────────────────────────────────────────────────────
export default function RedirectPage() {
  const { alias: urlAlias } = useParams();
  const [searchParams] = useSearchParams();
  const alias = urlAlias || searchParams.get('alias');

  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(false);
  const [linkDetails, setLinkDetails] = useState(null);
  const [step, setStep] = useState(1);  // 1, 2 = blog pages; 3 = final

  // Init: load link + fire popunder + social bar
  useEffect(() => {
    if (!alias) { setLoading(false); setError(true); return; }
    (async () => {
      try {
        const res = await api.get(`/links/details/${alias}`);
        setLinkDetails(res.data);
        // Fire Monetag ads — only on redirect pages
        injectAd(MONETAG.popunder,  'popunder');
        injectAd(MONETAG.socialBar, 'socialBar');
      } catch { setError(true); }
      finally { setLoading(false); }
    })();
    return () => {
      document.querySelectorAll('.monetag-ad').forEach(s => s.remove());
      firedOnce.clear();
    };
  }, [alias]);

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚡</div>
        <p style={{ fontWeight: 700, color: '#64748b', fontSize: '1rem' }}>Preparing your link…</p>
      </div>
    </div>
  );

  if (error || !linkDetails) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', fontFamily: 'Inter, sans-serif' }}>
      <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
        <AlertCircle size={48} color="#ef4444" style={{ marginBottom: '1rem' }} />
        <h2 style={{ fontWeight: 900, marginBottom: '1rem', color: '#111' }}>Link Not Found</h2>
        <Link to="/" style={{ background: '#2563eb', color: '#fff', padding: '0.75rem 2rem', borderRadius: '50px', textDecoration: 'none', fontWeight: 800 }}>
          ← Go Home
        </Link>
      </div>
    </div>
  );

  // Step 1 → Blog Article 1
  if (step === 1) return (
    <BlogPage stepIndex={0} onContinue={() => setStep(2)} />
  );

  // Step 2 → Blog Article 2
  if (step === 2) return (
    <BlogPage stepIndex={1} onContinue={() => setStep(3)} />
  );

  // Step 3 → Final get-link page
  return <FinalPage alias={linkDetails.alias} />;
}

// ─── Blog Layout Styles ───────────────────────────────────────────
const B = {
  page: {
    minHeight: '100vh',
    background: '#fff',
    fontFamily: "'Inter', sans-serif",
  },
  topBanner: {
    background: 'linear-gradient(135deg, #1e3a8a, #1d4ed8)',
    color: '#fff',
    padding: '0.875rem 1.25rem',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
  },
  stepBadge: {
    marginLeft: 'auto',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '20px',
    padding: '3px 12px',
    fontSize: '0.7rem',
    fontWeight: 900,
    whiteSpace: 'nowrap',
    border: '1px solid rgba(255,255,255,0.3)',
  },
  header: {
    background: '#fff',
    borderBottom: '2px solid #f1f5f9',
    padding: '0.75rem 1.5rem',
    position: 'sticky',
    top: '58px',
    zIndex: 99,
  },
  headerInner: {
    maxWidth: '700px',
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  contentWrap: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '1.5rem 1.5rem 2rem',
  },
  footer: {
    background: '#f9fafb',
    borderTop: '1px solid #e5e7eb',
    padding: '1.5rem',
    textAlign: 'center',
  },
};
