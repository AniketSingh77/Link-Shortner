import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import { User, CheckCircle2, Save, Lock, Mail, Phone, MapPin, CreditCard, Shield, Zap, Copy, X, Camera, Globe, Fingerprint, Crown, Sparkles, ShieldCheck, ArrowRight, Settings } from 'lucide-react';
import api from '../utils/api';

const Profile = () => {
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [msg, setMsg] = useState({ type: '', text: '' });
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        setProfile(res.data);
      } catch (e) { console.error('Profile fetch error', e); }
      finally { setLoading(false); }
    };
    fetchProfile();
  }, []);

  const handleCopyToken = () => {
    navigator.clipboard.writeText(profile.apiToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const showMsg = (text, type = 'success') => {
    setMsg({ text, type });
    setTimeout(() => setMsg({ text: '', type: '' }), 4000);
  };

  const handleProfileSave = async () => {
    setSaving(true);
    try {
      await api.put('/user/profile', profile);
      showMsg('Profile updated successfully!');
    } catch (e) { showMsg('Failed to update profile.', 'error'); }
    finally { setSaving(false); }
  };

  const handlePaymentSave = async () => {
    setSaving(true);
    try {
      await api.put('/user/payment', {
        paymentMethod: profile.paymentMethod,
        paymentAccount: profile.paymentAccount
      });
      showMsg('Payment settings updated!');
    } catch (e) { showMsg('Failed to update payment settings.', 'error'); }
    finally { setSaving(false); }
  };

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      return alert('New passwords do not match!');
    }
    setSaving(true);
    try {
      await api.put('/user/password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      showMsg('Password changed successfully!');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (e) { showMsg(e.response?.data?.msg || 'Failed to change password.', 'error'); }
    finally { setSaving(false); }
  };

  const Field = ({ label, icon: Icon, value, field, type = 'text', placeholder }) => (
    <div style={{ marginBottom: '1.5rem' }}>
      <label style={{ fontWeight: '700', fontSize: '0.875rem', color: '#666', display: 'block', marginBottom: '0.75rem' }}>
        {label}
      </label>
      <div style={{ position: 'relative' }}>
        <input
          type={type}
          placeholder={placeholder}
          value={value || ''}
          onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
          style={{ 
            padding: '0.875rem 1rem', 
            borderRadius: '10px', 
            border: '1px solid #eee', 
            background: '#f9f9f9',
            fontSize: '1rem',
            color: '#1a1a1a',
            width: '100%',
            outline: 'none'
          }}
        />
      </div>
    </div>
  );

  if (loading) return (
    <DashboardLayout title="Settings">
      <div style={{ textAlign: 'center', padding: '10rem' }}>
         <Activity size={40} className="spin" style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
         <p style={{ color: '#aaa', fontWeight: '700' }}>Loading profile...</p>
      </div>
    </DashboardLayout>
  );

  return (
    <DashboardLayout title="Settings">
      {msg.text && (
        <div style={{ 
          position: 'fixed', bottom: '2rem', right: '2rem', zIndex: 1000,
          background: msg.type === 'error' ? '#fef2f2' : 'white',
          color: msg.type === 'error' ? '#ef4444' : '#10b981', 
          padding: '1rem 2rem', borderRadius: '12px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
          display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: '800',
          border: '1px solid ' + (msg.type === 'error' ? '#fee2e2' : '#eee'),
        }}>
          {msg.type === 'error' ? <X size={20} /> : <CheckCircle2 size={20} />}
          {msg.text}
        </div>
      )}

      {/* Profile Info Header */}
      <div style={{ background: 'white', padding: '2rem', borderRadius: '24px', border: '1px solid #eee', marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <div style={{ position: 'relative' }}>
           <img 
             src={`https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name)}&background=7158E2&color=fff&size=200&bold=true`} 
             alt="Avatar" 
             style={{ width: '100px', height: '100px', borderRadius: '50%' }} 
           />
        </div>
        <div style={{ flex: 1 }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: '800', marginBottom: '0.25rem' }}>{profile.name}</h2>
          <p style={{ color: '#666', fontWeight: '600' }}>{profile.email} • Member since {new Date(profile.createdAt).getFullYear()}</p>
        </div>
        <div style={{ background: '#f8f9ff', padding: '1rem 1.5rem', borderRadius: '16px', border: '1px solid #eef2ff' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: '800', color: '#aaa', marginBottom: '0.5rem', textTransform: 'uppercase' }}>API Token</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <code style={{ fontSize: '0.9375rem', color: 'var(--primary)', fontWeight: '800', letterSpacing: '1px' }}>{profile.apiToken.slice(0, 10)}••••</code>
              <button onClick={handleCopyToken} style={{ background: 'none', border: 'none', color: copied ? '#10b981' : '#aaa', cursor: 'pointer' }}>
                {copied ? <CheckCircle2 size={18} /> : <Copy size={18} />}
              </button>
            </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Profile Form */}
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '2rem' }}>Personal Information</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="Full Name" value={profile.name} field="name" />
              <Field label="WhatsApp Number" value={profile.whatsapp} field="whatsapp" placeholder="+91 00000 00000" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '700', fontSize: '0.875rem', color: '#666', display: 'block', marginBottom: '0.75rem' }}>Gender</label>
                <select style={{ padding: '0.875rem 1rem', borderRadius: '10px', border: '1px solid #eee', background: '#f9f9f9', width: '100%', outline: 'none' }} value={profile.gender || ''} onChange={(e) => setProfile({ ...profile, gender: e.target.value })}>
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <Field label="City" value={profile.city} field="city" />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <Field label="State" value={profile.state} field="state" />
              <Field label="Country" value={profile.country} field="country" />
            </div>
            <Field label="Detailed Address" value={profile.address} field="address" />
            
            <button style={{ 
                background: 'var(--primary)', color: 'white', border: 'none', padding: '1rem 2.5rem', 
                borderRadius: '10px', fontWeight: '800', cursor: 'pointer', marginTop: '1rem' 
            }} onClick={handleProfileSave} disabled={saving}>
               {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>

          {/* Payment Form */}
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '2rem' }}>Payment Settings</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontWeight: '700', fontSize: '0.875rem', color: '#666', display: 'block', marginBottom: '0.75rem' }}>Withdrawal Method</label>
                <select style={{ padding: '0.875rem 1rem', borderRadius: '10px', border: '1px solid #eee', background: '#f9f9f9', width: '100%', outline: 'none' }} value={profile.paymentMethod || 'UPI'} onChange={(e) => setProfile({ ...profile, paymentMethod: e.target.value })}>
                  <option value="UPI">UPI</option>
                  <option value="PayPal">PayPal</option>
                  <option value="Paytm">Paytm</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                </select>
              </div>
              <Field label="Account/ID" value={profile.paymentAccount} field="paymentAccount" placeholder="your-id@bank" />
            </div>
            <button style={{ 
                background: '#10b981', color: 'white', border: 'none', padding: '1rem 2.5rem', 
                borderRadius: '10px', fontWeight: '800', cursor: 'pointer' 
            }} onClick={handlePaymentSave} disabled={saving}>
               Save Payment Settings
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {/* Password Section */}
          <div style={{ background: 'white', padding: '2.5rem', borderRadius: '24px', border: '1px solid #eee' }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '2rem' }}>Change Password</h3>
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#666', marginBottom: '0.75rem', display: 'block' }}>Current Password</label>
                <input type="password" style={{ padding: '0.875rem 1rem', borderRadius: '10px', border: '1px solid #eee', background: '#f9f9f9', width: '100%', outline: 'none' }} value={passwordData.currentPassword} onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })} />
            </div>
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#666', marginBottom: '0.75rem', display: 'block' }}>New Password</label>
                <input type="password" style={{ padding: '0.875rem 1rem', borderRadius: '10px', border: '1px solid #eee', background: '#f9f9f9', width: '100%', outline: 'none' }} value={passwordData.newPassword} onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })} />
            </div>
            <div style={{ marginBottom: '2rem' }}>
                <label style={{ fontSize: '0.875rem', fontWeight: '700', color: '#666', marginBottom: '0.75rem', display: 'block' }}>Confirm New Password</label>
                <input type="password" style={{ padding: '0.875rem 1rem', borderRadius: '10px', border: '1px solid #eee', background: '#f9f9f9', width: '100%', outline: 'none' }} value={passwordData.confirmPassword} onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })} />
            </div>
            <button style={{ 
                background: '#1a1a1a', color: 'white', border: 'none', padding: '1rem', 
                borderRadius: '10px', fontWeight: '800', width: '100%', cursor: 'pointer' 
            }} onClick={handlePasswordChange} disabled={saving}>
              Update Password
            </button>
          </div>

          <div style={{ background: '#7158E2', padding: '2rem', borderRadius: '24px', color: 'white' }}>
             <h4 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Shield size={22} /> Security Tip
             </h4>
             <p style={{ fontSize: '0.875rem', lineHeight: '1.6', opacity: 0.9 }}>
                Use a strong password with at least 8 characters, including numbers and symbols. Never share your API token with anyone.
             </p>
          </div>
        </div>
      </div>
      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
};

export default Profile;
