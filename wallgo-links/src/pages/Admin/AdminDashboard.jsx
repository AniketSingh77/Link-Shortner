import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/common/AdminLayout';
import { 
  Users, Settings, CreditCard, Globe, FileText, BarChart2, 
  CheckCircle, XCircle, Clock, Shield, Search, Edit2, 
  Trash2, X, Plus, RefreshCw, Activity, DollarSign, 
  ArrowRight, Download, MousePointer2, ChevronRight, Save, Trash, Code
} from 'lucide-react';
import api from '../../utils/api';
import AdBanner from '../../components/AdBanner';

// ===================================================
// STATUS BADGE
// ===================================================
const StatusBadge = ({ status }) => {
  const map = { 
    Active: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' }, 
    Blocked: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' }, 
    Pending: { bg: 'rgba(245, 158, 11, 0.15)', text: '#f59e0b' }, 
    Complete: { bg: 'rgba(16, 185, 129, 0.15)', text: '#10b981' }, 
    Cancelled: { bg: 'rgba(239, 68, 68, 0.15)', text: '#ef4444' } 
  };
  const style = map[status] || { bg: 'var(--border)', text: 'var(--text-light)' };
  return (
    <span style={{ 
        padding: '0.25rem 0.625rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: '800', background: style.bg, color: style.text 
    }}>{status}</span>
  );
};

// ===================================================
// OVERVIEW SECTION
// ===================================================
const OverviewSection = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/stats').then(r => setStats(r.data)).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}><Activity size={40} className="spin" /></div>;

  const cards = [
    { label: 'Total Users', value: stats.totalUsers, color: '#7158E2', icon: Users, desc: 'Registered Publishers' },
    { label: 'Total Links', value: stats.totalLinks, color: '#3b82f6', icon: Globe, desc: 'Active Aliases' },
    { label: 'Global Traffic', value: stats.totalClicks?.toLocaleString(), color: '#10b981', icon: BarChart2, desc: 'Verified Impressions' },
    { label: 'Platform Revenue', value: `$${stats.totalEarnings}`, color: '#f59e0b', icon: DollarSign, desc: 'Gross Monetization' },
    { label: 'Total Payouts', value: `$${stats.totalPayouts}`, color: '#10b981', icon: CheckCircle, desc: 'Settled Requests' },
    { label: 'Pending Audit', value: stats.pendingPayouts, color: '#ef4444', icon: Clock, desc: 'Action Required' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
      {cards.map((c, i) => (
        <div key={i} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '24px', border: '1px solid var(--border)', transition: '0.3s' }} className="admin-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ background: c.color + '15', width: '50px', height: '50px', borderRadius: '15px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <c.icon size={24} color={c.color} />
            </div>
            <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: '950', color: 'var(--text)' }}>{c.value}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '800', textTransform: 'uppercase' }}>{c.label}</div>
            </div>
          </div>
          <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem', fontSize: '0.8125rem', color: 'var(--text-muted)', fontWeight: '600' }}>{c.desc}</div>
        </div>
      ))}
    </div>
  );
};

// ===================================================
// ADS PROTOCOL SECTION (Advanced)
// ===================================================
const SettingsSection = () => {
    const [config, setConfig] = useState({
      steps: 2,
      timer: 15,
      stepConfigs: [],
      adBannerIds: { top: '', sidebar: '', content: '' },
      adCodes: { top: '', sidebar: '', content: '', popunder: '', socialBar: '' }
    });
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
  
    useEffect(() => {
      api.get('/admin/settings').then(r => {
        const adConf = r.data.find(s => s.key === 'ad_config');
        if (adConf) {
            const val = adConf.value;
            // Ensure adCodes exists
            if (!val.adCodes) val.adCodes = { top: '', sidebar: '', content: '', popunder: '', socialBar: '' };
            setConfig(val);
        }
      }).finally(() => setLoading(false));
    }, []);
  
    const handleSave = async () => {
      setSaving(true);
      try {
        await api.post('/admin/settings', { key: 'ad_config', value: config });
        alert('Ads Protocol Updated!');
      } catch (err) { alert('Update Failed'); }
      finally { setSaving(false); }
    };

    const addStep = () => {
        const nextStep = (config.steps || 0) + 1;
        setConfig({
            ...config,
            steps: nextStep,
            stepConfigs: [...(config.stepConfigs || []), { step: nextStep, website: 'https://' }]
        });
    };

    const removeStep = () => {
        if (config.steps <= 1) return;
        const newSteps = config.steps - 1;
        setConfig({
            ...config,
            steps: newSteps,
            stepConfigs: (config.stepConfigs || []).slice(0, newSteps)
        });
    };
  
    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}><Activity size={40} className="spin" /></div>;
  
    return (
      <div style={{ maxWidth: '1000px' }}>
        <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
             <div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '950', marginBottom: '0.25rem' }}>Monetization Protocol</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Configure professional redirect logic and Adsterra/Popunder scripts.</p>
             </div>
             <button onClick={handleSave} disabled={saving} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', transition: '0.2s' }}>
                {saving ? <Activity className="spin" size={18} /> : <Save size={18} />} Save All Changes
             </button>
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '3rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '900', fontSize: '0.8125rem', color: 'var(--text)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Verification Steps (Pages)</label>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <button onClick={removeStep} style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>-</button>
                  <span style={{ fontSize: '1.25rem', fontWeight: '950' }}>{config.steps} Steps</span>
                  <button onClick={addStep} style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>+</button>
              </div>
            </div>
            <div>
              <label style={{ display: 'block', fontWeight: '900', fontSize: '0.8125rem', color: 'var(--text)', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Main Link Timer (Seconds)</label>
              <input type="number" value={config.timer} onChange={e => setConfig({...config, timer: parseInt(e.target.value)})}
                style={{ width: '100%', padding: '0.875rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontWeight: '800' }} />
            </div>
          </div>

          {/* STEP CONFIGS */}
          <div style={{ background: 'var(--bg-alt)', padding: '2rem', borderRadius: '24px', marginBottom: '3rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: '900', marginBottom: '1.5rem', color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Globe size={18} /> Redirect Flow (Optional Iframes)</h4>
            <div style={{ display: 'grid', gap: '1.25rem' }}>
                {(config.stepConfigs || []).map((s, idx) => (
                    <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'var(--bg-card)', padding: '1rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
                        <div style={{ width: '80px', fontWeight: '900', color: 'var(--text-light)', fontSize: '0.75rem' }}>STEP {idx + 1}</div>
                        <input type="text" value={s.website} placeholder="Background URL (or leave blank)"
                           onChange={e => {
                               const newConfigs = [...config.stepConfigs];
                               newConfigs[idx].website = e.target.value;
                               setConfig({...config, stepConfigs: newConfigs});
                           }}
                           style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', fontWeight: '700', color: 'var(--text)' }} />
                    </div>
                ))}
            </div>
          </div>

          {/* RAW AD CODES (FOR ADSTERRA) */}
          <div>
              <h4 style={{ fontSize: '1.125rem', fontWeight: '950', marginBottom: '1.5rem', color: 'var(--text)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Code size={22} color="var(--primary)" /> Adsterra / Custom Ad Codes
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: '800', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>TOP LEADERBOARD (728x90) SCRIPT</label>
                        <textarea 
                            value={config.adCodes?.top} 
                            onChange={e => setConfig({...config, adCodes: {...config.adCodes, top: e.target.value}})}
                            placeholder="Paste Adsterra 728x90 script here..."
                            style={{ width: '100%', minHeight: '100px', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.8125rem', fontFamily: 'monospace' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: '800', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>SIDEBAR (300x250) SCRIPT</label>
                        <textarea 
                            value={config.adCodes?.sidebar} 
                            onChange={e => setConfig({...config, adCodes: {...config.adCodes, sidebar: e.target.value}})}
                            placeholder="Paste Adsterra 300x250 script here..."
                            style={{ width: '100%', minHeight: '100px', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.8125rem', fontFamily: 'monospace' }}
                        />
                    </div>
                  </div>

                  <div>
                        <label style={{ display: 'block', fontWeight: '800', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>CENTER BOX (300x250) / NATIVE SCRIPT</label>
                        <textarea 
                            value={config.adCodes?.content} 
                            onChange={e => setConfig({...config, adCodes: {...config.adCodes, content: e.target.value}})}
                            placeholder="Paste Adsterra Native or 300x250 script here..."
                            style={{ width: '100%', minHeight: '100px', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.8125rem', fontFamily: 'monospace' }}
                        />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', fontWeight: '800', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>POPUNDER SCRIPT (HIDDEN)</label>
                        <textarea 
                            value={config.adCodes?.popunder} 
                            onChange={e => setConfig({...config, adCodes: {...config.adCodes, popunder: e.target.value}})}
                            placeholder="Paste Adsterra Popunder script code here..."
                            style={{ width: '100%', minHeight: '100px', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.8125rem', fontFamily: 'monospace' }}
                        />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontWeight: '800', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>SOCIAL BAR SCRIPT</label>
                        <textarea 
                            value={config.adCodes?.socialBar} 
                            onChange={e => setConfig({...config, adCodes: {...config.adCodes, socialBar: e.target.value}})}
                            placeholder="Paste Adsterra Social Bar script here..."
                            style={{ width: '100%', minHeight: '100px', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.8125rem', fontFamily: 'monospace' }}
                        />
                    </div>
                  </div>

              </div>
          </div>
        </div>
      </div>
    );
};

// ===================================================
// STATIC PAGES SECTION
// ===================================================
const PagesSection = () => {
    const [pages, setPages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const [saving, setSaving] = useState(false);

    const slugs = ['faq', 'privacy', 'terms', 'dmca', 'payment-policy'];

    const fetchPages = async () => {
        setLoading(true);
        try {
            const res = await Promise.all(slugs.map(s => api.get(`/pages/${s}`).catch(() => ({ data: { slug: s, title: s.charAt(0).toUpperCase() + s.slice(1), content: '' } }))));
            setPages(res.map(r => r.data));
        } finally { setLoading(false); }
    };

    useEffect(() => { fetchPages(); }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            await api.put(`/pages/${editing.slug}`, editing);
            alert('Page updated successfully!');
            fetchPages();
            setEditing(null);
        } catch (err) { alert('Save failed'); }
        finally { setSaving(false); }
    };

    if (loading) return <div style={{ textAlign: 'center', padding: '5rem' }}><Activity size={40} className="spin" /></div>;

    if (editing) return (
        <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: '900' }}>Editing: {editing.title}</h3>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button onClick={() => setEditing(null)} style={{ padding: '0.6rem 1.25rem', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', cursor: 'pointer' }}>Cancel</button>
                    <button onClick={handleSave} disabled={saving} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.6rem 1.25rem', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>{saving ? 'Saving...' : 'Save Changes'}</button>
                </div>
            </div>
            <input 
                style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', marginBottom: '1.5rem', fontSize: '1rem', fontWeight: '800' }}
                value={editing.title}
                onChange={e => setEditing({...editing, title: e.target.value})}
                placeholder="Page Title"
            />
            <textarea 
                style={{ width: '100%', minHeight: '400px', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)', background: 'var(--bg)', color: 'var(--text)', fontSize: '0.9375rem', fontFamily: 'monospace', outline: 'none' }}
                value={editing.content}
                onChange={e => setEditing({...editing, content: e.target.value})}
                placeholder="Page Content (HTML supported)"
            />
        </div>
    );

    return (
        <div style={{ display: 'grid', gap: '1rem' }}>
            {pages.map(p => (
                <div key={p.slug} style={{ background: 'var(--bg-card)', padding: '1.5rem', borderRadius: '20px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <div style={{ fontWeight: '900', fontSize: '1.125rem' }}>{p.title}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-light)', fontWeight: '700' }}>SLUG: /{p.slug}</div>
                    </div>
                    <button onClick={() => setEditing(p)} style={{ background: 'var(--primary-light)', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: '800', color: 'var(--primary)', cursor: 'pointer' }}>Edit Content</button>
                </div>
            ))}
        </div>
    );
};

// ===================================================
// ADMIN DASHBOARD MAIN
// ===================================================
const AdminDashboard = () => {
    const [tab, setTab] = useState('overview');
    const path = window.location.pathname;

    useEffect(() => {
        if (path.includes('/users')) setTab('users');
        else if (path.includes('/links')) setTab('links');
        else if (path.includes('/payouts')) setTab('payouts');
        else if (path.includes('/cpm')) setTab('cpm');
        else if (path.includes('/pages')) setTab('pages');
        else if (path.includes('/settings')) setTab('settings');
        else setTab('overview');
    }, [path]);

    return (
        <AdminLayout title={tab === 'overview' ? 'Administration Hub' : tab.charAt(0).toUpperCase() + tab.slice(1)}>
            {tab === 'overview' && <OverviewSection />}
            {tab === 'settings' && <SettingsSection />}
            {tab === 'pages' && <PagesSection />}
            {/* These would be implementation logic for other sections */}
            {tab === 'users' && <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>User Management UI Placeholder</div>}
            {tab === 'links' && <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>Global Link Audit UI Placeholder</div>}
            {tab === 'payouts' && <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>Payout Processing UI Placeholder</div>}
            {tab === 'cpm' && <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>CPM Rate Precision UI Placeholder</div>}
        </AdminLayout>
    );
};

export default AdminDashboard;
