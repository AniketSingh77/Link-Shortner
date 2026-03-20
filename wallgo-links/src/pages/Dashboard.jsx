import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import DashboardLayout from '../components/common/DashboardLayout';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Eye, DollarSign, Link as LinkIcon, TrendingUp, Plus, Copy, Zap, ArrowUpRight, MousePointer2, Activity, Globe, Wallet, Shield, Sparkles, Users } from 'lucide-react';
import api from '../utils/api';

const StatCard = ({ icon: Icon, label, value, color, trend }) => (
  <div style={{ 
    padding: '1.5rem', 
    background: '#ffffff',
    border: '1px solid #eee', 
    borderRadius: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '1.25rem'
  }}>
    <div style={{ 
        background: color + '15', 
        color: color, 
        padding: '0.75rem', 
        borderRadius: '12px' 
    }}>
      <Icon size={24} />
    </div>
    <div>
        <div style={{ fontSize: '0.875rem', fontWeight: '700', color: '#666', marginBottom: '0.25rem' }}>{label}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1a1a1a' }}>{value}</span>
            {trend && (
                <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#10b981', display: 'flex', alignItems: 'center', gap: '0.125rem' }}>
                    <ArrowUpRight size={14} /> {trend}%
                </span>
            )}
        </div>
    </div>
  </div>
);

const Dashboard = () => {
  const [url, setUrl] = useState('');
  const [shortened, setShortened] = useState('');
  const [shortening, setShortening] = useState(false);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalEarnings: '0.0000',
    referralEarnings: '0.0000',
    balance: '0.0000',
    averageCPM: '0.00',
    totalLinks: 0,
    chartData: []
  });
  const [recentLinks, setRecentLinks] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [statsRes, linksRes] = await Promise.all([
        api.get('/stats/dashboard'),
        api.get('/links/user?limit=5')
      ]);
      setStats(statsRes.data);
      setRecentLinks(linksRes.data.links || linksRes.data);
    } catch (err) {
      console.error('Dashboard error', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleShorten = async (e) => {
    e.preventDefault();
    if (!url) return;
    setShortening(true);
    try {
      const res = await api.post('/links/shorten', { originalUrl: url });
      setShortened(`${window.location.origin}/st/${res.data.alias}`);
      fetchData();
    } catch (err) { alert('Failed to shorten link.'); }
    finally { setShortening(false); }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortened);
    alert('Link copied!');
  };

  return (
    <DashboardLayout title="Overview">
      {/* Quick Shortener Box */}
      <div style={{ 
        background: 'white', 
        padding: '2.5rem', 
        borderRadius: '24px', 
        border: '1px solid #eee', 
        marginBottom: '2.5rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.02)'
      }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1.5rem' }}>Create New Link</h3>
        <form onSubmit={handleShorten} style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <LinkIcon size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
            <input 
              style={{ 
                width: '100%', padding: '1.125rem 1rem 1.125rem 3rem', borderRadius: '14px', border: '1px solid #eee', background: '#f9f9f9', fontSize: '1rem', outline: 'none'
              }}
              placeholder="Paste your long URL here..."
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
          </div>
          <button style={{ 
            background: 'var(--primary)', color: 'white', border: 'none', padding: '0 2.5rem', borderRadius: '14px', fontWeight: '800', cursor: 'pointer', transition: '0.3s', display: 'flex', alignItems: 'center', gap: '0.75rem'
          }} disabled={shortening}>
            {shortening ? 'Shortening...' : 'SHORTEN'} <Zap size={18} fill="white" />
          </button>
        </form>

        {shortened && (
          <div style={{ marginTop: '1.5rem', padding: '1rem 1.5rem', background: '#F0EFFC', borderRadius: '12px', border: '1px solid #7158E230', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <code style={{ fontSize: '1rem', color: 'var(--primary)', fontWeight: '800' }}>{shortened}</code>
            <button onClick={copyToClipboard} style={{ background: 'white', border: '1px solid #eee', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: '800', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Copy size={16} /> COPY
            </button>
          </div>
        )}
      </div>

      {/* Stats Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatCard icon={Eye} label="Total Views" value={loading ? '...' : stats.totalViews.toLocaleString()} color="#7158E2" trend="12" />
        <StatCard icon={DollarSign} label="Total Earnings" value={loading ? '...' : `$${stats.totalEarnings}`} color="#10b981" trend="8" />
        <StatCard icon={TrendingUp} label="Average CPM" value={loading ? '...' : `$${stats.averageCPM}`} color="#3b82f6" />
        <StatCard icon={Users} label="Referral Earnings" value={loading ? '...' : `$${stats.referralEarnings}`} color="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Main Chart */}
        <div style={{ 
            background: 'white', 
            padding: '2rem', 
            borderRadius: '20px', 
            border: '1px solid #eee' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Traffic Statistics</h3>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['Daily', 'Weekly', 'Monthly'].map(t => (
                    <button key={t} style={{ 
                        padding: '0.5rem 1rem', 
                        borderRadius: '8px', 
                        border: '1px solid #eee', 
                        background: t === 'Daily' ? '#F0EFFC' : 'white',
                        color: t === 'Daily' ? 'var(--primary)' : '#666',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        cursor: 'pointer'
                    }}>{t}</button>
                ))}
            </div>
          </div>
          <div style={{ height: '350px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.chartData} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: '700', fill: '#aaa' }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: '700', fill: '#aaa' }} />
                <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 20px rgba(0,0,0,0.05)' }}
                    itemStyle={{ fontWeight: '800', color: 'var(--primary)' }}
                />
                <Area type="monotone" dataKey="views" stroke="var(--primary)" strokeWidth={3} fillOpacity={1} fill="url(#colorViews)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Announcements / Quick Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ 
                background: 'linear-gradient(135deg, #7158E2 0%, #5a45c7 100%)', 
                padding: '2rem', 
                borderRadius: '20px', 
                color: 'white'
            }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem' }}>Announcements</h3>
                <p style={{ fontSize: '0.875rem', opacity: 0.9, lineHeight: '1.6', marginBottom: '1.5rem' }}>
                    We have updated our CPM rates for US and UK. Check out the payout rates page for more info.
                </p>
                <Link to="/payout-rates" style={{ 
                    color: 'white', 
                    fontWeight: '800', 
                    fontSize: '0.875rem', 
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                }}>
                    Check Payout Rates <ArrowUpRight size={16} />
                </Link>
            </div>

            <div style={{ 
                background: 'white', 
                padding: '2rem', 
                borderRadius: '20px', 
                border: '1px solid #eee' 
            }}>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '1.5rem' }}>Account Health</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                    {[
                        { label: 'Network Status', val: 'Online', color: '#10b981' },
                        { label: 'Security Level', val: 'High', color: '#10b981' },
                        { label: 'Identity Verified', val: 'Yes', color: '#10b981' }
                    ].map((item, i) => (
                        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#666', fontWeight: '600', fontSize: '0.875rem' }}>{item.label}</span>
                            <span style={{ color: item.color, fontWeight: '800', fontSize: '0.875rem' }}>{item.val}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
      </div>

      {/* Recent Links */}
      <div style={{ 
          marginTop: '1.5rem',
          background: 'white', 
          padding: '2rem', 
          borderRadius: '20px', 
          border: '1px solid #eee' 
      }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>Recently Created Links</h3>
              <Link to="/dashboard/links" style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.875rem', textDecoration: 'none' }}>View All Links</Link>
          </div>
          <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                      <tr style={{ borderBottom: '1px solid #f0f0f0' }}>
                          <th style={{ textAlign: 'left', padding: '1rem 0', color: '#aaa', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Alias</th>
                          <th style={{ textAlign: 'left', padding: '1rem 0', color: '#aaa', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Original URL</th>
                          <th style={{ textAlign: 'center', padding: '1rem 0', color: '#aaa', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Views</th>
                          <th style={{ textAlign: 'right', padding: '1rem 0', color: '#aaa', fontSize: '0.75rem', fontWeight: '800', textTransform: 'uppercase' }}>Earning</th>
                      </tr>
                  </thead>
                  <tbody>
                      {(recentLinks || []).length === 0 ? (
                          <tr><td colSpan="4" style={{ textAlign: 'center', padding: '3rem', color: '#aaa' }}>No links found. Create your first link now!</td></tr>
                      ) : (recentLinks || []).map(link => (
                          <tr key={link._id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                              <td style={{ padding: '1.25rem 0', fontWeight: '700' }}>{link.alias}</td>
                              <td style={{ padding: '1.25rem 0', color: '#666', fontSize: '0.875rem' }}>{link.originalUrl.substring(0, 50)}...</td>
                              <td style={{ padding: '1.25rem 0', textAlign: 'center', fontWeight: '700' }}>{link.views}</td>
                              <td style={{ padding: '1.25rem 0', textAlign: 'right', fontWeight: '800', color: '#10b981' }}>${(link.views * 0.005).toFixed(4)}</td>
                          </tr>
                      ))}
                  </tbody>
              </table>
          </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
