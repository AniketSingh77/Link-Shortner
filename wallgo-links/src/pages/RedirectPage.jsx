import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Zap, ExternalLink, ShieldCheck, AlertCircle, Info, Lock, ArrowRight, CheckCircle2, Download, MousePointer2, ShieldAlert, Activity } from 'lucide-react';
import AdBanner from '../components/AdBanner';
import api from '../utils/api';

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

  // Helper function to determine background site based on step and config
  const getBgSiteForStep = (currentStep, currentConfig) => {
    if (currentConfig?.stepConfigs && currentConfig.stepConfigs.length > 0) {
      const stepConf = currentConfig.stepConfigs.find(s => s.step === currentStep);
      if (stepConf && stepConf.website) return stepConf.website;
      // Fallback to the first step's website if current step not found
      if (currentConfig.stepConfigs[0]?.website) {
        return currentConfig.stepConfigs[0].website;
      }
    }
    // Fallback to general backgroundSites or default if stepConfigs not available
    if (currentConfig?.backgroundSites?.length) {
      return currentConfig.backgroundSites[Math.floor(Math.random() * currentConfig.backgroundSites.length)];
    }
    return 'https://www.pastex.online/';
  };

  useEffect(() => {
    api.get('/pages/settings/ad-config').then(r => {
      const conf = r.data.value || r.data;
      setConfig(conf);
      setTimeLeft(conf.timer || 15);
      // Set initial background site based on fetched config and current step
      setBgSite(getBgSiteForStep(step, conf));
    }).finally(() => setLoading(false));
  }, []); // Empty dependency array means this runs once on mount

  // Effect to update background site when step or config changes
  useEffect(() => {
    if (!loading) { // Only update after initial config is loaded
      setBgSite(getBgSiteForStep(step, config));
    }
  }, [step, config, loading]); // Depend on step, config, and loading state

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
    <div style={{ minHeight: '100vh', background: '#000', color: 'white', fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden' }}>
      
      {/* BACKGROUND WEBSITE LAYER (Interactive) */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', zIndex: 0 }}>
        <iframe 
            src={bgSite}
            title="Background Verification"
            style={{ width: '100%', height: '100%', border: 'none' }} 
        />
      </div>

      {/* OVERLAY UI (Pointer events controlled) */}
      <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', minHeight: '100vh', pointerEvents: 'none' }}>
        
        {/* NAV (Translucent) */}
        <nav style={{ padding: '0.75rem 2rem', backdropFilter: 'blur(30px)', background: 'rgba(5, 5, 8, 0.7)', borderBottom: '1px solid rgba(255,255,255,0.05)', pointerEvents: 'auto' }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                <div style={{ background: '#7158E2', padding: '0.4rem', borderRadius: '8px' }}>
                <Zap size={18} color="white" fill="white" />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: '950', letterSpacing: '-0.04em', color: 'white' }}>Wallgo<span style={{ color: '#7158E2' }}>Links</span></span>
            </Link>
            <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.7rem', fontWeight: '800', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <ShieldCheck size={14} /> SCRANNED: OK
                </span>
                <span style={{ fontSize: '0.7rem', fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Step {step}/{config.steps}</span>
            </div>
            </div>
        </nav>

        <main style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            
            {/* FLOATING VERIFICATION BOX (Pointer events auto) */}
            <div style={{ 
                background: 'rgba(10, 10, 12, 0.9)', 
                backdropFilter: 'blur(40px)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                borderRadius: '32px', 
                padding: '2rem', 
                maxWidth: '500px', 
                width: '100%',
                boxShadow: '0 50px 100px rgba(0,0,0,0.5)', 
                pointerEvents: 'auto',
                position: 'relative'
            }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <div style={{ background: '#7158E21a', color: '#7158E2', width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                        <ShieldAlert size={28} />
                    </div>
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '950', marginBottom: '0.5rem' }}>Secure Link Filter</h3>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8125rem', lineHeight: '1.5' }}>Link is being verified. Please follow the instructions to proceed.</p>
                </div>

                <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
                     <AdBanner id={config.adBannerIds.content} format="iframe" height={250} width={300} />
                </div>

                {step < config.steps ? (
                   <button 
                       onClick={handleNextStep}
                       style={{ 
                           width: '100%', padding: '1.25rem', borderRadius: '16px', border: 'none', background: '#7158E2', color: 'white', fontSize: '1.125rem', fontWeight: '950', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: '0.2s', boxShadow: '0 10px 20px rgba(113, 88, 226, 0.3)'
                       }}
                   >
                       CONTINUE <ArrowRight size={20} />
                   </button>
                ) : (
                   <div>
                       <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '2rem' }}>
                           <div style={{ position: 'relative', width: '120px', height: '120px' }}>
                               <svg width="120" height="120" viewBox="0 0 120 120">
                                   <circle cx="60" cy="60" r="54" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
                                   <circle cx="60" cy="60" r="54" fill="none" stroke="#7158E2" strokeWidth="6" 
                                   strokeDasharray="339.29" 
                                   strokeDashoffset={339.29 - (339.29 * (config.timer - timeLeft) / config.timer)}
                                   strokeLinecap="round"
                                   style={{ transition: 'stroke-dashoffset 1s linear', transform: 'rotate(-90deg)', transformOrigin: 'center' }}
                                   />
                               </svg>
                               <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '2.5rem', fontWeight: '950' }}>
                                   {timeLeft > 0 ? timeLeft : <CheckCircle2 size={50} color="#10b981" />}
                               </div>
                           </div>
                       </div>
                       <button 
                           onClick={handleFinalRedirect}
                           disabled={!canProceed}
                           style={{ 
                               width: '100%', padding: '1.25rem', borderRadius: '20px', border: 'none', 
                               background: canProceed ? '#10b981' : 'rgba(255,255,255,0.05)', 
                               color: canProceed ? 'white' : 'rgba(255,255,255,0.2)', 
                               fontSize: '1.125rem', fontWeight: '950', cursor: canProceed ? 'pointer' : 'not-allowed', 
                               display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', transition: '0.3s'
                           }}
                       >
                           {canProceed ? 'DECRYPT LINK & GO' : `PROCESSING (${timeLeft}s)`}
                           <ExternalLink size={20} />
                       </button>
                   </div>
                )}

                <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
                     <div style={{ fontSize: '0.6rem', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>Sponsored Ad</div>
                     <AdBanner id={config.adBannerIds.sidebar} format="iframe" height={90} width={250} />
                </div>
            </div>
            
            {/* FLOATING ADS (Pointer events auto) */}
            <div style={{ 
                position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 100, pointerEvents: 'auto' 
            }}>
                <div style={{ background: 'rgba(0,0,0,0.8)', padding: '0.5rem', borderRadius: '15px', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <AdBanner id={config.adBannerIds.content} format="iframe" height={250} width={300} />
                </div>
            </div>
        </main>

        <footer style={{ padding: '1rem', textAlign: 'center', pointerEvents: 'auto', background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(10px)' }}>
             <AdBanner id={config.adBannerIds.top} format="iframe" height={90} width={728} />
        </footer>
      </div>

      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
};

export default RedirectPage;
