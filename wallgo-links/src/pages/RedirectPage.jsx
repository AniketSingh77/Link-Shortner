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
  const [hasTapped, setHasTapped] = useState(false);
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
    // TRIGGER INITIAL POPUNDER ON FIRST CLICK
    if (!popunderTriggered && config?.adCodes?.popunder) {
        setPopunderTriggered(true);
        const div = document.createElement('div');
        div.innerHTML = config.adCodes.popunder;
        executeScripts(div);
    }

    if (!hasTapped) {
        setHasTapped(true);
        setIsCapturing(true);
        setTimeout(() => {
            setIsCapturing(false);
        }, 3000); // Fake verification delay
        return;
    }

    setStep(prev => prev + 1);
    setHasTapped(false);
    setIsCapturing(false);
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
        {/* PROFESSIONAL FLOATING WIDGET (Indiaearnx Style) */}
        <div style={{ 
            background: 'white', 
            borderRadius: '12px', 
            padding: '2.5rem', 
            border: '1px solid #ddd',
            boxShadow: '0 30px 60px rgba(0,0,0,0.3)',
            position: 'relative',
            textAlign: 'center',
            color: '#333'
        }}>
           <div style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1a1a1a', lineBreak: 'anywhere' }}>{linkDetails.title}</h1>
                <p style={{ color: '#666', fontSize: '0.8125rem', fontWeight: '700' }}>ADVERTISEMENT</p>
           </div>

           {/* AD BLOCK 1 (Inside Card Above Button) */}
           <div style={{ marginBottom: '2rem', minHeight: '250px', background: '#f9f9f9', borderRadius: '8px', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <AdBanner rawCode={config?.adCodes?.content} width={300} height={250} />
                <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#007bff', color: 'white', fontSize: '10px', padding: '2px 8px', borderRadius: '4px', fontWeight: '900' }}>Close Ad</div>
           </div>

           <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                <p style={{ fontWeight: '800', fontSize: '0.875rem' }}>You are on Step {step} of {config.steps}</p>
                
                {step < config.steps ? (
                    <button 
                        onClick={handleNextStep}
                        disabled={isCapturing}
                        style={{ 
                            width: '100%', maxWidth: '350px', padding: '1rem', borderRadius: '50px', border: 'none', 
                            background: '#007bff', color: 'white', fontSize: '1.25rem', fontWeight: '950', cursor: 'pointer', 
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: '0.2s',
                            boxShadow: '0 8px 15px rgba(0, 123, 255, 0.3)'
                        }}
                    >
                        {isCapturing ? 'PLEASE WAIT...' : (hasTapped ? 'CONTINUE ➔' : 'OPEN ➔')}
                        {!isCapturing && <ArrowRight size={24} />}
                    </button>
                ) : (
                    <div style={{ width: '100%', maxWidth: '400px' }}>
                        {timeLeft > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                                <div style={{ fontSize: '2rem', fontWeight: '900', color: '#007bff' }}>{timeLeft}s</div>
                                <p style={{ fontWeight: '700', color: '#666' }}>Please wait for target link...</p>
                            </div>
                        ) : (
                            <button 
                                onClick={handleFinalRedirect}
                                disabled={!canProceed}
                                style={{ 
                                    width: '100%', padding: '1.25rem', borderRadius: '50px', border: 'none', 
                                    background: '#10b981', color: 'white', fontSize: '1.5rem', fontWeight: '950', cursor: 'pointer', 
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem',
                                    boxShadow: '0 15px 30px rgba(16, 185, 129, 0.3)'
                                }}
                            >
                                GET LINK <ExternalLink size={24} />
                            </button>
                        )}
                    </div>
                )}
           </div>
           
           {/* AD BLOCK 2 (Below Button) */}
           <div style={{ marginTop: '2rem', minHeight: '100px', background: '#f9f9f9', borderRadius: '8px', border: '1px dashed #ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <AdBanner rawCode={config?.adCodes?.content} width={300} height={100} />
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
