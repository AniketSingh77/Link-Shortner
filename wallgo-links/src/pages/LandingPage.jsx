import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, Globe, Shield, DollarSign, Users, BarChart2, Copy, Check,
  Mail, Youtube, Instagram, Twitter, Send, Sparkles, ArrowRight,
  Activity, TrendingUp, Sun, Moon, Menu, X
} from 'lucide-react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [url, setUrl] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!url) return;
    const token = localStorage.getItem('token');
    if (!token) { window.location.href = '/register'; return; }
    setLoading(true);
    try {
      const res = await api.post('/links/shorten', { originalUrl: url });
      setResult(`${window.location.origin}/${res.data.alias}`);
    } catch (err) {
      alert(err.response?.data?.msg || 'Authentication required.');
    } finally { setLoading(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>

      {/* ====== NAVBAR ====== */}
      <nav style={{
        height: '68px', display: 'flex', alignItems: 'center',
        padding: '0 5%', justifyContent: 'space-between',
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        background: 'var(--bg-white)', backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--border)'
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
          <div style={{ background: 'var(--primary)', padding: '0.45rem', borderRadius: '10px' }}>
            <Zap size={18} color="white" fill="white" />
          </div>
          <span style={{ fontSize: '1.375rem', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.02em' }}>
            Wallgo<span style={{ color: 'var(--primary)' }}>Links</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="landing-nav-links" style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/payout-rates" style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none' }}>Payout Rates</Link>
          <button onClick={toggleTheme} style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', color: 'var(--text)', width: '38px', height: '38px', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          {localStorage.getItem('token') ? (
            <Link to="/dashboard" style={{ background: 'var(--primary)', color: 'white', padding: '0.65rem 1.375rem', borderRadius: '30px', fontWeight: '700', fontSize: '0.875rem', textDecoration: 'none' }}>Dashboard</Link>
          ) : (
            <>
              <Link to="/login" style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9rem', textDecoration: 'none' }}>Login</Link>
              <Link to="/register" style={{ background: 'var(--primary)', color: 'white', padding: '0.65rem 1.375rem', borderRadius: '30px', fontWeight: '700', fontSize: '0.875rem', textDecoration: 'none' }}>Sign Up Free</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="landing-nav-mobile-btn"
          onClick={() => setMobileMenuOpen(o => !o)}
          style={{ background: 'none', border: 'none', color: 'var(--text)', cursor: 'pointer', padding: '0.5rem' }}
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div style={{
          position: 'fixed', top: '68px', left: 0, right: 0, zIndex: 999,
          background: 'var(--bg-white)', borderBottom: '1px solid var(--border)',
          padding: '1.5rem 5%', display: 'flex', flexDirection: 'column', gap: '1rem',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
        }}>
          <Link to="/payout-rates" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-muted)', fontWeight: '600', textDecoration: 'none', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>Payout Rates</Link>
          <button onClick={() => { toggleTheme(); setMobileMenuOpen(false); }} style={{ background: 'none', border: 'none', color: 'var(--text)', fontWeight: '600', cursor: 'pointer', padding: '0.5rem 0', textAlign: 'left', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />} Toggle Theme
          </button>
          {localStorage.getItem('token') ? (
            <Link to="/dashboard" onClick={() => setMobileMenuOpen(false)} style={{ background: 'var(--primary)', color: 'white', padding: '0.875rem', borderRadius: '12px', fontWeight: '700', textDecoration: 'none', textAlign: 'center' }}>Dashboard</Link>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)} style={{ color: 'var(--text-muted)', fontWeight: '600', textDecoration: 'none', padding: '0.5rem 0', textAlign: 'center' }}>Login</Link>
              <Link to="/register" onClick={() => setMobileMenuOpen(false)} style={{ background: 'var(--primary)', color: 'white', padding: '0.875rem', borderRadius: '12px', fontWeight: '700', textDecoration: 'none', textAlign: 'center' }}>Sign Up Free</Link>
            </>
          )}
        </div>
      )}

      {/* ====== HERO SECTION ====== */}
      <section style={{
        minHeight: '100vh', paddingTop: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', background: isDarkMode ? 'var(--bg)' : 'linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)',
        padding: '120px 5% 80px'
      }}>
        <div style={{ maxWidth: '860px', width: '100%' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.4rem 1rem', borderRadius: '30px', fontSize: '0.8rem', fontWeight: '700', marginBottom: '1.5rem' }}>
            <Sparkles size={14} /> #1 URL Shortener for Publishers
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 6vw, 4rem)', fontWeight: '900', color: 'var(--text)', lineHeight: '1.1', marginBottom: '1.25rem', letterSpacing: '-0.04em' }}>
            Shorten URLs and <br />
            <span style={{ color: 'var(--primary)' }}>Earn Money</span> easily
          </h1>
          <p style={{ fontSize: 'clamp(0.9rem, 2.5vw, 1.125rem)', color: 'var(--text-muted)', lineHeight: '1.6', marginBottom: '2.5rem', maxWidth: '600px', margin: '0 auto 2.5rem' }}>
            Join thousands of publishers who earn high CPM rates by sharing shortened links. Simple, fast, and transparent.
          </p>

          {/* Shorten Form */}
          <form onSubmit={handleShorten} style={{ background: 'var(--bg-card)', padding: '0.5rem', borderRadius: '50px', display: 'flex', boxShadow: 'var(--shadow)', maxWidth: '650px', margin: '0 auto 2rem', border: '1px solid var(--border)', gap: '0.5rem' }}>
            <input
              type="url" placeholder="Paste your long URL here..."
              value={url} onChange={e => setUrl(e.target.value)} required
              style={{ flex: 1, border: 'none', outline: 'none', padding: '0 1.25rem', fontSize: '1rem', background: 'transparent', color: 'var(--text)', minWidth: 0 }}
            />
            <button type="submit" disabled={loading} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.875rem 1.5rem', borderRadius: '40px', fontWeight: '800', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
              {loading ? 'Processing...' : <><span className="hide-sm">Shorten Now</span> <ArrowRight size={18} /></>}
            </button>
          </form>

          {result && (
            <div style={{ background: 'var(--primary-light)', border: '2px dashed var(--primary)', borderRadius: '20px', padding: '1.25rem 1.5rem', maxWidth: '650px', margin: '0 auto 2.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '0.95rem', flex: 1, wordBreak: 'break-all' }}>{result}</span>
              <button onClick={handleCopy} style={{ background: copied ? '#10b981' : 'var(--primary)', color: 'white', border: 'none', padding: '0.625rem 1.25rem', borderRadius: '12px', fontWeight: '700', cursor: 'pointer', flexShrink: 0 }}>
                {copied ? <><Check size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
          )}

          {/* Hero Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 'clamp(1.5rem, 5vw, 4rem)', flexWrap: 'wrap', opacity: 0.65, marginTop: '1rem' }}>
            {[['10k+', 'Active Users'], ['$50k+', 'Total Paid'], ['1M+', 'Links Shortened']].map(([v, l]) => (
              <div key={l} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'clamp(1.375rem, 4vw, 2rem)', fontWeight: '800' }}>{v}</div>
                <div style={{ fontSize: '0.825rem', fontWeight: '600' }}>{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 5%', background: 'var(--bg)' }}>
        <div style={{ textAlign: 'center', marginBottom: 'clamp(2.5rem, 6vw, 5rem)' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)', fontWeight: '900', marginBottom: '1rem' }}>How it works?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>Start earning in 3 simple steps</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 'clamp(1.5rem, 3vw, 3rem)' }}>
          {[
            { icon: Users, title: 'Create account', desc: 'Sign up for free and get access to your dashboard.', color: '#7158E2' },
            { icon: Zap, title: 'Shorten links', desc: 'Paste your long URLs and get shortened versions instantly.', color: '#EF4444' },
            { icon: DollarSign, title: 'Earn Money', desc: 'Share your links and earn money for every single click.', color: '#10B981' }
          ].map((step, i) => (
            <div key={i} style={{ padding: 'clamp(1.5rem, 4vw, 3rem)', borderRadius: '28px', background: 'var(--bg-alt)', border: '1px solid var(--border)', textAlign: 'center', transition: '0.3s' }} className="hover-lift">
              <div style={{ background: step.color, width: '64px', height: '64px', borderRadius: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', color: 'white', boxShadow: `0 10px 20px ${step.color}33` }}>
                <step.icon size={28} />
              </div>
              <h3 style={{ fontSize: 'clamp(1.1rem, 3vw, 1.5rem)', fontWeight: '800', marginBottom: '0.75rem', color: 'var(--text)' }}>{step.title}</h3>
              <p style={{ color: 'var(--text-muted)', lineHeight: '1.6', fontSize: '0.9rem' }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ====== FEATURES SECTION ====== */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 5%', background: 'var(--bg-alt)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 'clamp(2rem, 5vw, 6rem)', alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 3.5rem)', fontWeight: '900', lineHeight: '1.1', marginBottom: '2rem' }}>
              Premium Features <br />
              <span style={{ color: 'var(--primary)' }}>For Publishers</span>
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {[
                { title: 'High CPM Rates', desc: 'Get the best rates in the industry for your traffic.', icon: TrendingUp },
                { title: 'Fast Payouts', desc: 'Receive your earnings quickly via multiple methods.', icon: Zap },
                { title: 'Detailed Analytics', desc: 'Track your clicks and earnings in real-time.', icon: Activity },
                { title: 'Referral Program', desc: 'Earn extra 20% by referring your friends.', icon: Users },
              ].map((f, i) => (
                <div key={i} style={{ display: 'flex', gap: '1.25rem' }}>
                  <div style={{ color: 'var(--primary)', flexShrink: 0, marginTop: '2px' }}><f.icon size={24} /></div>
                  <div>
                    <h4 style={{ fontSize: '1.1rem', fontWeight: '800', marginBottom: '0.375rem', color: 'var(--text)' }}>{f.title}</h4>
                    <p style={{ color: 'var(--text-muted)', lineHeight: '1.5', fontSize: '0.875rem' }}>{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div style={{ position: 'relative' }}>
            <div style={{ background: 'var(--bg-card)', borderRadius: '32px', padding: 'clamp(1.5rem, 4vw, 3rem)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)', position: 'relative', zIndex: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)' }}>Earnings Overview</h3>
                <span style={{ color: '#10B981', fontWeight: '800', fontSize: '0.9rem' }}>+24% Increase</span>
              </div>
              <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '0.75rem' }}>
                {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                  <div key={i} style={{ flex: 1, background: i === 3 ? 'var(--primary)' : 'var(--bg-white)', height: `${h}%`, borderRadius: '8px', transition: '0.3s' }} />
                ))}
              </div>
            </div>
            <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '150px', height: '150px', background: 'var(--primary)', borderRadius: '50%', opacity: 0.08, filter: 'blur(40px)', pointerEvents: 'none' }} />
          </div>
        </div>
      </section>

      {/* ====== CTA SECTION ====== */}
      <section style={{ padding: 'clamp(60px, 10vw, 100px) 5%', textAlign: 'center', background: 'var(--bg)' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto' }}>
          <h2 style={{ fontSize: 'clamp(1.75rem, 5vw, 3rem)', fontWeight: '900', marginBottom: '1.25rem' }}>Ready to start earning?</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: 'clamp(0.9rem, 2vw, 1.1rem)', marginBottom: '2.5rem' }}>Join thousands of publishers already earning with WallgoLinks.</p>
          <Link to="/register" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.75rem', background: 'var(--primary)', color: 'white', padding: '1rem 2.5rem', borderRadius: '50px', fontWeight: '800', fontSize: '1.05rem', textDecoration: 'none', boxShadow: '0 10px 25px rgba(113,88,226,0.35)' }}>
            Get Started Free <ArrowRight size={20} />
          </Link>
        </div>
      </section>

      {/* ====== FOOTER ====== */}
      <footer style={{ background: 'var(--bg)', padding: 'clamp(50px, 8vw, 100px) 5% 40px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 'clamp(2rem, 4vw, 4rem)', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
              <div style={{ background: 'var(--primary)', padding: '0.45rem', borderRadius: '10px' }}><Zap size={18} color="white" fill="white" /></div>
              <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em' }}>Wallgo<span style={{ color: 'var(--primary)' }}>Links</span></span>
            </div>
            <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              Earn money by shortening your links. High CPM, fast payments, and trusted by thousands.
            </p>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {[Twitter, Instagram, Youtube, Send].map((Icon, i) => (
                <a key={i} href="#" style={{ color: 'var(--text-light)', transition: '0.3s' }}><Icon size={18} /></a>
              ))}
            </div>
          </div>
          <div>
            <h4 style={{ fontWeight: '800', marginBottom: '1.25rem', color: 'var(--text)' }}>Links</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <li><Link to="/payout-rates" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Payout Rates</Link></li>
              <li><Link to="/pages/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Terms of Use</Link></li>
              <li><Link to="/pages/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h4 style={{ fontWeight: '800', marginBottom: '1.25rem', color: 'var(--text)' }}>Support</h4>
            <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <li><Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>Contact Us</Link></li>
              <li><Link to="/pages/faq" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.9rem' }}>FAQ</Link></li>
            </ul>
          </div>
          <div style={{ background: 'var(--bg-alt)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)' }}>
            <h4 style={{ fontWeight: '800', marginBottom: '0.75rem', color: 'var(--text)' }}>Contact Us</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>Have questions? Reach out to our support team.</p>
            <a href="mailto:support@wallgolinks.com" style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', color: 'var(--primary)', fontWeight: '800', textDecoration: 'none', fontSize: '0.875rem', wordBreak: 'break-all' }}>
              <Mail size={16} /> support@wallgolinks.com
            </a>
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.85rem' }}>
          © {new Date().getFullYear()} Wallgo Links. All rights reserved.
        </div>
      </footer>

      <style>{`
        .hover-lift:hover { transform: translateY(-8px); box-shadow: var(--shadow-md) !important; }
        .hide-sm { display: inline; }
        @media (max-width: 400px) { .hide-sm { display: none; } }
      `}</style>
    </div>
  );
};

export default LandingPage;
