import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Zap, ExternalLink, ShieldCheck, AlertCircle, Info, Lock, ArrowRight, CheckCircle2 } from 'lucide-react';
import AdBanner from '../components/AdBanner';

const RedirectPage = () => {
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(15);
  const [canProceed, setCanProceed] = useState(false);
  const [searchParams] = useSearchParams();
  const targetUrl = searchParams.get('target');

  useEffect(() => {
    let timer;
    if (step === 2 && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (step === 2 && timeLeft === 0) {
      setCanProceed(true);
    }
    return () => clearTimeout(timer);
  }, [step, timeLeft]);

  const handleNextStep = () => {
    setStep(2);
    // Trigger a popunder/vignette if needed here
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalRedirect = () => {
    if (targetUrl) {
      window.location.href = decodeURIComponent(targetUrl);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: 'white', fontFamily: "'Inter', sans-serif", display: 'flex', flexDirection: 'column' }}>
      {/* Dynamic Background */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(113,88,226,0.15) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(76,29,149,0.1) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none' }}></div>

      <nav style={{ padding: '1.5rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)', sticky: 'top', zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
            <div style={{ background: '#7158E2', padding: '0.5rem', borderRadius: '10px' }}>
              <Zap size={22} color="white" fill="white" />
            </div>
            <span style={{ fontSize: '1.5rem', fontWeight: '900', letterSpacing: '-0.04em' }}>Wallgo<span style={{ color: '#7158E2' }}>Links</span></span>
          </Link>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Secure Gateway v2.4</div>
        </div>
      </nav>

      <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 10 }}>
        
        {/* Top Banner Ad */}
        <div style={{ marginBottom: '2rem' }}>
          <AdBanner id="fc4c80a53247a4cd577428a7e29741d0" format="iframe" height={90} width={728} />
        </div>

        <div style={{ 
          width: '100%', 
          maxWidth: '600px', 
          background: 'rgba(255,255,255,0.02)', 
          backdropFilter: 'blur(40px)', 
          border: '1px solid rgba(255,255,255,0.1)', 
          borderRadius: '32px', 
          padding: '3rem 2rem',
          textAlign: 'center',
          boxShadow: '0 30px 60px rgba(0,0,0,0.5)'
        }}>
          {step === 1 ? (
            <>
              <div style={{ display: 'inline-flex', padding: '1rem', background: 'rgba(113,88,226,0.1)', borderRadius: '24px', color: '#7158E2', marginBottom: '1.5rem' }}>
                <ShieldCheck size={40} />
              </div>
              <h2 style={{ fontSize: '2rem', fontWeight: '900', marginBottom: '1rem' }}>User Verification</h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2.5rem', lineHeight: '1.6' }}>
                To protect our network from automated traffic, please click the button below to prove you are human.
              </p>
              
              <button 
                onClick={handleNextStep}
                style={{ 
                  width: '100%', padding: '1.25rem', borderRadius: '16px', border: 'none', background: '#7158E2', color: 'white', fontSize: '1.125rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: '0.3s'
                }}
              >
                CLICK HERE TO VERIFY <ArrowRight size={20} />
              </button>
            </>
          ) : (
            <>
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2.5rem' }}>
                <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                  <svg width="120" height="120" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#7158E2" strokeWidth="6" 
                      strokeDasharray="339.29" 
                      strokeDashoffset={339.29 - (339.29 * (15 - timeLeft) / 15)}
                      strokeLinecap="round"
                      style={{ transition: 'stroke-dashoffset 1s linear', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                    />
                  </svg>
                  <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '2.5rem', fontWeight: '900' }}>
                    {timeLeft > 0 ? timeLeft : <CheckCircle2 size={48} color="#10b981" />}
                  </div>
                </div>
              </div>

              <h2 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '1rem' }}>
                {timeLeft > 0 ? 'Verification in Progress...' : 'Link is Ready!'}
              </h2>
              <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2.5rem', fontSize: '0.925rem' }}>
                {timeLeft > 0 ? 'Wait a few seconds while we safely decrypt your destination URL.' : 'Your link has been successfully verified. Click below to proceed.'}
              </p>

              <button 
                onClick={handleFinalRedirect}
                disabled={!canProceed}
                style={{ 
                  width: '100%', padding: '1.25rem', borderRadius: '16px', border: 'none', 
                  background: canProceed ? '#10b981' : 'rgba(255,255,255,0.05)', 
                  color: canProceed ? 'white' : 'rgba(255,255,255,0.2)', 
                  fontSize: '1.125rem', fontWeight: '800', cursor: canProceed ? 'pointer' : 'not-allowed', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: '0.3s',
                  boxShadow: canProceed ? '0 10px 30px rgba(16,185,129,0.3)' : 'none'
                }}
              >
                {canProceed ? 'GET LINK NOW' : `PLEASE WAIT (${timeLeft}s)`}
                <ExternalLink size={20} />
              </button>
            </>
          )}
        </div>

        {/* Bottom Banner Ads */}
        <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', width: '100%', maxWidth: '900px' }}>
          {[1, 2].map(i => (
            <div key={i} style={{ padding: '10px', background: 'rgba(255,255,255,0.01)', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.08)' }}>
               <AdBanner id="3334f040539d82d83a45dcee7b1e54f2" format="iframe" height={250} width={300} />
            </div>
          ))}
        </div>

      </main>

      <footer style={{ padding: '3rem', textAlign: 'center', background: '#080808', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '2rem', marginBottom: '1.5rem' }}>
           {['FAQ', 'Terms', 'Privacy', 'Contact'].map(t => (
             <Link key={t} to={`/pages/${t.toLowerCase()}`} style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '0.8125rem', fontWeight: '700' }}>{t}</Link>
           ))}
        </div>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>© 2026 Wallgo Security Mesh. All encrypted traffic is monitored.</p>
      </footer>
    </div>
  );
};

export default RedirectPage;
