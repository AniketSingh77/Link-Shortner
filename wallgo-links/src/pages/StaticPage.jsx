import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Zap, BookOpen, ChevronRight, FileText, Shield, Scale, Info, HelpCircle, Mail, Sparkles, ArrowLeft, Terminal, Activity } from 'lucide-react';
import api from '../utils/api';

const StaticPage = () => {
  const { slug } = useParams();
  const location = useLocation();
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPage = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/pages/${slug}`);
        setPage(res.data);
      } catch (e) {
        setPage(null);
      } finally {
        setLoading(false);
      }
    };
    fetchPage();
    window.scrollTo(0, 0);
  }, [slug]);

  // Dynamic Icon Selection
  const getIcon = () => {
    if (slug?.includes('terms')) return <Scale size={24} />;
    if (slug?.includes('privacy')) return <Shield size={24} />;
    if (slug?.includes('dmca')) return <Info size={24} />;
    if (slug?.includes('faq')) return <HelpCircle size={24} />;
    if (slug?.includes('contact')) return <Mail size={24} />;
    return <FileText size={24} />;
  };

  return (
    <div style={{ background: '#0a0a0c', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: 'white', overflowX: 'hidden' }}>
      
      {/* ====== ELITE NAVBAR ====== */}
      <nav style={{ 
        height: '90px', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 5%', 
        justifyContent: 'space-between', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000, 
        backdropFilter: 'blur(30px)', 
        background: 'rgba(10, 10, 12, 0.8)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', textDecoration: 'none' }}>
          <div style={{ background: 'var(--primary)', padding: '0.625rem', borderRadius: '14px', boxShadow: '0 8px 16px rgba(107, 93, 211, 0.4)', transform: 'rotate(-5deg)' }}>
            <Zap size={24} color="white" fill="white" />
          </div>
          <span style={{ fontSize: '1.625rem', fontWeight: '950', color: 'white', letterSpacing: '-0.04em' }}>Wallgo<span className="text-primary-light"> Links</span></span>
        </Link>

        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: '0.9375rem', textDecoration: 'none' }}>NETWORK</Link>
          <Link to="/payout-rates" style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: '0.9375rem', textDecoration: 'none' }}>YIELD RATES</Link>
          <Link to="/login" style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: '0.9375rem', textDecoration: 'none' }}>IDENTIFY</Link>
          <Link to="/register" style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            padding: '0.875rem 2rem', 
            borderRadius: '16px', 
            fontWeight: '950', 
            fontSize: '0.9375rem', 
            boxShadow: '0 10px 20px rgba(107, 93, 211, 0.3)',
            border: '1px solid rgba(255,255,255,0.1)',
            textDecoration: 'none'
          }}>DEPLOY NODE</Link>
        </div>
      </nav>

      {/* Modern Header Terminal */}
      <header style={{ 
        background: 'radial-gradient(circle at 50% 100%, rgba(107, 93, 211, 0.15), transparent 70%)', 
        padding: '240px 10% 120px', 
        textAlign: 'center', 
        position: 'relative',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
         <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ color: 'var(--primary-light)', fontWeight: '950', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
               <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(107, 93, 211, 0.1)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(107, 93, 211, 0.2)' }}>
                  <Terminal size={14} /> Official Documentation Grid
               </span>
            </div>
            <h1 style={{ fontSize: '5rem', fontWeight: '950', color: 'white', letterSpacing: '-0.05em', margin: 0, lineHeight: '1.1' }}>
              {page?.title || slug.toUpperCase().replace(/-/g, ' ')}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '3rem', color: 'rgba(255,255,255,0.3)', fontSize: '1rem', fontWeight: '800' }}>
               <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }} className="hover:text-white transition-colors">Manifesto Home</Link>
               <ChevronRight size={18} />
               <span style={{ color: 'var(--primary-light)' }}>{page?.title || slug}</span>
            </div>
         </div>
      </header>

      {/* Main Content Area: The Ivory Document */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '80px 5%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '10rem' }}>
            <div className="spin" style={{ color: 'var(--primary)', marginBottom: '3rem' }}><Zap size={64} strokeWidth={1.5} /></div>
            <div style={{ fontWeight: '950', color: 'white', letterSpacing: '0.2rem', textTransform: 'uppercase', fontSize: '0.875rem' }}>Synchronizing Content Matrix...</div>
          </div>
        ) : page ? (
          <div className="glass-container" style={{ 
            background: 'rgba(255, 255, 255, 0.02)', 
            padding: '5rem', 
            borderRadius: '48px', 
            border: '1px solid rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)',
            position: 'relative'
          }}>
            <article className="static-content" style={{ lineHeight: '2', color: 'rgba(255,255,255,0.6)', fontSize: '1.25rem' }}>
              <div dangerouslySetInnerHTML={{ 
                __html: page.content
                  .replace(/\n/g, '<br/>')
                  .replace(/##\s?(.*)/g, '<h2 style="margin: 4rem 0 1.5rem; font-weight: 950; color: white; letter-spacing: -0.04em; font-size: 2.25rem; display: flex; align-items: center; gap: 1rem;"><div style="width: 4px; height: 32px; background: var(--primary); border-radius: 4px;"></div> $1</h2>')
                  .replace(/###\s?(.*)/g, '<h3 style="margin: 3rem 0 1rem; font-weight: 900; color: var(--primary-light); font-size: 1.5rem; letter-spacing: -0.02em;">$1</h3>')
                  .replace(/<strong>(.*?)<\/strong>/g, '<strong style="color: white; font-weight: 900;">$1</strong>')
              }} />
            </article>
            
            <div style={{ marginTop: '6rem', paddingTop: '4rem', borderTop: '1px solid rgba(255,255,255,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', padding: '0.75rem', borderRadius: '14px', color: 'rgba(255,255,255,0.3)' }}>{getIcon()}</div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '950', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1rem' }}>Last Verification</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '800', color: 'white' }}>{new Date(page.updatedAt || Date.now()).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                  </div>
               </div>
               <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'white', fontWeight: '950', fontSize: '0.875rem', textDecoration: 'none', background: 'rgba(255,255,255,0.03)', padding: '1rem 2rem', borderRadius: '18px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <ArrowLeft size={18} /> RESUME SESSION
               </Link>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '12rem 3rem', background: 'rgba(255,255,255,0.01)', borderRadius: '48px', border: '2px dashed rgba(255,255,255,0.05)' }}>
            <BookOpen size={80} style={{ color: 'rgba(255,255,255,0.1)', marginBottom: '3rem' }} />
            <h3 style={{ fontWeight: '950', fontSize: '2.5rem', color: 'white', letterSpacing: '-0.03em' }}>Node Missing</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '600', marginBottom: '4rem', fontSize: '1.25rem', maxWidth: '500px', margin: '1rem auto 4rem' }}>The document you are looking for has been archived or moved to a different network cluster.</p>
            <Link to="/" style={{ background: 'var(--primary)', color: 'white', padding: '1.25rem 3rem', borderRadius: '20px', fontWeight: '950', fontSize: '1.125rem', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', boxShadow: '0 20px 40px rgba(107, 93, 211, 0.3)' }}>Return to Command Center</Link>
          </div>
        )}
      </main>

      {/* ====== ELITE FOOTER ====== */}
      <footer style={{ background: '#0a0a0c', padding: '120px 10% 60px', position: 'relative', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '5rem', marginBottom: '8rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '10px' }}>
                <Zap size={22} color="white" fill="white" />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: '950', color: 'white' }}>Wallgo Links</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: '1.8', fontSize: '1.125rem', marginBottom: '3rem', fontWeight: '600' }}>
              Architecting the future of digital monetization through sovereign network nodes and high-performance publisher infrastructure.
            </p>
          </div>

          <div>
             <h4 style={{ color: 'white', fontWeight: '950', marginBottom: '2.5rem', fontSize: '1.125rem', letterSpacing: '0.05em' }}>ECOSYSTEM</h4>
             <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', listStyle: 'none', padding: 0 }}>
               <li><Link to="/payout-rates" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '700', textDecoration: 'none' }} className="hover:text-white transition-colors">Yield Desk</Link></li>
               <li><Link to="/login" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '700', textDecoration: 'none' }} className="hover:text-white transition-colors">Control Portal</Link></li>
               <li><Link to="/developer-tools" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '700', textDecoration: 'none' }} className="hover:text-white transition-colors">API Layers</Link></li>
             </ul>
          </div>

          <div>
             <h4 style={{ color: 'white', fontWeight: '950', marginBottom: '2.5rem', fontSize: '1.125rem', letterSpacing: '0.05em' }}>LEGAL PROTOCOL</h4>
             <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', listStyle: 'none', padding: 0 }}>
               <li><Link to="/pages/terms" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '700', textDecoration: 'none' }} className="hover:text-white transition-colors">Terms of Force</Link></li>
               <li><Link to="/pages/privacy" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '700', textDecoration: 'none' }} className="hover:text-white transition-colors">Privacy Protocol</Link></li>
               <li><Link to="/pages/dmca" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '700', textDecoration: 'none' }} className="hover:text-white transition-colors">Rights Registry</Link></li>
             </ul>
          </div>

          <div>
             <h4 style={{ color: 'white', fontWeight: '950', marginBottom: '2.5rem', fontSize: '1.125rem', letterSpacing: '0.05em' }}>AUTHORITY</h4>
             <p style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '600', marginBottom: '2rem' }}>Direct integration with our elite support division.</p>
             <Link to="/contact" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)', padding: '1.25rem', borderRadius: '18px', display: 'flex', alignItems: 'center', gap: '1rem', color: 'white', textDecoration: 'none', fontWeight: '800' }}>
               <Mail size={20} color="var(--primary-light)" /> Open Support Link
             </Link>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.9375rem', fontWeight: '700' }}>
          <span>© 2026 Wallgo Links Infrastructure. SECURED BY RSA-4096 NODE.</span>
          <div style={{ display: 'flex', gap: '3rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Shield size={16} /> ENTERPRISE CERTIFIED</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={16} /> SYSTEM STATUS: OPTIMAL</div>
          </div>
        </div>
      </footer>

      <style>{`
        .static-content a { color: var(--primary-light); text-decoration: none; font-weight: 800; border-bottom: 2px solid rgba(107, 93, 211, 0.3); }
        .static-content a:hover { border-bottom-color: var(--primary); }
        .static-content ul, .static-content ol { margin: 2rem 0; padding-left: 2rem; }
        .static-content li { margin-bottom: 1rem; }
        .hover\\:text-white:hover { color: white !important; }
        .spin { animation: spin 4s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default StaticPage;
