import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart2, Users, Settings, LogOut, Zap, 
  ChevronDown, Globe, Layout, Shield, FileCode,
  Menu, X, Bell, Moon, Sun, Search, User
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const AdminLayout = ({ children, title }) => {
  const { isDarkMode, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isAt = (path) => location.pathname === path;

  const menuItems = [
    { icon: Shield, label: 'Overview', path: '/admin' },
    { icon: Users, label: 'Users', path: '/admin/users' },
    { icon: Globe, label: 'CPM Control', path: '/admin/cpm' },
    { icon: Settings, label: 'Ads Setup', path: '/admin/settings' },
    { icon: FileCode, label: 'Static Pages', path: '/admin/pages' },
    { icon: BarChart2, label: 'Global Links', path: '/admin/links' },
  ];

  return (
    <div style={{ background: 'var(--bg-alt)', minHeight: '100vh', display: 'flex', color: 'var(--text)' }}>
      {/* Admin Sidebar */}
      <aside style={{ 
        width: '280px', 
        background: isDarkMode ? '#0f0f12' : '#1a1a2e', 
        color: '#fff',
        position: 'fixed',
        top: 0, bottom: 0, left: mobileOpen ? '0' : '-280px',
        zIndex: 1000,
        transition: '0.3s'
      }} className="admin-sidebar" id="admin-sidebar">
        <div style={{ padding: '2rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <Link to="/admin" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
                <div style={{ background: '#7c3aed', padding: '0.5rem', borderRadius: '10px' }}>
                    <Shield size={22} color="white" />
                </div>
                <span style={{ fontSize: '1.25rem', fontWeight: '800', color: 'white' }}>Admin<span style={{ color: '#a78bfa' }}>Hub</span></span>
            </Link>
        </div>

        <nav style={{ padding: '1.5rem 0' }}>
            {menuItems.map((item, idx) => (
                <Link key={idx} to={item.path} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.875rem 1.5rem',
                    color: isAt(item.path) ? '#a78bfa' : '#94a3b8',
                    background: isAt(item.path) ? 'rgba(167,139,250,0.1)' : 'transparent',
                    borderLeft: `4px solid ${isAt(item.path) ? '#a78bfa' : 'transparent'}`,
                    textDecoration: 'none',
                    fontWeight: isAt(item.path) ? '700' : '500',
                    transition: '0.2s'
                }}>
                    <item.icon size={20} />
                    <span>{item.label}</span>
                </Link>
            ))}
        </nav>

        <div style={{ marginTop: 'auto', padding: '1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <Link to="/dashboard" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                color: '#94a3b8',
                textDecoration: 'none',
                fontSize: '0.875rem'
            }}>
                <Layout size={18} /> Exit Admin
            </Link>
        </div>
      </aside>

      {/* Main Content */}
      <div style={{ marginLeft: '280px', flex: 1, minHeight: '100vh', display: 'flex', flexDirection: 'column' }} className="admin-main">
          <header style={{ 
              height: '70px', 
              background: 'var(--bg-white)', 
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '0 2rem',
              position: 'sticky',
              top: 0, zIndex: 900
          }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <button onClick={() => setMobileOpen(!mobileOpen)} style={{ display: 'none', background: 'transparent', border: 'none', color: 'var(--text)' }} className="mobile-toggle">
                      <Menu size={24} />
                  </button>
                  <h2 style={{ fontSize: '1.25rem', fontWeight: '800' }}>{title}</h2>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                  <button onClick={toggleTheme} style={{ 
                      background: 'var(--bg)', 
                      border: '1px solid var(--border)', 
                      color: 'var(--text)', 
                      width: '40px', height: '40px', 
                      borderRadius: '10px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      cursor: 'pointer'
                  }}>
                      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                  </button>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.875rem', fontWeight: '800' }}>Admin</div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>Super Admin</div>
                      </div>
                      <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '800' }}>A</div>
                  </div>
              </div>
          </header>

          <main style={{ padding: '2rem', flex: 1 }}>
              {children}
          </main>
      </div>

      <style>{`
        @media (max-width: 991px) {
            .admin-sidebar { left: ${mobileOpen ? '0' : '-280px'} !important; }
            .admin-main { margin-left: 0 !important; }
            .mobile-toggle { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
