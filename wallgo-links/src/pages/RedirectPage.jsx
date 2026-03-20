import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Zap, ExternalLink, ShieldCheck, AlertCircle, Info, Lock } from 'lucide-react';

const RedirectPage = () => {
  const [timeLeft, setTimeLeft] = useState(8);
  const [ready, setReady] = useState(false);
  const [searchParams] = useSearchParams();
  const targetUrl = searchParams.get('target');

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setReady(true);
    }
  }, [timeLeft]);

  const handleSkip = () => {
    if (targetUrl) {
      window.location.href = decodeURIComponent(targetUrl);
    } else {
      alert('Security violation: Destination link missing!');
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: '#0a0a0c', color: 'white', fontFamily: "'Inter', sans-serif" }}>
      {/* Background Accents */}
      <div style={{ position: 'fixed', top: '20%', left: '10%', width: '400px', height: '400px', background: 'var(--primary)', filter: 'blur(150px)', opacity: 0.15, borderRadius: '50%', zIndex: 0 }}></div>
      <div style={{ position: 'fixed', bottom: '10%', right: '10%', width: '300px', height: '300px', background: '#4c1d95', filter: 'blur(150px)', opacity: 0.1, borderRadius: '50%', zIndex: 0 }}></div>

      <nav style={{ width: '100%', padding: '2rem 1.5rem', display: 'flex', justifyContent: 'center', zIndex: 10 }}>
         <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{ background: 'var(--primary)', padding: '0.6rem', borderRadius: '12px' }}>
              <Zap size={24} color="white" fill="white" />
            </div>
          <span style={{ fontSize: '1.625rem', fontWeight: '950', color: 'white', letterSpacing: '-0.04em' }}>Wallgo<span className="text-primary-light"> Links</span></span>
          </Link>
      </nav>

      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', zIndex: 10 }}>
        {/* Ad Space Top */}
        <div style={{ marginBottom: '3rem', width: '100%', maxWidth: '728px', height: '90px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
           <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', fontWeight: '700', letterSpacing: '0.1em' }}>SPONSORED CONTENT</span>
        </div>

        <div style={{ 
          width: '100%', 
          maxWidth: '540px', 
          background: 'rgba(255,255,255,0.01)', 
          backdropFilter: 'blur(30px)', 
          border: '1px solid rgba(255,255,255,0.08)', 
          borderRadius: '32px', 
          padding: '3.5rem 2.5rem', 
          textAlign: 'center',
          boxShadow: '0 40px 100px rgba(0,0,0,0.4)'
        }}>
          <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
             <Lock size={14} /> SECURE GATEWAY
          </div>
          <h2 style={{ fontSize: '1.875rem', fontWeight: '900', color: 'white', marginBottom: '1rem', letterSpacing: '-0.02em' }}>
            Verification Required
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '3rem', fontSize: '1rem', fontWeight: '500', lineHeight: '1.6' }}>
            Please wait while our security protocols validate your destination link for potential threats.
          </p>

          {/* Luxury Timer Integration */}
          <div style={{ position: 'relative', display: 'inline-block', marginBottom: '3.5rem' }}>
            <svg width="140" height="140" viewBox="0 0 140 140">
              <circle cx="70" cy="70" r="64" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="4" />
              <circle cx="70" cy="70" r="64" fill="none" stroke="var(--primary)" strokeWidth="6" 
                strokeDasharray="402.12" 
                strokeDashoffset={402.12 - (402.12 * (8 - timeLeft) / 8)}
                strokeLinecap="round"
                style={{ transition: 'stroke-dashoffset 1s linear', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
              />
            </svg>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
              {timeLeft > 0 ? (
                <div style={{ fontSize: '3rem', fontWeight: '900', color: 'white' }}>{timeLeft}</div>
              ) : (
                <div style={{ background: '#10b981', padding: '0.75rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 30px rgba(16,185,129,0.3)' }}>
                   <ShieldCheck size={40} color="white" />
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <button 
              className={`btn ${ready ? 'btn-primary' : 'btn-dark'}`} 
              disabled={!ready}
              onClick={handleSkip}
              style={{ 
                padding: '1.25rem', 
                width: '100%', 
                fontSize: '1.125rem', 
                fontWeight: '900', 
                borderRadius: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                border: ready ? 'none' : '1px solid rgba(255,255,255,0.1)',
                color: ready ? 'white' : 'rgba(255,255,255,0.3)'
              }}
            >
              {ready ? 'DECRYPT & PROCEED' : `INITIALIZING (${timeLeft}s)`}
              {ready && <ExternalLink size={20} />}
            </button>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', fontWeight: '700' }}>
               <Info size={12} /> DO NOT REFRESH THIS PAGE
            </div>
          </div>
        </div>

        {/* Ad Space Bottom */}
        <div style={{ marginTop: '4rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', width: '100%', maxWidth: '800px' }}>
           {[1, 2].map(i => (
             <div key={i} style={{ height: '250px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '0.7rem', fontWeight: '800' }}>AD UNIT 300x250</span>
             </div>
           ))}
        </div>
      </main>

      <footer style={{ width: '100%', padding: '3rem', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.05)', background: '#08080a', zIndex: 10 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
           {['Security Policy', 'Ad Transparency', 'Report Fraud', 'Contact Group'].map(t => (
             <Link key={t} to="#" style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: '700' }}>{t}</Link>
           ))}
        </div>
        <div style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', fontWeight: '600' }}>
           © 2026 Wallgo Security Infrastructure. Powered by LinkGuard™ Pro.
        </div>
      </footer>
    </div>
  );
};

export default RedirectPage;
