import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/common/DashboardLayout';
import { Users, Settings, CreditCard, Globe, FileText, BarChart2, CheckCircle, XCircle, Clock, Shield, Search, Edit2, Trash2, X, Plus, RefreshCw, Activity, DollarSign } from 'lucide-react';
import api from '../../utils/api';

// ===================================================
// REUSABLE COMPONENTS
// ===================================================
const StatusBadge = ({ status }) => {
  const map = { 
    Active: { bg: '#ecfdf5', text: '#10b981' }, 
    Blocked: { bg: '#fef2f2', text: '#ef4444' }, 
    Pending: { bg: '#fffbeb', text: '#f59e0b' }, 
    Complete: { bg: '#ecfdf5', text: '#10b981' }, 
    Cancelled: { bg: '#fef2f2', text: '#ef4444' } 
  };
  const style = map[status] || { bg: '#f9f9f9', text: '#aaa' };
  return (
    <span style={{ 
        padding: '0.25rem 0.5rem', 
        borderRadius: '6px', 
        fontSize: '0.75rem', 
        fontWeight: '800', 
        background: style.bg, 
        color: style.text 
    }}>{status}</span>
  );
};

const TabBtn = ({ label, icon: Icon, active, onClick }) => (
  <button onClick={onClick}
    style={{
      display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '1rem 1.5rem',
      border: 'none', cursor: 'pointer', background: 'transparent',
      borderBottom: `2px solid ${active ? 'var(--primary)' : 'transparent'}`,
      color: active ? 'var(--primary)' : '#666', 
      fontWeight: active ? '800' : '600',
      fontSize: '0.875rem', 
      transition: '0.3s'
    }}>
    <Icon size={18} /> {label}
  </button>
);

// ===================================================
// OVERVIEW TAB
// ===================================================
const OverviewTab = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const cards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, color: '#7158E2', icon: Users },
    { label: 'Total Links', value: stats.totalLinks, color: '#3b82f6', icon: Globe },
    { label: 'Total Clicks', value: stats.totalClicks?.toLocaleString(), color: '#10b981', icon: BarChart2 },
    { label: 'Platform Profit', value: `$${stats.totalEarnings}`, color: '#f59e0b', icon: DollarSign },
    { label: 'Total Paid Out', value: `$${stats.totalPayouts}`, color: '#10b981', icon: CheckCircle },
    { label: 'Pending Requests', value: stats.pendingPayouts, color: '#ef4444', icon: Clock },
  ] : [];

  return (
    <div style={{ marginTop: '2rem' }}>
      {loading ? <div style={{ textAlign: 'center', padding: '5rem' }}><Activity size={40} className="spin" /></div> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
          {cards.map((c, i) => (
            <div key={i} style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
              <div style={{ background: c.color + '15', width: '50px', height: '50px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <c.icon size={24} color={c.color} />
              </div>
              <div>
                <div style={{ fontSize: '1.5rem', fontWeight: '800', color: '#1a1a1a' }}>{c.value}</div>
                <div style={{ fontSize: '0.75rem', color: '#aaa', fontWeight: '700', textTransform: 'uppercase' }}>{c.label}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ===================================================
// USERS TAB
// ===================================================
const UsersTab = () => {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const fetchUsers = async (pg = 1, q = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pg, limit: 15 });
      if (q) params.append('search', q);
      const res = await api.get(`/admin/users?${params}`);
      setUsers(res.data.users || res.data);
      setTotal(res.data.total || (res.data.users || res.data).length);
      setPages(res.data.pages || 1);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchUsers(); }, []);

  const handleBlock = async (id) => {
    if (!window.confirm('Block this user?')) return;
    await api.post(`/admin/users/${id}/block`);
    fetchUsers(page, search);
  };

  const handleUnblock = async (id) => {
    await api.post(`/admin/users/${id}/unblock`);
    fetchUsers(page, search);
  };

  const handleRoleToggle = async (id, currentRole) => {
    const newRole = currentRole === 'Admin' ? 'User' : 'Admin';
    if (!window.confirm(`Change role to ${newRole}?`)) return;
    await api.put(`/admin/users/${id}/role`, { role: newRole });
    fetchUsers(page, search);
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
          <input 
            style={{ padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid #eee', width: '100%', outline: 'none', background: '#f9f9f9' }}
            placeholder="Search users..." 
            value={search} 
            onChange={e => setSearch(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') { setPage(1); fetchUsers(1, search); } }} 
          />
        </div>
        <button onClick={() => { setPage(1); fetchUsers(1, search); }} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0 1.5rem', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Search</button>
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#aaa' }}>User</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#aaa' }}>Role</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#aaa' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#aaa' }}>Balance</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#aaa' }}>Links</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '800', color: '#aaa' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="6" style={{ textAlign: 'center', padding: '3rem' }}><Activity size={30} className="spin" /></td></tr>
            ) : users.map(u => (
              <tr key={u._id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(u.name)}&background=7158E2&color=fff&size=32`} style={{ borderRadius: '50%' }} />
                    <div>
                        <div style={{ fontWeight: '700' }}>{u.name}</div>
                        <div style={{ fontSize: '0.75rem', color: '#aaa' }}>{u.email}</div>
                    </div>
                  </div>
                </td>
                <td style={{ padding: '1rem' }}>
                    <button onClick={() => handleRoleToggle(u._id, u.role)} style={{ 
                        background: u.role === 'Admin' ? '#f0effc' : '#f9f9f9',
                        color: u.role === 'Admin' ? 'var(--primary)' : '#666',
                        border: 'none', padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.7rem', fontWeight: '800', cursor: 'pointer'
                    }}>{u.role}</button>
                </td>
                <td style={{ padding: '1rem' }}><StatusBadge status={u.status} /></td>
                <td style={{ padding: '1rem', fontWeight: '800', color: '#10b981' }}>${(u.balance || 0).toFixed(4)}</td>
                <td style={{ padding: '1rem', fontWeight: '700' }}>{u.linkCount || 0}</td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {u.status === 'Active'
                      ? <button onClick={() => handleBlock(u._id)} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Block</button>
                      : <button onClick={() => handleUnblock(u._id)} style={{ background: '#ecfdf5', color: '#10b981', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Unblock</button>
                    }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ===================================================
// PAYOUTS TAB
// ===================================================
const PayoutsTab = () => {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('Pending');

  const fetchPayouts = async (status = filter) => {
    setLoading(true);
    try {
      const res = await api.get(`/admin/payouts?status=${status}`);
      setPayouts(res.data.payouts || res.data);
    } finally { setLoading(false); }
  };

  useEffect(() => { fetchPayouts(); }, []);

  const handleApprove = async (id) => {
    if (!window.confirm('Approve this payout request?')) return;
    await api.post(`/admin/payouts/approve/${id}`);
    fetchPayouts();
  };

  const handleReject = async (id) => {
    const remarks = window.prompt('Rejection reason (optional):') || 'Rejected by admin';
    await api.post(`/admin/payouts/reject/${id}`, { remarks });
    fetchPayouts();
  };

  return (
    <div style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {['All', 'Pending', 'Complete', 'Cancelled'].map(s => (
          <button key={s} onClick={() => { setFilter(s === 'All' ? '' : s); fetchPayouts(s === 'All' ? '' : s); }} style={{ 
            background: filter === s || (s === 'All' && !filter) ? 'var(--primary)' : 'white',
            color: filter === s || (s === 'All' && !filter) ? 'white' : '#666',
            border: '1px solid #eee', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '700', cursor: 'pointer'
          }}>{s}</button>
        ))}
      </div>

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#aaa' }}>User</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#aaa' }}>Amount</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#aaa' }}>Method</th>
              <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#aaa' }}>Status</th>
              <th style={{ padding: '1rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '800', color: '#aaa' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="5" style={{ textAlign: 'center', padding: '3rem' }}><Activity size={30} className="spin" /></td></tr>
            ) : payouts.map(p => (
              <tr key={p._id} style={{ borderBottom: '1px solid #f9f9f9' }}>
                <td style={{ padding: '1rem' }}>
                    <div style={{ fontWeight: '700' }}>{p.userId?.name || 'Unknown'}</div>
                    <div style={{ fontSize: '0.75rem', color: '#aaa' }}>{p.userId?.email}</div>
                </td>
                <td style={{ padding: '1rem', fontWeight: '800', color: '#10b981' }}>${p.amount.toFixed(4)}</td>
                <td style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>{p.method}</div>
                    <div style={{ fontSize: '0.7rem', color: '#aaa' }}>{p.account}</div>
                </td>
                <td style={{ padding: '1rem' }}><StatusBadge status={p.status} /></td>
                <td style={{ padding: '1rem', textAlign: 'right' }}>
                    {p.status === 'Pending' && (
                        <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                            <button onClick={() => handleApprove(p._id)} style={{ background: '#ecfdf5', color: '#10b981', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Approve</button>
                            <button onClick={() => handleReject(p._id)} style={{ background: '#fef2f2', color: '#ef4444', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '700', cursor: 'pointer' }}>Reject</button>
                        </div>
                    )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ===================================================
// MAIN ADMIN DASHBOARD
// ===================================================
const AdminDashboard = () => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: BarChart2 },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'payouts', label: 'Payouts', icon: CreditCard },
  ];

  const [activeTab, setActiveTab] = useState('overview');

  return (
    <DashboardLayout title="Admin Panel">
      <div style={{ background: 'white', borderBottom: '1px solid #eee', margin: '-2rem -2rem 2rem -2rem', padding: '0 2rem' }}>
        <div style={{ display: 'flex' }}>
            {tabs.map(t => (
            <TabBtn key={t.id} label={t.label} icon={t.icon} active={activeTab === t.id} onClick={() => setActiveTab(t.id)} />
            ))}
        </div>
      </div>

      {activeTab === 'overview' && <OverviewTab />}
      {activeTab === 'users' && <UsersTab />}
      {activeTab === 'payouts' && <PayoutsTab />}
      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
};

export default AdminDashboard;
