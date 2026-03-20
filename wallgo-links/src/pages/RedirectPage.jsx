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
  const [timeLeft, setTimeLeft] = useState(10);
  const [canProceed, setCanProceed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [finalUrl, setFinalUrl] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

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
            setTimeLeft(conf.timer || 10);

            // Inject Popunder & Social Bar scripts if available
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

  useEffect(() => {
    let timer;
    if (config && step === config.steps && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (config && step === config.steps && timeLeft === 0) {
      setCanProceed(true);
      fetchFinalUrl();
    }
    return () => clearTimeout(timer);
  }, [step, timeLeft, config]);

  const fetchFinalUrl = async () => {
      try {
          const res = await api.get(`/links/resolve/${linkDetails.alias}`);
          setFinalUrl(res.data.originalUrl);
      } catch (err) {
          console.error('Failed to resolve link', err);
      }
  };

  const handleNextStep = () => {
    setIsCapturing(true);
    setTimeout(() => {
        setStep(prev => prev + 1);
        setIsCapturing(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 800);
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

  const currentBgSite = config?.stepConfigs?.find(s => s.step === step)?.website;

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-alt)', color: 'var(--text)', fontFamily: "'Inter', sans-serif", position: 'relative' }}>
      
      {/* BACKGROUND WEBSITE (Professional Blog Mode) */}
      {currentBgSite && currentBgSite !== 'https://' && (
          <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.5, pointerEvents: 'none' }}>
              <iframe src={currentBgSite} title="bg" style={{ width: '100%', height: '100%', border: 'none' }} />
          </div>
      )}

      {/* DARK OVERLAY FOR FOCUS */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)', zIndex: 1, pointerEvents: 'none' }} />

      {/* STICKY TOP AD */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '90px', zIndex: 1000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
           <AdBanner rawCode={config?.adCodes?.top} id={config?.adBannerIds?.top} format="iframe" width={728} height={90} />
      </div>

      {/* STICKY BOTTOM AD */}
      <div style={{ position: 'fixed', bottom: 0, left: 0, width: '100%', height: '90px', zIndex: 1000, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
           <AdBanner rawCode={config?.adCodes?.top} id={config?.adBannerIds?.top} format="iframe" width={728} height={90} />
      </div>

      {/* PROFESSIONAL NAVBAR */}
      <nav style={{ 
          background: 'rgba(255,255,255,0.05)', 
          backdropFilter: 'blur(10px)',
          borderBottom: '1px solid rgba(255,255,255,0.1)', 
          padding: '1rem 2rem', 
          position: 'fixed', 
          top: '90px', 
          width: '100%',
          zIndex: 900,
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <div style={{ background: 'var(--primary)', padding: '0.4rem', borderRadius: '8px' }}>
                    <Zap size={20} color="white" fill="white" />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.04em', color: 'var(--text)' }}>Wallgo<span style={{ color: 'var(--primary)' }}>Links</span></span>
            </Link>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', color: '#10b981', fontWeight: '700', fontSize: '0.75rem' }}>
                    <ShieldCheck size={16} /> CLOUD SECURE
                </div>
            </div>
        </div>
      </nav>

      <main style={{ maxWidth: '900px', margin: '180px auto', padding: '0 1.5rem', position: 'relative', zIndex: 10 }}>
        
        {/* MAIN HERO CARD (Centered Floating Glass Widget) */}
        <div style={{ 
            background: 'rgba(255,255,255,0.95)', 
            backdropFilter: 'blur(15px)',
            borderRadius: '28px', 
            padding: '3rem', 
            border: '1px solid white',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
            position: 'relative',
            overflow: 'hidden',
            color: '#1a1a1a'
        }}>
                    <div style={{ position: 'relative', zIndex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                             <div>
                                <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase', marginBottom: '1rem', display: 'inline-block' }}>
                                    External Destination Ready
                                </span>
                                <h1 style={{ fontSize: '2rem', fontWeight: '950', color: '#000', lineHeight: '1.1', letterSpacing: '-0.02em' }}>{linkDetails.title}</h1>
                                <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.8rem', fontWeight: '600' }}>You are currently on <span style={{ color: 'var(--primary)', fontWeight: '800' }}>Step {step}/{config.steps}</span>. Please verify to reach destination.</p>
                             </div>
                             <div style={{ textAlign: 'right' }}>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '700' }}>VERIFICATION</div>
                                <div style={{ fontSize: '1.5rem', fontWeight: '950', color: 'var(--primary)' }}>STEP {step}/{config.steps}</div>
                             </div>
                        </div>

                        {/* STEP PROGRESS BAR */}
                        <div style={{ height: '8px', background: 'var(--bg-alt)', borderRadius: '10px', marginBottom: '2.5rem', overflow: 'hidden' }}>
                            <div style={{ 
                                height: '100%', background: 'var(--primary)', 
                                width: `${(step/config.steps) * 100}%`, transition: '1s cubic-bezier(0.4, 0, 0.2, 1)' 
                            }} />
                        </div>

                        <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                            {step < config.steps ? (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2rem' }}>
                                    <div style={{ background: 'var(--bg-alt)', padding: '2.5rem', borderRadius: '24px', width: '100%', border: '1px solid var(--border)', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.02)' }}>
                                        <p style={{ fontWeight: '800', color: 'var(--text)', marginBottom: '1.5rem', fontSize: '1.125rem' }}>System is scanning for safety...</p>
                                        <button 
                                            onClick={handleNextStep}
                                            disabled={isCapturing}
                                            style={{ 
                                                width: '100%', maxWidth: '320px', padding: '1.25rem', borderRadius: '18px', border: 'none', 
                                                background: 'var(--primary)', color: 'white', fontSize: '1.125rem', fontWeight: '950', cursor: 'pointer', 
                                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: '0.3s',
                                                boxShadow: '0 15px 30px rgba(113, 88, 226, 0.4)'
                                            }}
                                        >
                                            {isCapturing ? 'Verifying...' : 'CONTINUE TO NEXT'}
                                            {isCapturing ? <Activity className="spin" size={20} /> : <ChevronRight size={22} />}
                                        </button>
                                    </div>
                                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-light)', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: '600' }}>
                                        <Shield size={16} /> Secure Verification Protocol Powered by Wallgo
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2.5rem' }}>
                                    {timeLeft > 0 ? (
                                        <div style={{ position: 'relative', width: '150px', height: '150px' }}>
                                            <svg width="150" height="150" viewBox="0 0 150 150">
                                                <circle cx="75" cy="75" r="68" fill="none" stroke="var(--border)" strokeWidth="10" />
                                                <circle cx="75" cy="75" r="68" fill="none" stroke="var(--primary)" strokeWidth="10" 
                                                    strokeDasharray="427.26" 
                                                    strokeDashoffset={427.26 - (427.26 * (config.timer - timeLeft) / config.timer)}
                                                    strokeLinecap="round"
                                                    style={{ transition: 'stroke-dashoffset 1.1s linear', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                                />
                                            </svg>
                                            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
                                                <div style={{ fontSize: '3rem', fontWeight: '950', color: 'var(--text)', letterSpacing: '-0.05em' }}>{timeLeft}</div>
                                                <div style={{ fontSize: '0.65rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase' }}>Seconds</div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div style={{ background: '#10b9811a', color: '#10b981', padding: '1.25rem 2.5rem', borderRadius: '16px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '1rem', border: '1px solid #10b98133' }}>
                                            <CheckCircle2 size={28} /> Target URL Unlocked!
                                        </div>
                                    )}

                                    <button 
                                        onClick={handleFinalRedirect}
                                        disabled={!canProceed}
                                        style={{ 
                                            width: '100%', maxWidth: '400px', padding: '1.5rem', borderRadius: '24px', border: 'none', 
                                            background: canProceed ? '#10b981' : 'var(--border)', 
                                            color: canProceed ? 'white' : 'var(--text-light)', 
                                            fontSize: '1.35rem', fontWeight: '950', cursor: canProceed ? 'pointer' : 'not-allowed', 
                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', transition: '0.4s',
                                            boxShadow: canProceed ? '0 20px 40px rgba(16, 185, 129, 0.4)' : 'none'
                                        }}
                                    >
                                        {canProceed ? 'GET LINK NOW' : `GENERATING LINK (${timeLeft}s)`}
                                        {canProceed ? <ExternalLink size={28} /> : <Lock size={26} />}
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

        {/* IN-PAGE BANNER ADS */}
        <div style={{ marginTop: '2.5rem', display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem' }} className="responsive-grid">
            <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #eee', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '1rem', fontWeight: '800' }}>ADVERTISEMENT</div>
                <AdBanner rawCode={config?.adCodes?.content} width={300} height={250} />
            </div>
            <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #eee', textAlign: 'center' }}>
                <div style={{ fontSize: '0.75rem', color: '#999', marginBottom: '1rem', fontWeight: '800' }}>ADVERTISEMENT</div>
                <AdBanner rawCode={config?.adCodes?.sidebar} width={250} height={250} />
            </div>
        </div>

        {/* BOTTOM WIDE AD */}
        <div style={{ marginTop: '4rem', textAlign: 'center', paddingBottom: '5rem' }}>
             <div style={{ fontSize: '0.7rem', color: 'var(--text-light)', marginBottom: '1rem', fontWeight: '800' }}>ADVERTISEMENT</div>
            <AdBanner rawCode={config?.adCodes?.top} id={config?.adBannerIds?.top} format="iframe" width={728} height={90} />
        </div>
      </main>

      <footer style={{ background: 'var(--bg-card)', borderTop: '1px solid var(--border)', padding: '3rem 2rem', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', fontWeight: '600' }}>
            &copy; 2026 Wallgo Links Network. Trusted by 10k+ Publishers.
        </p>
        <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
             <Link to="/pages/terms" style={{ color: 'var(--text-light)', fontSize: '0.75rem', textDecoration: 'none', fontWeight: '700' }}>Terms</Link>
             <Link to="/pages/privacy" style={{ color: 'var(--text-light)', fontSize: '0.75rem', textDecoration: 'none', fontWeight: '700' }}>Privacy</Link>
             <Link to="/contact" style={{ color: 'var(--text-light)', fontSize: '0.75rem', textDecoration: 'none', fontWeight: '700' }}>Contact</Link>
        </div>
      </footer>

      <style>{`
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 991px) {
            .responsive-grid { grid-template-columns: 100% !important; }
            .mobile-single { grid-template-columns: 100% !important; }
        }
      `}</style>
    </div>
  );
};

export default RedirectPage;
