import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Globe, Monitor, Chrome, RefreshCw, Database, Activity, Navigation } from 'lucide-react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';

const COLORS = ['#7158E2', '#10b981', '#f59e0b', '#3b82f6', '#ec4899', '#ef4444'];

const TrafficSource = () => {
    const { isDarkMode } = useTheme();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchData = async () => {
        setLoading(true);
        try {
            const res = await api.get('/stats/traffic');
            setData(res.data);
        } catch (err) {
            console.error('Traffic fetch error', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, []);

    const deviceData = (data?.byDevice || []).map(d => ({ name: d._id || 'Unknown', value: d.clicks }));
    const countryData = data?.byCountry || [];
    const browserData = (data?.byBrowser || []).map(b => ({ name: b._id || 'Other', clicks: b.clicks }));
    const totalClicks = (countryData || []).reduce((s, c) => s + c.clicks, 0);

    return (
        <DashboardLayout title="Traffic Statistics">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <div>
                    <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)' }}>Traffic Analysis</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>Real-time breakdown of your link traffic</p>
                </div>
                <button
                    onClick={fetchData}
                    disabled={loading}
                    style={{
                        background: 'var(--bg-alt)',
                        border: '1px solid var(--border)',
                        color: 'var(--text)',
                        padding: '0.75rem 1.25rem',
                        borderRadius: '12px',
                        fontWeight: '700',
                        fontSize: '0.875rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        cursor: 'pointer'
                    }}
                >
                    <RefreshCw size={18} className={loading ? 'spin' : ''} />
                    {loading ? 'Refreshing...' : 'Refresh Data'}
                </button>
            </div>

            {loading ? (
                <div style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-light)' }}>
                    <Activity size={48} className="spin" style={{ marginBottom: '1rem', color: 'var(--primary)' }} />
                    <div style={{ fontWeight: '700' }}>Loading analytics...</div>
                </div>
            ) : (!data || totalClicks === 0) ? (
                <div style={{ background: 'var(--bg-card)', padding: '5rem', borderRadius: '24px', border: '1px solid var(--border)', textAlign: 'center', boxShadow: 'var(--shadow)' }}>
                    <Database size={64} style={{ color: 'var(--border)', marginBottom: '2rem' }} />
                    <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text)' }}>No Data Yet</h3>
                    <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>Once your links start receiving clicks, you'll see detailed traffic analytics here.</p>
                </div>
            ) : (
                <>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                        {/* Device Breakdown */}
                        <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.5rem', borderRadius: '10px' }}><Monitor size={20} /></div>
                                <h4 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text)' }}>Devices</h4>
                            </div>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer>
                                    <PieChart>
                                        <Pie data={deviceData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value" stroke="var(--bg-card)">
                                            {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip 
                                            contentStyle={{ 
                                                borderRadius: '12px', 
                                                background: 'var(--bg-card)', 
                                                border: '1px solid var(--border)', 
                                                color: 'var(--text)',
                                                boxShadow: 'var(--shadow)' 
                                            }} 
                                        />
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        {/* Browser Breakdown */}
                        <div style={{ background: 'var(--bg-card)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                                <div style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.5rem', borderRadius: '10px' }}><Chrome size={20} /></div>
                                <h4 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text)' }}>Browsers</h4>
                            </div>
                            <div style={{ height: '300px' }}>
                                <ResponsiveContainer>
                                    <BarChart data={browserData} margin={{ left: -20 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: '700', fill: 'var(--text-light)' }} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fontWeight: '700', fill: 'var(--text-light)' }} />
                                        <Tooltip 
                                            cursor={{ fill: 'var(--bg-alt)', radius: 10, opacity: 0.1 }} 
                                            contentStyle={{ 
                                                borderRadius: '12px', 
                                                background: 'var(--bg-card)', 
                                                border: '1px solid var(--border)', 
                                                color: 'var(--text)',
                                                boxShadow: 'var(--shadow)' 
                                            }} 
                                        />
                                        <Bar dataKey="clicks" fill="var(--primary)" radius={[8, 8, 0, 0]} barSize={40} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>

                    {/* Geography Table */}
                    <div style={{ background: 'var(--bg-card)', borderRadius: '24px', border: '1px solid var(--border)', overflow: 'hidden', boxShadow: 'var(--shadow)' }}>
                        <div style={{ padding: '2rem', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.5rem', borderRadius: '10px' }}><Globe size={20} /></div>
                            <h4 style={{ fontSize: '1.125rem', fontWeight: '800', color: 'var(--text)' }}>Top Countries</h4>
                        </div>
                        <div style={{ overflowX: 'auto' }}>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ background: 'var(--bg-alt)', borderBottom: '1px solid var(--border)' }}>
                                        <th style={{ padding: '1rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase' }}>Country</th>
                                        <th style={{ padding: '1rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase' }}>Clicks</th>
                                        <th style={{ padding: '1rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase' }}>Market Share</th>
                                        <th style={{ padding: '1rem 2rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-light)', textTransform: 'uppercase' }}>Ratio</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {countryData.map((c, i) => (
                                        <tr key={i} style={{ borderBottom: '1px solid var(--border)' }}>
                                            <td style={{ padding: '1.25rem 2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: '700', color: 'var(--text)' }}>
                                                    <div style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-alt)', borderRadius: '6px', fontSize: '0.75rem', color: 'var(--text-muted)', border: '1px solid var(--border)' }}>{c._id}</div>
                                                    {c._id || 'Unknown'}
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 2rem', fontWeight: '700', color: 'var(--text)' }}>{c.clicks.toLocaleString()}</td>
                                            <td style={{ padding: '1.25rem 2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <div style={{ flex: 1, height: '8px', background: 'var(--bg-alt)', borderRadius: '4px', overflow: 'hidden' }}>
                                                        <div style={{ height: '100%', width: `${((c.clicks / totalClicks) * 100).toFixed(0)}%`, background: i === 0 ? 'var(--primary)' : 'var(--text-light)' }} />
                                                    </div>
                                                    <span style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--text-muted)' }}>{((c.clicks / totalClicks) * 100).toFixed(1)}%</span>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.25rem 2rem', textAlign: 'right', fontWeight: '800', color: '#10b981' }}>{((c.clicks / totalClicks) * 100).toFixed(1)}%</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
            <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </DashboardLayout>
    );
};

export default TrafficSource;
