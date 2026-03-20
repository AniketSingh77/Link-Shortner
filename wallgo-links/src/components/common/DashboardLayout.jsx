import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Globe, Users, Link as LinkIcon, ChevronDown,
  Settings, HelpCircle, Bell, Moon, Maximize, Minimize,
  Send, Plus, Home, CreditCard, Code, Menu, X, Copy,
  LogOut, BookOpen, Zap, FileCode, Eye, EyeOff, BarChart2,
  Sun, ExternalLink, Shield, User, DollarSign, Wallet, Check, Sparkles, Activity, Search
} from 'lucide-react';
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
         style={{ zIndex: 2000, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(4px)' }}>
      <div className="modal" style={{ 
        borderRadius: '24px', 
        padding: '2.5rem', 
        background: '#ffffff', 
        border: '1px solid #eee',
        boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        maxWidth: '550px',
        width: '95%'
      }}>
        <button className="modal-close" onClick={onClose} style={{ color: '#aaa', top: '1.5rem', right: '1.5rem' }}><X size={24} /></button>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'var(--primary)', color: 'white', padding: '0.625rem', borderRadius: '12px' }}>
            <Zap size={24} fill="white" />
          </div>
          Create New Link
        </div>

        {!result ? (
          <form onSubmit={handleShorten}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Destination URL</label>
              <input type="url" placeholder="https://example.com/long-url"
                value={url} onChange={e => setUrl(e.target.value)} required autoFocus 
                style={{ 
                  width: '100%',
                  padding: '1rem 1.25rem', 
                  borderRadius: '12px', 
                  background: '#f9f9f9', 
                  border: '1px solid #eee', 
                  color: '#1a1a1a',
                  fontSize: '1rem'
                }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '2rem' }}>
                <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Alias (Optional)</label>
                    <input type="text" placeholder="custom-alias"
                        value={alias} onChange={e => setAlias(e.target.value)} 
                        style={{ 
                            width: '100%',
                            padding: '1rem 1.25rem', 
                            background: '#f9f9f9', 
                            border: '1px solid #eee', 
                            borderRadius: '12px',
                            color: '#1a1a1a'
                        }} />
                </div>
                <div>
                    <label style={{ display: 'block', fontWeight: '700', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Title (Optional)</label>
                    <input type="text" placeholder="My Link Label"
                        value={title} onChange={e => setTitle(e.target.value)} 
                        style={{ 
                            width: '100%',
                            padding: '1rem 1.25rem', 
                            borderRadius: '12px', 
                            background: '#f9f9f9', 
                            border: '1px solid #eee', 
                            color: '#1a1a1a'
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
                background: '#f0effc', 
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
              <button onClick={handleReset} style={{ padding: '0.875rem', borderRadius: '12px', border: '1px solid #eee', background: 'white', fontWeight: '700', cursor: 'pointer' }}>
                 Shorten Another
              </button>
              <button onClick={onClose} style={{ padding: '0.875rem', borderRadius: '12px', border: 'none', background: '#f9f9f9', fontWeight: '700', cursor: 'pointer' }}>
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
      background: active ? '#F0EFFC' : 'transparent',
      color: active ? 'var(--primary)' : '#666',
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
    <div style={{ background: '#F8F9FF', minHeight: '100vh', display: 'flex', fontFamily: "'Inter', sans-serif" }}>
      <CreateLinkModal isOpen={showModal} onClose={() => setShowModal(false)} onSuccess={() => {}} />

      {/* ===== SIDEBAR ===== */}
      <aside style={{ 
        width: '260px', 
        background: '#ffffff', 
        borderRight: '1px solid #eee',
        position: 'fixed',
        top: 0,
        bottom: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 1000,
        transition: '0.3s',
        left: mobileOpen ? '0' : '-260px'
      }} className="sidebar-container">
        {/* Logo */}
        <div style={{ padding: '1.5rem 1.5rem 2.5rem' }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                <div style={{ background: 'var(--primary)', padding: '0.4rem', borderRadius: '8px' }}>
                    <Zap size={20} color="white" fill="white" />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1a1a1a', letterSpacing: '-0.02em' }}>Wallgo<span style={{ color: 'var(--primary)' }}>Links</span></span>
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
            {!isAdmin ? (
                <>
                    <NavItem icon={LayoutDashboard} label="Dashboard" path="/dashboard" active={isAt('/dashboard')} />
                    <NavItem icon={LinkIcon} label="Manage Links" path="/dashboard/links" active={startsWith('/dashboard/links')} />
                    <NavItem icon={CreditCard} label="Withdraw" path="/dashboard/withdraw" active={isAt('/dashboard/withdraw')} />
                    
                    <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Analytics</div>
                    <NavItem icon={BarChart2} label="Traffic Stats" path="/dashboard/traffic" active={isAt('/dashboard/traffic')} />
                    <NavItem icon={Users} label="Referrals" path="/dashboard/refer" active={isAt('/dashboard/refer')} />

                    <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tools</div>
                    <NavItem icon={Zap} label="Publisher Tools" path="#" hasChildren isOpen={openMenus.tools}
                        onClick={(e) => { e.preventDefault(); toggleMenu('tools'); }} />
                    {openMenus.tools && (
                        <div style={{ margin: '0 0.5rem 0 1.25rem' }}>
                            <NavItem isSub label="Quick Link" path="/dashboard/tools/quick" active={isAt('/dashboard/tools/quick')} />
                            <NavItem isSub label="Full Page Script" path="/dashboard/tools/script" active={isAt('/dashboard/tools/script')} />
                            <NavItem isSub label="Developer API" path="/dashboard/tools/api" active={isAt('/dashboard/tools/api')} />
                        </div>
                    )}

                    <div style={{ padding: '1.5rem 1.5rem 0.5rem', fontSize: '0.75rem', fontWeight: '800', color: '#aaa', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Account</div>
                    <NavItem icon={User} label="Profile" path="/dashboard/settings/profile" active={startsWith('/dashboard/settings')} />
                    <NavItem icon={HelpCircle} label="FAQs" path="/pages/faq" active={false} />
                </>
            ) : (
                <>
                    <NavItem icon={Shield} label="Admin Overview" path="/admin" active={isAt('/admin')} />
                    <NavItem icon={Users} label="Users" path="/admin/users" active={isAt('/admin/users')} />
                    <NavItem icon={Globe} label="CPM Rates" path="/admin/cpm" active={isAt('/admin/cpm')} />
                    <NavItem icon={CreditCard} label="Payouts" path="/admin/payouts" active={isAt('/admin/payouts')} />
                    <NavItem icon={FileCode} label="Pages" path="/admin/pages" active={isAt('/admin/pages')} />
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
                border: '1px solid #fee2e2',
                color: '#ef4444',
                fontWeight: '700',
                fontSize: '0.875rem',
                background: '#fff5f5',
                cursor: 'pointer'
            }}>
                <LogOut size={18} /> Logout Session
            </button>
        </div>
      </aside>

      {/* ===== HEADER & MAIN CONTENT ===== */}
      <div style={{ marginLeft: '260px', flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="main-content-layout">
        
        <header style={{ 
          height: '70px', 
          background: '#ffffff', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          padding: '0 2rem',
          position: 'sticky',
          top: 0,
          zIndex: 900,
          borderBottom: '1px solid #eee'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display: 'none', background: 'transparent', border: 'none', color: '#1a1a1a' }} className="mobile-toggle">
              <Menu size={24} />
            </button>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#1a1a1a' }}>{title}</h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
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

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '1.5rem', borderLeft: '1px solid #eee' }}>
                <div style={{ textAlign: 'right' }} className="user-info-text">
                    <div style={{ fontSize: '0.875rem', fontWeight: '800' }}>{user.name}</div>
                    <div style={{ fontSize: '0.75rem', color: '#aaa', fontWeight: '700' }}>{user.role}</div>
                </div>
                <img
                  src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name || 'U')}&background=7158E2&color=fff`}
                  alt="avatar"
                  style={{ width: '40px', height: '40px', borderRadius: '50%', border: '2px solid #f0effc' }}
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
            .main-content-layout { margin-left: 0 !important; }
            .mobile-toggle { display: block !important; }
            .user-info-text { display: none; }
        }
        .nav-item:hover { background: #f9f9f9 !important; }
        .nav-item.active:hover { background: #F0EFFC !important; }
      `}</style>
    </div>
  );
};

export default DashboardLayout;
