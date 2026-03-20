import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { Zap, BookOpen, ChevronRight, FileText, Shield, Scale, Info, HelpCircle, Mail, Sparkles, ArrowLeft, Terminal, Activity, Sun, Moon } from 'lucide-react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';

const StaticPage = () => {
  const { slug } = useParams();
  const { isDarkMode, toggleTheme } = useTheme();
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
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: 'var(--text)', overflowX: 'hidden' }}>
      
      {/* ====== ELITE NAVBAR ====== */}
      <nav style={{ 
        height: '80px', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 5%', 
        justifyContent: 'space-between', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000, 
        backdropFilter: 'blur(20px)', 
        background: 'var(--bg-white)',
        opacity: 0.95,
        borderBottom: '1px solid var(--border)'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', textDecoration: 'none' }}>
          <div style={{ background: 'var(--primary)', padding: '0.625rem', borderRadius: '14px', boxShadow: '0 8px 16px rgba(107, 93, 211, 0.4)', transform: 'rotate(-5deg)' }}>
            <Zap size={24} color="white" fill="white" />
          </div>
          <span style={{ fontSize: '1.625rem', fontWeight: '950', color: 'var(--text)', letterSpacing: '-0.04em' }}>Wallgo<span style={{ color: 'var(--primary)' }}> Links</span></span>
        </Link>

        <div style={{ display: 'flex', gap: '2.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.9375rem', textDecoration: 'none' }}>HOME</Link>
          <Link to="/payout-rates" style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.9375rem', textDecoration: 'none' }}>PAYOUT RATES</Link>
          
          <button onClick={toggleTheme} style={{ 
              background: 'var(--bg-alt)', 
              border: '1px solid var(--border)', 
              color: 'var(--text)', 
              width: '40px', height: '40px', 
              borderRadius: '10px', 
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer'
          }}>
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <Link to="/login" style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '12px', 
            fontWeight: '800', 
            fontSize: '0.875rem', 
            textDecoration: 'none'
          }}>DASHBOARD</Link>
        </div>
      </nav>

      {/* Modern Header Terminal */}
      <header style={{ 
        background: isDarkMode ? 'radial-gradient(circle at 50% 100%, rgba(107, 93, 211, 0.15), transparent 70%)' : 'var(--bg-alt)', 
        padding: '180px 10% 80px', 
        textAlign: 'center', 
        position: 'relative',
        borderBottom: '1px solid var(--border)'
      }}>
         <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ color: 'var(--primary)', fontWeight: '950', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
               <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-light)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--primary)' }}>
                  <Terminal size={14} /> Documentation
               </span>
            </div>
            <h1 style={{ fontSize: '4rem', fontWeight: '950', color: 'var(--text)', letterSpacing: '-0.05em', margin: 0, lineHeight: '1.1' }}>
              {page?.title || slug.toUpperCase().replace(/-/g, ' ')}
            </h1>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '3rem', color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '800' }}>
               <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>Home</Link>
               <ChevronRight size={18} />
               <span style={{ color: 'var(--primary)' }}>{page?.title || slug}</span>
            </div>
         </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1000px', margin: '0 auto', padding: '60px 5%' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '6rem' }}>
            <Activity size={48} className="spin" style={{ color: 'var(--primary)' }} />
          </div>
        ) : page ? (
          <div style={{ 
            background: 'var(--bg-card)', 
            padding: '4rem', 
            borderRadius: '32px', 
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)',
            position: 'relative'
          }}>
            <article style={{ lineHeight: '1.8', color: 'var(--text-muted)', fontSize: '1.125rem' }}>
              <div dangerouslySetInnerHTML={{ 
                __html: page.content
                  .replace(/\n/g, '<br/>')
                  .replace(/##\s?(.*)/g, '<h2 style="margin: 3rem 0 1.5rem; font-weight: 950; color: var(--text); letter-spacing: -0.04em; font-size: 2rem; display: flex; align-items: center; gap: 1rem;"><div style="width: 4px; height: 32px; background: var(--primary); border-radius: 4px;"></div> $1</h2>')
                  .replace(/###\s?(.*)/g, '<h3 style="margin: 2rem 0 1rem; font-weight: 900; color: var(--primary); font-size: 1.375rem; letter-spacing: -0.02em;">$1</h3>')
                  .replace(/<strong>(.*?)<\/strong>/g, '<strong style="color: var(--text); font-weight: 900;">$1</strong>')
              }} />
            </article>
            
            <div style={{ marginTop: '5rem', paddingTop: '3rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
               <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ background: 'var(--bg-alt)', padding: '0.75rem', borderRadius: '14px', color: 'var(--text-light)' }}>{getIcon()}</div>
                  <div>
                    <div style={{ fontSize: '0.75rem', fontWeight: '950', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.1rem' }}>Updated On</div>
                    <div style={{ fontSize: '0.875rem', fontWeight: '800', color: 'var(--text)' }}>{new Date(page.updatedAt || Date.now()).toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' })}</div>
                  </div>
               </div>
               <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text)', fontWeight: '800', fontSize: '0.875rem', textDecoration: 'none', background: 'var(--bg-alt)', padding: '0.875rem 1.5rem', borderRadius: '14px', border: '1px solid var(--border)' }}>
                  <ArrowLeft size={18} /> GO BACK
               </Link>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '8rem 2rem', background: 'var(--bg-card)', borderRadius: '32px', border: '2px dashed var(--border)' }}>
            <BookOpen size={64} style={{ color: 'var(--text-light)', marginBottom: '2.5rem', opacity: 0.3 }} />
            <h3 style={{ fontWeight: '950', fontSize: '2rem', color: 'var(--text)', letterSpacing: '-0.03em' }}>Node Missing</h3>
            <p style={{ color: 'var(--text-muted)', fontWeight: '600', marginBottom: '3rem', fontSize: '1.125rem' }}>The document you are looking for has been archived or moved.</p>
            <Link to="/" style={{ background: 'var(--primary)', color: 'white', padding: '1rem 2.5rem', borderRadius: '14px', fontWeight: '800', fontSize: '1rem', textDecoration: 'none', boxShadow: '0 10px 20px rgba(107, 93, 211, 0.3)' }}>Return Home</Link>
          </div>
        )}
      </main>

      <style>{`
        .spin { animation: spin 2s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

export default StaticPage;
