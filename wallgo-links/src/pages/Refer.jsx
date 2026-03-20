import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import { Gift, Copy, Users, TrendingUp, ShieldCheck, Share2, Wallet, Star, Crown, Zap, CheckCircle2, QrCode, Sparkles, Shield, ArrowRight, Network, UserPlus } from 'lucide-react';
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

const Refer = () => {
  const [stats, setStats] = useState({ referralEarnings: '0.0000', balance: '0.0000', totalReferrals: 0 });
  const [user, setUser] = useState({});
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    setUser(stored);
    api.get('/stats/dashboard')
      .then(r => { setStats(r.data); })
      .catch(err => console.error('Fetch error', err))
      .finally(() => setLoading(false));
  }, []);

  const referralLink = `${window.location.origin}/register?ref=${user.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout title="Referrals">
      <div style={{ 
        background: 'linear-gradient(135deg, #7158E2 0%, #5a45c7 100%)', 
        padding: '4rem', 
        borderRadius: '24px', 
        color: 'white',
        textAlign: 'center',
        marginBottom: '2.5rem',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ background: 'rgba(255,255,255,0.2)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                <Gift size={40} color="white" />
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: '900', marginBottom: '1rem' }}>Earn 20% Life Time!</h2>
            <p style={{ fontSize: '1.125rem', opacity: 0.9, maxWidth: '600px', margin: '0 auto 2.5rem', lineHeight: '1.6' }}>
                Invite your friends and earn 20% of their earnings for life! There is no limit to how much you can earn.
            </p>

            <div style={{ 
                background: 'var(--bg-white)', 
                padding: '0.5rem', 
                borderRadius: '12px', 
                display: 'flex', 
                maxWidth: '600px', 
                margin: '0 auto',
                boxShadow: 'var(--shadow)'
            }}>
                <div style={{ 
                    flex: 1, 
                    display: 'flex', 
                    alignItems: 'center', 
                    paddingLeft: '1.5rem', 
                    color: 'var(--text-muted)',
                    fontWeight: '700',
                    fontSize: '0.9375rem',
                    overflow: 'hidden',
                    whiteSpace: 'nowrap'
                }}>
                    {referralLink}
                </div>
                <button 
                    onClick={handleCopy}
                    style={{ 
                        background: copied ? '#10b981' : '#7158E2', 
                        color: 'white', 
                        border: 'none', 
                        padding: '1rem 2rem', 
                        borderRadius: '10px', 
                        fontWeight: '800', 
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: '0.3s'
                    }}
                >
                    {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
                    {copied ? 'Copied!' : 'Copy Link'}
                </button>
            </div>
        </div>

        {/* Decorative Background Circles */}
        <div style={{ position: 'absolute', top: '-100px', left: '-100px', width: '300px', height: '300px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
        <div style={{ position: 'absolute', bottom: '-150px', right: '-150px', width: '400px', height: '400px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%' }} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        <StatCard icon={TrendingUp} label="Referral Earnings" value={loading ? '...' : `$${stats.referralEarnings}`} color="#7158E2" />
        <StatCard icon={Users} label="Total Referrals" value={loading ? '...' : stats.totalReferrals} color="#10b981" />
        <StatCard icon={Network} label="Commission Rate" value="20.0%" color="#f59e0b" />
      </div>

      <div style={{ background: 'var(--bg-card)', padding: '3rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '3rem', textAlign: 'center', color: 'var(--text)' }}>How Referrals Work</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4rem' }}>
              {[
                  { icon: Share2, title: 'Share Link', desc: 'Copy your unique referral link and share it with your audience or friends.', color: '#7158E2' },
                  { icon: UserPlus, title: 'New Signups', desc: 'When people sign up using your link, they are added to your referral network.', color: '#3b82f6' },
                  { icon: Wallet, title: 'Earn Commission', desc: 'You earn 20% of whatever they earn, credited to your account instantly.', color: '#10b981' }
              ].map((step, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                      <div style={{ 
                          background: step.color + '15', 
                          color: step.color, 
                          width: '70px', 
                          height: '70px', 
                          borderRadius: '20px', 
                          display: 'flex', 
                          alignItems: 'center', 
                          justifyContent: 'center', 
                          margin: '0 auto 1.5rem' 
                      }}>
                          <step.icon size={32} />
                      </div>
                      <h4 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text)' }}>{step.title}</h4>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9375rem', lineHeight: '1.6' }}>{step.desc}</p>
                  </div>
              ))}
          </div>
      </div>
    </DashboardLayout>
  );
};

export default Refer;
