import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import { DollarSign, Clock, CheckCircle, XCircle, CreditCard, AlertCircle, Wallet, ArrowRight, History, ShieldAlert, Zap, BarChart3, TrendingUp, Sparkles, Shield, ArrowUpRight } from 'lucide-react';
import api from '../utils/api';

const StatCard = ({ icon: Icon, label, value, color, subText }) => (
  <div style={{ 
    padding: '1.5rem', 
    background: 'var(--bg-card)',
    border: '1px solid var(--border)', 
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
        <div style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>{label}</div>
        <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)' }}>{value}</div>
        {subText && <div style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-light)' }}>{subText}</div>}
    </div>
  </div>
);

const Withdraw = () => {
  const [stats, setStats] = useState({ balance: '0.0000' });
  const [history, setHistory] = useState({ payouts: [], totalPaid: 0, pending: 0 });
  const [loading, setLoading] = useState(true);
  const [requesting, setRequesting] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      const [statsRes, histRes] = await Promise.all([
        api.get('/stats/dashboard'),
        api.get('/payouts/history')
      ]);
      setStats(statsRes.data);
      setHistory(histRes.data);
    } catch (err) { console.error('Fetch error', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(); }, []);

  const handleRequest = async () => {
    if (parseFloat(stats.balance) < 5) {
      setMsg({ type: 'error', text: 'Minimum withdrawal amount is $5.00.' });
      return;
    }
    setRequesting(true);
    setMsg({ type: '', text: '' });
    try {
      await api.post('/payouts/request', {});
      setMsg({ type: 'success', text: 'Withdrawal request sent successfully!' });
      fetchData();
    } catch (err) {
      setMsg({ type: 'error', text: err.response?.data?.msg || 'Request failed.' });
    } finally { setRequesting(false); }
  };

  const statusBadge = (status) => {
    const styles = {
      Pending: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b', border: 'rgba(245, 158, 11, 0.2)' },
      Complete: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981', border: 'rgba(16, 185, 129, 0.2)' },
      Cancelled: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444', border: 'rgba(239, 68, 68, 0.2)' }
    };
    const s = styles[status] || { bg: 'var(--bg-white)', text: 'var(--text-light)', border: 'var(--border)' };
    
    return (
      <span style={{ 
        padding: '0.375rem 0.75rem', 
        borderRadius: '20px', 
        fontSize: '0.75rem', 
        fontWeight: '800',
        background: s.bg,
        color: s.text,
        border: `1px solid ${s.border}`,
      }}>
        {status}
      </span>
    );
  };

  return (
    <DashboardLayout title="Withdrawals">
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatCard icon={Wallet} label="Available Balance" value={loading ? '...' : `$${stats.balance}`} color="#7158E2" />
        <StatCard icon={CheckCircle} label="Total Paid" value={loading ? '...' : `$${(history.totalPaid || 0).toFixed(4)}`} color="#10b981" />
        <StatCard icon={Clock} label="Pending Payouts" value={loading ? '...' : `$${(history.pending || 0).toFixed(4)}`} color="#f59e0b" />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
        <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text)' }}>Request Withdrawal</h3>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2.5rem' }}>Transfer your earnings to your bank account or wallet.</p>

          {msg.text && (
            <div style={{ 
              padding: '1.25rem', 
              borderRadius: '12px', 
              marginBottom: '2rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.75rem',
              fontWeight: '700',
              background: msg.type === 'error' ? 'rgba(239, 68, 68, 0.1)' : 'rgba(16, 185, 129, 0.1)',
              color: msg.type === 'error' ? '#ef4444' : '#10b981',
              border: `1px solid ${msg.type === 'error' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)'}`,
            }}>
              {msg.type === 'error' ? <AlertCircle size={20} /> : <CheckCircle size={20} />} {msg.text}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2.5rem' }}>
            <div style={{ background: 'var(--primary-light)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--primary)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--primary)', marginBottom: '0.5rem' }}>CURRENT BALANCE</div>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--primary)' }}>${stats.balance}</div>
            </div>
            <div style={{ background: 'var(--bg-alt)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: '700', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>MINIMUM WITHDRAWAL</div>
              <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text)' }}>$5.00</div>
            </div>
          </div>

          <button
            onClick={handleRequest}
            disabled={requesting || parseFloat(stats.balance) < 5}
            style={{ 
              width: '100%', 
              background: 'var(--primary)', 
              color: 'white', 
              border: 'none', 
              padding: '1.25rem', 
              borderRadius: '12px', 
              fontWeight: '800', 
              fontSize: '1.125rem', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.75rem',
              transition: '0.3s',
              opacity: (requesting || parseFloat(stats.balance) < 5) ? 0.4 : 1
            }}
          >
            {requesting ? 'Processing Request...' : 'Request Withdrawal'} <ArrowRight size={22} />
          </button>
        </div>

        <div style={{ background: 'linear-gradient(135deg, #7158E2 0%, #5a45c7 100%)', padding: '2.5rem', borderRadius: '24px', color: 'white' }}>
          <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Shield size={24} /> Payout Terms
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            {[
              { title: 'Payment Schedule', desc: 'Withdrawals are processed within 3-5 business days.' },
              { title: 'Verification', desc: 'First time users may need to verify their identity/methods.' },
              { title: 'Fees', desc: 'No internal fees. Standard payment gateway fees may apply.' }
            ].map((item, i) => (
              <div key={i} style={{ borderLeft: '2px solid rgba(255,255,255,0.2)', paddingLeft: '1.5rem' }}>
                <div style={{ fontWeight: '800', marginBottom: '0.5rem' }}>{item.title}</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8, lineHeight: '1.6' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div style={{ background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden' }}>
        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--text)' }}>Withdrawal History</h3>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
                <th style={{ padding: '1rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase' }}>Date</th>
                <th style={{ padding: '1rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase' }}>Amount</th>
                <th style={{ padding: '1rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase' }}>Method</th>
                <th style={{ padding: '1rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {(history.payouts || []).length === 0 ? (
                <tr><td colSpan="4" style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No withdrawal history found.</td></tr>
              ) : (history.payouts || []).map(p => (
                <tr key={p._id} style={{ borderBottom: '1px solid var(--bg-alt)' }}>
                  <td style={{ padding: '1.5rem 2rem', fontWeight: '600', color: 'var(--text)' }}>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td style={{ padding: '1.5rem 2rem', fontWeight: '800', color: '#10b981' }}>${p.amount.toFixed(4)}</td>
                  <td style={{ padding: '1.5rem 2rem' }}>
                    <div style={{ fontWeight: '700', color: 'var(--text)' }}>{p.method}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-light)' }}>{p.account}</div>
                  </td>
                  <td style={{ padding: '1.5rem 2rem' }}>{statusBadge(p.status)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Withdraw;
