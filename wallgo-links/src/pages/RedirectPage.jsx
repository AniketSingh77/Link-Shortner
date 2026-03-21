import React, { useState, useEffect } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { 
  Zap, ExternalLink, ShieldCheck, AlertCircle, Info, Lock, 
  ArrowRight, CheckCircle2, Download, MousePointer2, 
  ShieldAlert, Activity, ChevronRight, Clock, Shield, DollarSign
} from 'lucide-react';
import AdBanner from '../components/AdBanner';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';

const RedirectPage = () => {
  const { isDarkMode } = useTheme();
  const { alias: urlAlias } = useParams();
  const [searchParams] = useSearchParams();
  const [config, setConfig] = useState(null);
  const [linkDetails, setLinkDetails] = useState(null);
  const [step, setStep] = useState(1);
  const [timerSeconds, setTimerSeconds] = useState(10);
  const [canProceed, setCanProceed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [finalUrl, setFinalUrl] = useState(null);
  const [popunderTriggered, setPopunderTriggered] = useState(false);

  useEffect(() => {
    const alias = urlAlias || searchParams.get('alias');
    if (!alias) {
        setLoading(false);
        return;
    }

    const loadData = async () => {
        try {
            const [adRes, linkRes] = await Promise.all([
                api.get('/pages/settings/ad-config'),
                api.get(`/links/details/${alias}`)
            ]);
            
            const conf = adRes.data.value || adRes.data;
            setConfig(conf);
            setLinkDetails(linkRes.data);
            
            // Step 1 initial timer
            setTimerSeconds(7); 

            // Inject Popunder & Social Bar scripts if available (Page 1)
            if (conf.adCodes?.popunder) {
                const div = document.createElement('div');
                div.innerHTML = conf.adCodes.popunder;
                executeScripts(div);
            }
            if (conf.adCodes?.socialBar) {
                const div = document.createElement('div');
                div.innerHTML = conf.adCodes.socialBar;
                executeScripts(div);
            }

        } catch (err) {
            console.error('Failed to load redirect data', err);
        } finally {
            setLoading(false);
        }
    };
    loadData();
  }, [urlAlias, searchParams]);

  const executeScripts = (container) => {
    const scripts = container.getElementsByTagName('script');
    for (let i = 0; i < scripts.length; i++) {
        const s = document.createElement('script');
        if (scripts[i].src) s.src = scripts[i].src;
        else s.innerHTML = scripts[i].innerHTML;
        document.body.appendChild(s);
    }
  };

  // Timer logic
  useEffect(() => {
    let timer;
    if (!loading && timerSeconds > 0) {
      timer = setTimeout(() => setTimerSeconds(timerSeconds - 1), 1000);
    } else if (timerSeconds === 0) {
      setCanProceed(true);
      if (step === 3) fetchFinalUrl();
    }
    return () => clearTimeout(timer);
  }, [timerSeconds, step, loading]);

  // Step 2 specific behaviors
  useEffect(() => {
    if (step === 2) {
        // Popunder again on Step 2 load
        if (config?.adCodes?.popunder) {
            const div = document.createElement('div');
            div.innerHTML = config.adCodes.popunder;
            executeScripts(div);
        }

        // Smartlink background trigger after 3s
        const smartlinkTimer = setTimeout(() => {
            if (config?.smartlink) {
                // Background iframe load (stealth)
                const ifr = document.createElement('iframe');
                ifr.src = config.smartlink;
                ifr.style.display = 'none';
                document.body.appendChild(ifr);
                console.log('Smartlink triggered backgroundly');
            }
        }, 3000);

        // Security: Disable right click & inspect
        const handleContextMenu = (e) => e.preventDefault();
        const handleKeyDown = (e) => {
            if (e.ctrlKey && (e.key === 'u' || e.key === 's' || e.shiftKey && e.key === 'i')) e.preventDefault();
        };
        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        return () => {
            clearTimeout(smartlinkTimer);
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }
  }, [step, config]);

  const fetchFinalUrl = async () => {
      try {
          const res = await api.get(`/links/resolve/${linkDetails.alias}`);
          setFinalUrl(res.data.originalUrl);
      } catch (err) {
          console.error('Failed to resolve link', err);
      }
  };

  const handleNextStep = () => {
    if (step === 1) {
        setStep(2);
        setTimerSeconds(config?.timer || 15);
        setCanProceed(false);
    } else if (step === 2) {
        setStep(3);
        setTimerSeconds(5);
        setCanProceed(false);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFinalRedirect = () => {
    if (finalUrl) {
      window.location.href = finalUrl;
    }
  };

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Activity size={50} className="spin" style={{ color: 'var(--primary)' }} />
    </div>
  );

  if (!linkDetails) return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '2rem' }}>
        <div>
            <AlertCircle size={64} color="#ef4444" style={{ marginBottom: '1.5rem' }} />
            <h2 style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text)' }}>Link Expired or Missing</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>This link has either been deleted or the alias is incorrect.</p>
            <Link to="/" style={{ background: 'var(--primary)', color: 'white', padding: '1rem 2rem', borderRadius: '12px', textDecoration: 'none', fontWeight: '800' }}>Back to Home</Link>
        </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', color: '#1e293b', fontFamily: "'Inter', sans-serif" }}>
      
      {/* MONETIZATION OVERLAYS (Invisible) */}
      <div id="ad-slots" />

      {/* TOP BANNER AD (Sticky) */}
      <div style={{ width: '100%', minHeight: '90px', background: '#fff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '10px' }}>
          <AdBanner rawCode={config?.adCodes?.top} width={728} height={90} />
      </div>

      <nav style={{ background: '#fff', borderBottom: '1px solid #e2e8f0', padding: '0.75rem 1.5rem', sticky: 'top', zIndex: 100 }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <div style={{ background: '#2563eb', padding: '0.4rem', borderRadius: '8px' }}>
                    <Zap size={20} color="white" fill="white" />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.04em', color: '#1e293b' }}>Wallgo<span style={{ color: '#2563eb' }}>Links</span></span>
            </Link>
            <div style={{ background: '#f1f5f9', padding: '6px 12px', borderRadius: '20px', fontSize: '0.7rem', fontWeight: '800', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Shield size={14} color="#10b981" /> SECURE LINK GATEWAY
            </div>
        </div>
      </nav>

      <main style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        
        {/* STEP PROGRESS BAR */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem' }}>
            {[1, 2, 3].map(i => (
                <div key={i} style={{ flex: 1, height: '6px', borderRadius: '10px', background: step >= i ? '#2563eb' : '#e2e8f0', transition: '0.4s' }} />
            ))}
        </div>

        {step === 1 && (
            <div style={{ background: '#fff', borderRadius: '24px', padding: '3rem 2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: '900', marginBottom: '1rem', color: '#0f172a' }}>Your link is almost ready</h1>
                <p style={{ color: '#64748b', fontWeight: '500', marginBottom: '2.5rem' }}>Please verify that you are a human to continue.</p>
                
                <div style={{ marginBottom: '2.5rem', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ background: '#f8fafc', padding: '2rem', borderRadius: '20px', border: '2px dashed #cbd5e1', width: '100%', maxWidth: '400px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
                        {timerSeconds > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                                <div style={{ fontSize: '2.5rem', fontWeight: '950', color: '#2563eb' }}>{timerSeconds}s</div>
                                <span style={{ fontSize: '0.8rem', fontWeight: '800', color: '#64748b' }}>VERIFYING SOURCE...</span>
                            </div>
                        ) : (
                            <button 
                                onClick={handleNextStep}
                                style={{ 
                                    width: '100%', padding: '1.25rem', borderRadius: '16px', border: 'none', background: '#1e293b', color: '#fff', 
                                    fontSize: '1.1rem', fontWeight: '900', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
                                }}
                            >
                                <CheckCircle2 size={22} color="#10b981" /> I AM HUMAN. CONTINUE
                            </button>
                        )}
                    </div>
                </div>

                <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Advertisement</div>
                <div style={{ marginTop: '1rem', minHeight: '250px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AdBanner rawCode={config?.adCodes?.content} width={300} height={250} />
                </div>
            </div>
        )}

        {step === 2 && (
            <div style={{ background: '#fff', borderRadius: '24px', padding: '2.5rem 2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1.5rem' }}>Generating your download link...</h2>
                
                {/* PROGRESS BAR ANIMATION */}
                <div style={{ width: '100%', height: '8px', background: '#f1f5f9', borderRadius: '10px', overflow: 'hidden', marginBottom: '2rem' }}>
                    <div style={{ 
                        height: '100%', background: 'linear-gradient(90deg, #2563eb, #60a5fa)', 
                        width: `${((config.timer - timerSeconds) / config.timer) * 100}%`, transition: '1s linear' 
                    }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '2.5rem' }}>
                    <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f1f5f9' }}>
                         <div style={{ fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', marginBottom: '10px' }}>SPONSORED</div>
                         <AdBanner rawCode={config?.adCodes?.content} width={300} height={250} />
                    </div>
                    <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '1.5rem', border: '1px solid #f1f5f9' }}>
                         <div style={{ fontSize: '0.65rem', fontWeight: '900', color: '#94a3b8', marginBottom: '10px' }}>SPONSORED</div>
                         <AdBanner rawCode={config?.adCodes?.sidebar} width={300} height={250} />
                    </div>
                </div>

                <div style={{ minHeight: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                     {timerSeconds > 0 ? (
                         <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                             <Activity className="spin" color="#2563eb" size={24} />
                             <span style={{ fontWeight: '800', color: '#64748b' }}>Please wait {timerSeconds}s</span>
                         </div>
                     ) : (
                         <button 
                            onClick={handleNextStep}
                            style={{ 
                                width: '100%', maxWidth: '400px', padding: '1.25rem', borderRadius: '16px', border: 'none', background: '#2563eb', color: '#fff', 
                                fontSize: '1.25rem', fontWeight: '950', cursor: 'pointer', boxShadow: '0 8px 16px rgba(37, 99, 235, 0.25)'
                            }}
                         >
                             CONTINUE ➔
                         </button>
                     )}
                </div>
            </div>
        )}

        {step === 3 && (
            <div style={{ background: '#fff', borderRadius: '24px', padding: '3rem 2rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', textAlign: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: '900', marginBottom: '1rem' }}>Redirecting to destination...</h2>
                <p style={{ color: '#64748b', fontWeight: '600', marginBottom: '2.5rem' }}>Thank you for using our link shortener network.</p>

                <div style={{ marginBottom: '2.5rem', minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <AdBanner rawCode={config?.adCodes?.content} width={300} height={100} />
                </div>

                {timerSeconds > 0 ? (
                    <div style={{ fontSize: '2rem', fontWeight: '950', color: '#10b981' }}>{timerSeconds}s</div>
                ) : (
                    <button 
                        onClick={handleFinalRedirect}
                        style={{ 
                            width: '100%', maxWidth: '400px', padding: '1.5rem', borderRadius: '50px', border: 'none', background: '#10b981', color: '#fff', 
                            fontSize: '1.5rem', fontWeight: '950', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '15px'
                        }}
                    >
                        GET LINK <ExternalLink size={28} />
                    </button>
                )}
            </div>
        )}

        {/* BOTTOM AD BOX */}
        <div style={{ marginTop: '2.5rem', textAlign: 'center', opacity: 0.8 }}>
             <div style={{ fontSize: '0.6rem', color: '#94a3b8', fontWeight: '900', marginBottom: '10px' }}>SPONSORED LINKS</div>
             <AdBanner rawCode={config?.adCodes?.top} width={728} height={90} />
        </div>

      </main>

      <footer style={{ background: '#fff', borderTop: '1px solid #e2e8f0', padding: '3rem 1.5rem', marginTop: '4rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: '600' }}>&copy; 2026 Wallgo Links Network. Real-time Ad Auctioning Enabled.</p>
        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '2rem' }}>
            <Link to="/pages/terms" style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textDecoration: 'none' }}>Terms</Link>
            <Link to="/pages/privacy" style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textDecoration: 'none' }}>Privacy</Link>
            <Link to="/contact" style={{ fontSize: '0.75rem', fontWeight: '800', color: '#64748b', textDecoration: 'none' }}>Support</Link>
        </div>
      </footer>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default RedirectPage;
