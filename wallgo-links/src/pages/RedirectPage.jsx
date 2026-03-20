import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Zap, ExternalLink, ShieldCheck, AlertCircle, Info, Lock, ArrowRight, CheckCircle2, Download, MousePointer2, ShieldAlert } from 'lucide-react';
import AdBanner from '../components/AdBanner';

const RedirectPage = () => {
  const [config, setConfig] = useState({
    steps: 2,
    timer: 15,
    backgroundSites: ['https://www.pastex.online/'],
    adBannerIds: {
      top: 'fc4c80a53247a4cd577428a7e29741d0',
      sidebar: '3334f040539d82d83a45dcee7b1e54f2',
      content: '3334f040539d82d83a45dcee7b1e54f2'
    }
  });
  const [step, setStep] = useState(1);
  const [timeLeft, setTimeLeft] = useState(15);
  const [canProceed, setCanProceed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bgSite, setBgSite] = useState('https://www.pastex.online/');
  
  const [searchParams] = useSearchParams();
  const targetUrl = searchParams.get('target');

  useEffect(() => {
    api.get('/pages/settings/ad-config').then(r => {
      const conf = r.data.value || r.data;
      setConfig(conf);
      setTimeLeft(conf.timer || 15);
      if (conf.backgroundSites?.length) {
          setBgSite(conf.backgroundSites[Math.floor(Math.random() * conf.backgroundSites.length)]);
      }
    }).finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    let timer;
    // Step starts from 1. If step < config.steps, we just show "PROCEED" buttons.
    // The LAST step (step === config.steps) has the timer.
    if (step === config.steps && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (step === config.steps && timeLeft === 0) {
      setCanProceed(true);
    }
    return () => clearTimeout(timer);
  }, [step, timeLeft, config.steps]);

  const handleNextStep = () => {
    setStep(prev => prev + 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalRedirect = () => {
    if (targetUrl) {
      window.location.href = decodeURIComponent(targetUrl);
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050505', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Activity size={50} className="spin" style={{ color: '#7158E2' }} />
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#050505', color: 'white', fontFamily: "'Inter', sans-serif", position: 'relative', overflowX: 'hidden' }}>
      
      {/* BACKGROUND WEBSITE LAYER (From Admin Config) */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, pointerEvents: 'none', opacity: 0.15 }}>
        <iframe 
            src={bgSite}
            title="Background Verification"
            style={{ width: '100%', height: '100%', border: 'none' }} 
        />
      </div>

      {/* OVERLAY LAYERS */}
      <div style={{ position: 'fixed', top: '-10%', left: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(113,88,226,0.15) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 1 }}></div>
      <div style={{ position: 'fixed', bottom: '-10%', right: '-10%', width: '50%', height: '50%', background: 'radial-gradient(circle, rgba(76,29,149,0.1) 0%, transparent 70%)', filter: 'blur(100px)', pointerEvents: 'none', zIndex: 1 }}></div>

      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <nav style={{ padding: '1.25rem 2rem', borderBottom: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(30px)', background: 'rgba(10, 10, 12, 0.8)', position: 'sticky', top: 0 }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                <div style={{ background: '#7158E2', padding: '0.5rem', borderRadius: '10px' }}>
                <Zap size={22} color="white" fill="white" />
                </div>
                <span style={{ fontSize: '1.5rem', fontWeight: '950', letterSpacing: '-0.04em', color: 'white' }}>Wallgo<span style={{ color: '#7158E2' }}>Links</span></span>
            </Link>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <ShieldCheck size={14} /> SECURITY SCAN: OK
                </span>
                <div style={{ height: '24px', width: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Step {step} of {config.steps}</span>
            </div>
            </div>
        </nav>

        <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            
            {/* TOP AD GRID */}
            <div style={{ marginBottom: '2.5rem', display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', alignItems: 'center' }}>
                <AdBanner id={config.adBannerIds.top} format="iframe" height={90} width={728} />
                <div style={{ fontSize: '0.625rem', color: 'rgba(255,255,255,0.2)', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.1rem' }}>Global Sponsoring Nodes</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 3fr 1fr', gap: '2rem', width: '100%', maxWidth: '1400px' }}>
                
                {/* LEFT SIDEBAR ADS */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <AdBanner id={config.adBannerIds.sidebar} format="iframe" height={600} width={160} />
                    </div>
                </aside>

                {/* MAIN CONTENT AREA */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    
                    <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '32px', padding: '2.5rem', position: 'relative', overflow: 'hidden' }}>
                        <div style={{ display: 'flex', gap: '1.5rem', marginBottom: '2rem' }}>
                            <div style={{ background: 'rgba(113,88,226,0.15)', color: '#7158E2', padding: '1rem', borderRadius: '16px' }}><ShieldAlert size={32} /></div>
                            <div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '950', marginBottom: '0.5rem' }}>Automated Traffic Filter</h3>
                                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9375rem', lineHeight: '1.5' }}>Link metadata is being scanned across {config.steps} security layers. Destination payload is active within the cluster.</p>
                            </div>
                        </div>

                        {/* INTERMEDIATE STEPS */}
                        {step < config.steps ? (
                            <div style={{ textAlign: 'center', padding: '2rem 0' }}>
                                <div style={{ marginBottom: '2rem' }}>
                                    <AdBanner id={config.adBannerIds.content} format="iframe" height={250} width={300} />
                                </div>
                                <button 
                                    onClick={handleNextStep}
                                    style={{ 
                                        width: '100%', maxWidth: '400px', padding: '1.5rem', borderRadius: '20px', border: 'none', background: '#7158E2', color: 'white', fontSize: '1.25rem', fontWeight: '950', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', transition: '0.3s', boxShadow: '0 15px 30px rgba(113, 88, 226, 0.3)'
                                    }}
                                >
                                    CONTINUE TO NEXT PAGE <ArrowRight size={24} />
                                </button>
                                <div style={{ marginTop: '2.5rem' }}>
                                    <AdBanner id={config.adBannerIds.content} format="iframe" height={250} width={300} />
                                </div>
                            </div>
                        ) : (
                            /* FINAL STEP WITH TIMER */
                            <div style={{ textAlign: 'center' }}>
                                <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
                                    <button style={{ flex: 1, padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <Download size={18} /> High Speed DL
                                    </button>
                                    <button style={{ flex: 1, padding: '1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                        <MousePointer2 size={18} /> Secure Access
                                    </button>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '3rem' }}>
                                    <div style={{ position: 'relative', width: '160px', height: '160px' }}>
                                        <svg width="160" height="160" viewBox="0 0 120 120">
                                            <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                            <circle cx="60" cy="60" r="54" fill="none" stroke="#7158E2" strokeWidth="6" 
                                            strokeDasharray="339.29" 
                                            strokeDashoffset={339.29 - (339.29 * (config.timer - timeLeft) / config.timer)}
                                            strokeLinecap="round"
                                            style={{ transition: 'stroke-dashoffset 1s linear', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                            />
                                        </svg>
                                        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '3rem', fontWeight: '950' }}>
                                            {timeLeft > 0 ? timeLeft : <CheckCircle2 size={64} color="#10b981" />}
                                        </div>
                                    </div>
                                </div>

                                <div style={{ maxWidth: '400px', margin: '0 auto 3rem' }}>
                                    <AdBanner id={config.adBannerIds.content} format="iframe" height={250} width={300} />
                                </div>

                                <button 
                                    onClick={handleFinalRedirect}
                                    disabled={!canProceed}
                                    style={{ 
                                        width: '100%', padding: '1.5rem', borderRadius: '24px', border: 'none', 
                                        background: canProceed ? '#10b981' : 'rgba(255,255,255,0.05)', 
                                        color: canProceed ? 'white' : 'rgba(255,255,255,0.2)', 
                                        fontSize: '1.25rem', fontWeight: '950', cursor: canProceed ? 'pointer' : 'not-allowed', 
                                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', transition: '0.3s',
                                        boxShadow: canProceed ? '0 15px 40px rgba(16,185,129,0.3)' : 'none',
                                        letterSpacing: '0.05em'
                                    }}
                                >
                                    {canProceed ? 'GET DESTINATION LINK' : `WAIT FOR VERIFICATION (${timeLeft}s)`}
                                    <ExternalLink size={24} />
                                </button>
                            </div>
                        )}
                    </div>

                    {/* DYNAMIC AD GRID */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} style={{ background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '24px', padding: '0.75rem', textAlign: 'center' }}>
                                <AdBanner id={config.adBannerIds.content} format="iframe" height={250} width={300} />
                            </div>
                        ))}
                    </div>
                </div>

                {/* RIGHT SIDEBAR ADS */}
                <aside style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ background: 'rgba(255,255,255,0.02)', padding: '1rem', borderRadius: '24px', border: '1px solid rgba(255,255,255,0.05)' }}>
                        <AdBanner id={config.adBannerIds.sidebar} format="iframe" height={600} width={160} />
                    </div>
                </aside>
            </div>
        </main>

        <footer style={{ padding: '4rem 2rem', textAlign: 'center', background: 'rgba(0,0,0,0.5)', borderTop: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(10px)' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '3rem', marginBottom: '2.5rem' }}>
                {['FAQ', 'Terms', 'Privacy', 'Contact'].map(t => (
                    <Link key={t} to={`/pages/${t.toLowerCase()}`} style={{ color: 'rgba(255,255,255,0.3)', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.1em' }} className="hover:text-primary transition-colors">{t}</Link>
                ))}
                </div>
                <div style={{ marginBottom: '2.5rem', opacity: 0.5 }}>
                    <AdBanner id={config.adBannerIds.top} format="iframe" height={90} width={728} />
                </div>
                <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem', fontWeight: '600' }}>© 2026 Admin Controlled Transit Cluster. All encrypted traffic monitored.</p>
            </div>
        </footer>
      </div>

      <style>{`.hover\\:text-primary:hover { color: #7158E2 !important; } .transition-colors { transition: 0.3s; } .spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default RedirectPage;
