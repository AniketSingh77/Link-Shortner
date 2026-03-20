import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Menu, X, Home, Link as LinkIcon, Download,
  BarChart2, Users, Settings, LogOut, Zap,
  ChevronDown, ExternalLink, Globe, Layout,
  Moon, Sun, Shield, CreditCard, HelpCircle, User, Plus,
  DollarSign, Activity, Bell, Search, LayoutDashboard, FileCode
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import api from '../../utils/api';

// ===================================================
// CREATE LINK MODAL (MODERN LIGHT VERSION)
// ===================================================
const CreateLinkModal = ({ isOpen, onClose, onSuccess }) => {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleShorten = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/links/shorten', { originalUrl: url, alias: alias || undefined, title });
      setResult(`${window.location.origin}/st/${res.data.alias}`);
      if (onSuccess) onSuccess();
    } catch (err) {
      alert(err.response?.data?.msg || 'Failed to shorten link.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleReset = () => {
    setResult(null);
    setUrl('');
    setAlias('');
    setTitle('');
    setCopied(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()} 
         style={{ zIndex: 2000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)', position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="modal" style={{ 
        borderRadius: '24px', 
        padding: '2.5rem', 
        background: 'var(--bg-card)', 
        border: '1px solid var(--border)',
        boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        maxWidth: '550px',
        width: '95%',
        position: 'relative'
      }}>
        <button onClick={onClose} style={{ position: 'absolute', color: 'var(--text-light)', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', cursor: 'pointer' }}><X size={24} /></button>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--text)' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.625rem', borderRadius: '12px' }}>
            <Zap size={24} fill="white" />
          </div>
          Create New Link
        </div>

        {!result ? (
          <form onSubmit={handleShorten}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Destination URL</label>
              <input type="url" placeholder="https://example.com/long-url"
                value={url} onChange={e => setUrl(e.target.value)} required autoFocus 
                style={{ 
                  width: '100%',
                  padding: '1rem 1.25rem', 
                  borderRadius: '12px', 
                  background: 'var(--bg-alt)', 
                  border: '1px solid var(--border)', 
                  color: 'var(--text)',
                  fontSize: '1rem',
                  outline: 'none'
                }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Alias (Optional)</label>
                    <input type="text" placeholder="custom-alias"
                        value={alias} onChange={e => setAlias(e.target.value)} 
                        style={{ 
                            width: '100%',
                            padding: '1rem 1.25rem', 
                            background: 'var(--bg-alt)', 
                            border: '1px solid var(--border)', 
                            borderRadius: '12px',
                            color: 'var(--text)',
                            outline: 'none'
                        }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>Title (Optional)</label>
                    <input type="text" placeholder="My Link Label"
                        value={title} onChange={e => setTitle(e.target.value)} 
                        style={{ 
                            width: '100%',
                            padding: '1rem 1.25rem', 
                            borderRadius: '12px', 
                            background: 'var(--bg-alt)', 
                            border: '1px solid var(--border)', 
                            color: 'var(--text)',
                            outline: 'none'
                        }} />
                </div>
            </div>
            <button type="submit" disabled={loading} style={{ 
                width: '100%',
                padding: '1.125rem', 
                borderRadius: '12px', 
                background: 'var(--primary)',
                color: 'white',
                border: 'none',
                fontSize: '1.125rem', 
                fontWeight: '800', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                gap: '0.75rem',
                cursor: 'pointer'
            }}>
              {loading ? 'Processing...' : 'Shorten URL'}
            </button>
          </form>
        ) : (
          <div>
            <div style={{ 
                background: 'var(--primary-light)', 
                border: '2px dashed var(--primary)', 
                borderRadius: '16px', 
                padding: '1.5rem', 
                marginBottom: '1.5rem', 
                wordBreak: 'break-all', 
                color: 'var(--primary)', 
                fontWeight: '700', 
                fontSize: '1.25rem', 
                textAlign: 'center'
            }}>
              {result}
            </div>
            <button onClick={handleCopy} style={{ 
                width: '100%',
                padding: '1.125rem', 
                borderRadius: '12px', 
                background: copied ? '#10b981' : 'var(--primary)', 
                color: 'white',
                border: 'none',
                fontSize: '1.125rem', 
                fontWeight: '800',
                cursor: 'pointer'
            }}>
              {copied ? 'Copied to clipboard!' : 'Copy Link'}
            </button>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginTop: '1rem' }}>
              <button onClick={handleReset} style={{ padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg-alt)', color: 'var(--text)', fontWeight: '700', cursor: 'pointer' }}>
                 Shorten Another
              </button>
              <button onClick={onClose} style={{ padding: '0.875rem', borderRadius: '12px', border: 'none', background: 'var(--bg)', color: 'var(--text)', fontWeight: '700', cursor: 'pointer' }}>
                 Close Modal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// ===================================================
// SIDEBAR ITEM
// ===================================================
const NavItem = ({ icon: Icon, label, path, active, isSub, hasChildren, isOpen, onClick, count }) => (
  <Link
    to={path || '#'}
    className={`nav-item${isSub ? ' sub' : ''}${active ? ' active' : ''}`}
    onClick={onClick}
    style={{
      borderRadius: '12px',
      margin: '0.25rem 1rem',
      padding: '0.75rem 1rem',
      background: active ? 'var(--primary-light)' : 'transparent',
      color: active ? 'var(--primary)' : 'var(--text-muted)',
      fontWeight: active ? '800' : '600',
      textDecoration: 'none',
      display: 'flex',
      alignItems: 'center',
      transition: '0.2s'
    }}
  >
    {Icon && <Icon size={isSub ? 16 : 20} style={{ marginRight: '0.875rem' }} />}
    <span style={{ fontSize: isSub ? '0.875rem' : '0.9375rem' }}>{label}</span>
    {count !== undefined && (
      <span style={{ marginLeft: 'auto', background: 'var(--primary)', color: 'white', fontSize: '0.75rem', fontWeight: '800', borderRadius: '20px', padding: '0.125rem 0.5rem' }}>{count}</span>
    )}
    {hasChildren && <ChevronDown size={14} style={{ marginLeft: 'auto', transform: isOpen ? 'rotate(180deg)' : 'rotate(0)', transition: '0.3s' }} />}
  </Link>
);

// ===================================================
// MAIN DASHBOARD LAYOUT
// ===================================================
const DashboardLayout = ({ children, title, isAdmin = false }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();
  const [openMenus, setOpenMenus] = useState({ links: true, tools: true });
  const [showModal, setShowModal] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user') || '{}'));
  const [stats, setStats] = useState({ balance: '0.0000' });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats/dashboard');
        setStats(res.data);
        const stored = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(stored);
      } catch {}
    };
    fetchStats();
  }, [location.pathname]);

  const toggleMenu = (key) => setOpenMenus(prev => ({ ...prev, [key]: !prev[key] }));

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const isAt = (path) => location.pathname === path;
  const startsWith = (path) => location.pathname.startsWith(path);

  return (
    <div style={{ background: 'var(--bg-alt)', minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif", color: 'var(--text)' }}>
      <CreateLinkModal isOpen={showModal} onClose={() => setShowModal(false)} onSuccess={() => {}} />

      {/* ===== SIDEBAR ===== */}
      <aside style={{ 
        width: '260px', 
        background: 'var(--bg-sidebar)', 
        borderRight: '1px solid var(--border)',
        position: 'fixed',
        top: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        transition: '0.3s',
        left: mobileOpen ? '0' : '0'
      }} className={`sidebar-container ${mobileOpen ? 'open' : ''}`}>
        {/* Logo */}
        <div style={{ padding: '1.5rem 1.5rem 2.5rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <div style={{ background: 'var(--primary)', padding: '0.4rem', borderRadius: '8px' }}>
                    <Zap size={20} color="white" fill="white" />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.02em' }}>Wallgo<span style={{ color: 'var(--primary)' }}>Links</span></span>
            </Link>
        </div>

        {/* Balance Card */}
        <div style={{ padding: '0 1.25rem 2rem' }}>
            <div style={{
                background: 'var(--primary)',
                borderRadius: '16px',
                padding: '1.25rem',
                color: 'white',
                boxShadow: '0 10px 20px rgba(113, 88, 226, 0.2)'
            }}>
                <div style={{ fontSize: '0.75rem', fontWeight: '700', opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Available Balance</div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>${stats.balance}</div>
                <Link to="/dashboard/withdraw" style={{
                    display: 'block',
                    textAlign: 'center',
                    background: 'rgba(255,255,255,0.2)',
                    color: 'white',
                    padding: '0.5rem',
                    borderRadius: '8px',
                    fontSize: '0.8125rem',
                    fontWeight: '700',
                    textDecoration: 'none'
                }}>Withdraw Money</Link>
            </div>
        </div>

        {/* Navigation */}
        <nav style={{ flex: 1, overflowY: 'auto' }}>
            <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" active={isAt('/dashboard')} />
            <NavItem icon={LinkIcon} label="Manage Links" path="/dashboard/links" active={startsWith('/dashboard/links')} />
            <NavItem icon={CreditCard} label="Withdraw" path="/dashboard/withdraw" active={isAt('/dashboard/withdraw')} />
            
            <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Analytics</div>
            <NavItem icon={BarChart2} label="Traffic Stats" path="#" active={isAt('/dashboard/traffic')} />
            <NavItem icon={Users} label="Referrals" path="/dashboard/refer" active={isAt('/dashboard/refer')} />

            <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tools</div>
            <NavItem icon={Zap} label="Publisher Tools" path="#" hasChildren isOpen={openMenus.tools}
                onClick={(e) => { e.preventDefault(); toggleMenu('tools'); }} />
            {openMenus.tools && (
                <div style={{ margin: '0 0.5rem 0 1.25rem' }}>
                    <NavItem isSub label="Quick Link" path="/dashboard/tools/quick" active={isAt('/dashboard/tools/quick')} />
                    <NavItem isSub label="Full Page Script" path="/dashboard/tools/script" active={isAt('/dashboard/tools/script')} />
                    <NavItem isSub label="Developer API" path="/dashboard/tools/api" active={isAt('/dashboard/tools/api')} />
                </div>
            )}

            <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account</div>
            <NavItem icon={User} label="Profile" path="/dashboard/settings/profile" active={startsWith('/dashboard/settings')} />
            <NavItem icon={HelpCircle} label="FAQs" path="/pages/faq" active={false} />
            
            {user.role === 'Admin' && (
                <>
                    <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#7158E2', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Admin Hub</div>
                    <NavItem icon={Shield} label="Admin Dashboard" path="/admin" active={false} />
                </>
            )}
        </nav>

        {/* Logout */}
        <div style={{ padding: '1.5rem' }}>
            <button onClick={handleLogout} style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                color: '#ef4444',
                fontWeight: '700',
                fontSize: '0.875rem',
                background: isDarkMode ? 'rgba(239, 68, 68, 0.1)' : '#fff5f5',
                cursor: 'pointer'
            }}>
                <LogOut size={18} /> Logout Session
            </button>
        </div>
      </aside>

      {/* ===== HEADER & MAIN CONTENT ===== */}
      <div style={{ marginLeft: mobileOpen ? '0' : '260px', flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column', transition: '0.3s' }} className="main-content-layout">
        
        <header style={{ 
          height: '70px', 
          background: 'var(--bg-white)', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 900,
          borderBottom: '1px solid var(--border)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display: 'none', background: 'transparent', border: 'none', color: 'var(--text)' }} className="mobile-toggle">
              <Menu size={24} />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)' }}>{title}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', color: 'var(--text)' }}>
            {/* Theme Toggle */}
            <button onClick={toggleTheme} style={{ 
                background: 'var(--bg-alt)', 
                border: '1px solid var(--border)', 
                color: 'var(--text)', 
                width: '40px', 
                height: '40px', 
                borderRadius: '10px', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: '0.2s'
            }}>
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button onClick={() => setShowModal(true)} style={{ 
              background: 'var(--primary)', 
              color: 'white', 
              border: 'none', 
              padding: '0.625rem 1.25rem', 
              borderRadius: '10px', 
              fontWeight: '700', 
              fontSize: '0.875rem', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}>
               <Plus size={18} /> New Link
            </button>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1.5rem', borderLeft: '1px solid var(--border)' }}>
                <div style={{ textAlign: 'right' }} className="user-info-text">
                    <div style={{ fontSize: '0.875rem', fontWeight: '800' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '700' }}>{user.role}</div>
                </div>
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=7158E2&color=fff`}
                  alt="avatar"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid var(--primary-light)' }}
                />
            </div>
          </div>
        </header>

        <main style={{ padding: '2rem', flex: 1 }}>
          {children}
        </main>
      </div>

      <style>{`
        @media (max-width: 991px) {
            .sidebar-container { left: ${mobileOpen ? '0' : '-260px'} !important; }
            .sidebar-container.open { left: 0 !important; }
            .main-content-layout { margin-left: 0 !important; }
            .mobile-toggle { display: block !important; margin-right: 1rem; }
            .user-info-text { display: none; }
        }
        .nav-item:hover { background: var(--bg-alt) !important; color: var(--primary) !important; }
        .nav-item.active:hover { background: var(--primary-light) !important; }
        .modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.5); display: flex; align-items: center; justify-content: center; z-index: 2000; }
        .modal { animation: slideUp 0.3s ease; }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
