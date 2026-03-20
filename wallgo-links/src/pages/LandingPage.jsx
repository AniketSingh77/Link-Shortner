import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Globe, Shield, DollarSign, Users, BarChart2, ChevronRight, Copy, Check, MessageSquare, Mail, Youtube, Instagram, Twitter, Send, Sparkles, ArrowRight, ShieldCheck, Activity, Award, Play, MousePointer2, TrendingUp, ZapOff, Sun, Moon } from 'lucide-react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';

const LandingPage = () => {
    const { isDarkMode, toggleTheme } = useTheme();
    const [url, setUrl] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShorten = async (e) => {
        e.preventDefault();
        if (!url) return;
        const token = localStorage.getItem('token');
        if (!token) {
            window.location.href = '/register';
            return;
        }
        setLoading(true);
        try {
            const res = await api.post('/links/shorten', { originalUrl: url });
            setResult(`${window.location.origin}/st/${res.data.alias}`);
        } catch (err) {
            alert(err.response?.data?.msg || 'Authentication required.');
        } finally { setLoading(false); }
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(result);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div style={{ background: 'var(--bg)', color: 'var(--text)', fontFamily: "'Inter', sans-serif", overflowX: 'hidden' }}>

            {/* ====== NAVBAR ====== */}
            <nav style={{
                height: '80px',
                display: 'flex',
                alignItems: 'center',
                padding: '0 8%',
                justifyContent: 'space-between',
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                background: 'var(--bg-white)',
                opacity: 0.95,
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--border)'
            }}>
                <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}>
                    <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '10px' }}>
                        <Zap size={20} color="white" fill="white" />
                    </div>
                    <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.02em' }}>Wallgo<span style={{ color: 'var(--primary)' }}>Links</span></span>
                </Link>

                <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                    <Link to="/payout-rates" style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9375rem', textDecoration: 'none' }}>Payout Rates</Link>
                    
                    <button onClick={toggleTheme} style={{ 
                        background: 'var(--bg-alt)', 
                        border: '1px solid var(--border)', 
                        color: 'var(--text)', 
                        width: '40px', height: '40px', 
                        borderRadius: '10px', 
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer'
                    }}>
                        {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                    </button>

                    {localStorage.getItem('token') ? (
                        <Link to="/dashboard" style={{
                            background: 'var(--primary)',
                            color: 'white',
                            padding: '0.75rem 1.5rem',
                            borderRadius: '30px',
                            fontWeight: '700',
                            fontSize: '0.9375rem',
                            textDecoration: 'none'
                        }}>Dashboard</Link>
                    ) : (
                        <>
                            <Link to="/login" style={{ color: 'var(--text-muted)', fontWeight: '600', fontSize: '0.9375rem', textDecoration: 'none' }}>Login</Link>
                            <Link to="/register" style={{
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '30px',
                                fontWeight: '700',
                                fontSize: '0.9375rem',
                                textDecoration: 'none'
                            }}>Sign Up</Link>
                        </>
                    )}
                </div>
            </nav>

            {/* ====== HERO SECTION ====== */}
            <section style={{
                minHeight: '90vh',
                padding: '120px 8% 80px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                textAlign: 'center',
                background: isDarkMode ? 'var(--bg)' : 'linear-gradient(180deg, #f8f9ff 0%, #ffffff 100%)'
            }}>
                <div style={{ maxWidth: '900px' }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: 'var(--primary-light)',
                        color: 'var(--primary)',
                        padding: '0.5rem 1.25rem',
                        borderRadius: '30px',
                        fontSize: '0.875rem',
                        fontWeight: '700',
                        marginBottom: '2rem'
                    }}>
                        <Sparkles size={16} /> #1 URL Shortener for Publishers
                    </div>
                    <h1 style={{
                        fontSize: '4.5rem',
                        fontWeight: '900',
                        color: 'var(--text)',
                        lineHeight: '1.1',
                        marginBottom: '1.5rem',
                        letterSpacing: '-0.04em'
                    }}>
                        Shorten URLs and <br />
                        <span style={{ color: 'var(--primary)' }}>Earn Money</span> easily
                    </h1>
                    <p style={{
                        fontSize: '1.25rem',
                        color: 'var(--text-muted)',
                        lineHeight: '1.6',
                        marginBottom: '3.5rem',
                        maxWidth: '700px',
                        margin: '0 auto 3.5rem'
                    }}>
                        Join thousands of publishers who earn high CPM rates by sharing shortened links.
                        Simple, fast, and transparent.
                    </p>

                    <form onSubmit={handleShorten} style={{
                        background: 'var(--bg-card)',
                        padding: '0.625rem',
                        borderRadius: '50px',
                        display: 'flex',
                        boxShadow: 'var(--shadow)',
                        maxWidth: '700px',
                        margin: '0 auto 4rem',
                        border: '1px solid var(--border)'
                    }}>
                        <input
                            type="url"
                            placeholder="Paste your long URL here..."
                            value={url}
                            onChange={(e) => setUrl(e.target.value)}
                            required
                            style={{
                                flex: 1,
                                border: 'none',
                                outline: 'none',
                                padding: '0 2rem',
                                fontSize: '1.125rem',
                                background: 'transparent',
                                color: 'var(--text)',
                                width: '100%'
                            }}
                        />
                        <button type="submit" disabled={loading} style={{
                            background: 'var(--primary)',
                            color: 'white',
                            border: 'none',
                            padding: '1.25rem 2.5rem',
                            borderRadius: '40px',
                            fontWeight: '800',
                            fontSize: '1.125rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            transition: '0.3s'
                        }}>
                            {loading ? 'Processing...' : 'Shorten Now'}
                            <ArrowRight size={20} />
                        </button>
                    </form>

                    {result && (
                        <div style={{
                            background: 'var(--primary-light)',
                            border: '2px dashed var(--primary)',
                            borderRadius: '24px',
                            padding: '1.5rem',
                            maxWidth: '700px',
                            margin: '0 auto 4rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between'
                        }}>
                            <span style={{ fontWeight: '700', color: 'var(--primary)', fontSize: '1.25rem' }}>{result}</span>
                            <button onClick={handleCopy} style={{
                                background: copied ? '#10b981' : 'var(--primary)',
                                color: 'white',
                                border: 'none',
                                padding: '0.75rem 1.5rem',
                                borderRadius: '12px',
                                fontWeight: '700',
                                cursor: 'pointer'
                            }}>
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '4rem', opacity: 0.6 }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '800' }}>10k+</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Active Users</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '800' }}>$50k+</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Total Paid</div>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2rem', fontWeight: '800' }}>1M+</div>
                            <div style={{ fontSize: '0.875rem', fontWeight: '600' }}>Links Shortened</div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ====== HOW IT WORKS ====== */}
            <section style={{ padding: '100px 8%', background: 'var(--bg)' }}>
                <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                    <h2 style={{ fontSize: '3rem', fontWeight: '900', marginBottom: '1.5rem' }}>How it works?</h2>
                    <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem' }}>Start earning in 3 simple steps</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem' }}>
                    {[
                        { icon: Users, title: 'Create account', desc: 'Sign up for free and get access to your dashboard.', color: '#7158E2' },
                        { icon: Zap, title: 'Shorten links', desc: 'Paste your long URLs and get shortened versions.', color: '#EF4444' },
                        { icon: DollarSign, title: 'Earn Money', desc: 'Share your links and earn money for every click.', color: '#10B981' }
                    ].map((step, i) => (
                        <div key={i} style={{
                            padding: '3rem',
                            borderRadius: '32px',
                            background: 'var(--bg-alt)',
                            border: '1px solid var(--border)',
                            textAlign: 'center',
                            transition: '0.3s'
                        }} className="hover-lift">
                            <div style={{
                                background: step.color,
                                width: '70px',
                                height: '70px',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 2rem',
                                color: 'white',
                                boxShadow: `0 10px 20px ${step.color}33`
                            }}>
                                <step.icon size={32} />
                            </div>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--text)' }}>{step.title}</h3>
                            <p style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>{step.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* ====== FEATURES SECTION ====== */}
            <section style={{ padding: '100px 8%', background: 'var(--bg-alt)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6rem', alignItems: 'center' }}>
                    <div>
                        <h2 style={{ fontSize: '3.5rem', fontWeight: '900', lineHeight: '1.1', marginBottom: '2.5rem' }}>
                            Premium Features <br />
                            <span style={{ color: 'var(--primary)' }}>For Publishers</span>
                        </h2>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {[
                                { title: 'High CPM Rates', desc: 'Get the best rates in the industry for your traffic.', icon: TrendingUp },
                                { title: 'Fast Payouts', desc: 'Receive your earnings quickly via multiple methods.', icon: Zap },
                                { title: 'Detailed Analytics', desc: 'Track your clicks and earnings in real-time.', icon: Activity },
                                { title: 'Referral Program', desc: 'Earn extra 20% by referring your friends.', icon: Users },
                            ].map((f, i) => (
                                <div key={i} style={{ display: 'flex', gap: '1.5rem' }}>
                                    <div style={{ color: 'var(--primary)', flexShrink: 0 }}><f.icon size={28} /></div>
                                    <div>
                                        <h4 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '0.5rem', color: 'var(--text)' }}>{f.title}</h4>
                                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.5' }}>{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div style={{ position: 'relative' }}>
                        <div style={{
                            background: 'var(--bg-card)',
                            borderRadius: '40px',
                            padding: '3rem',
                            border: '1px solid var(--border)',
                            boxShadow: 'var(--shadow)',
                            position: 'relative',
                            zIndex: 10
                        }}>
                             <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3rem' }}>
                                 <h3 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)' }}>Earnings Overview</h3>
                                 <span style={{ color: '#10B981', fontWeight: '800' }}>+24% Increase</span>
                             </div>
                             <div style={{ height: '300px', display: 'flex', alignItems: 'flex-end', gap: '1rem' }}>
                                 {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                     <div key={i} style={{ flex: 1, background: i === 3 ? 'var(--primary)' : 'var(--bg-white)', height: `${h}%`, borderRadius: '10px' }} />
                                 ))}
                             </div>
                        </div>
                        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '200px', height: '200px', background: 'var(--primary)', borderRadius: '50%', opacity: 0.1, filter: 'blur(50px)' }} />
                    </div>
                </div>
            </section>

            {/* ====== FOOTER ====== */}
            <footer style={{ background: 'var(--bg)', padding: '100px 8% 50px', borderTop: '1px solid var(--border)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1.5fr', gap: '4rem', marginBottom: '5rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
                            <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '10px' }}>
                                <Zap size={20} color="white" fill="white" />
                            </div>
                            <span style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text)', letterSpacing: '-0.02em' }}>Wallgo<span style={{ color: 'var(--primary)' }}>Links</span></span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: '1.7', marginBottom: '2rem', maxWidth: '300px' }}>
                            Earn money by shortening your links. High CPM, fast payments, and trusted by thousands.
                        </p>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            {[Twitter, Instagram, Youtube, Send].map((Icon, i) => (
                                <a key={i} href="#" style={{ color: 'var(--text-light)', transition: '0.3s' }}><Icon size={20} /></a>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 style={{ fontWeight: '800', marginBottom: '2rem', color: 'var(--text)' }}>Links</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li><Link to="/payout-rates" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Payout Rates</Link></li>
                            <li><Link to="/pages/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Use</Link></li>
                            <li><Link to="/pages/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h4 style={{ fontWeight: '800', marginBottom: '2rem', color: 'var(--text)' }}>Support</h4>
                        <ul style={{ listStyle: 'none', padding: 0, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <li><Link to="/contact" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Contact Us</Link></li>
                            <li><Link to="/pages/faq" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>FAQ</Link></li>
                        </ul>
                    </div>
                    <div style={{ background: 'var(--bg-alt)', padding: '2rem', borderRadius: '24px', border: '1px solid var(--border)' }}>
                        <h4 style={{ fontWeight: '800', marginBottom: '1rem', color: 'var(--text)' }}>Contact Us</h4>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Have questions? Reach out to our support team.</p>
                        <a href="mailto:support@wallgolinks.com" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            color: 'var(--primary)',
                            fontWeight: '800',
                            textDecoration: 'none'
                        }}>
                             <Mail size={20} /> support@wallgolinks.com
                        </a>
                    </div>
                </div>
                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '30px', textAlign: 'center', color: 'var(--text-light)', fontSize: '0.875rem' }}>
                    &copy; {new Date().getFullYear()} Wallgo Links. All rights reserved.
                </div>
            </footer>

            <style>{`
                .hover-lift:hover { transform: translateY(-10px); box-shadow: var(--shadow) !important; }
                @media (max-width: 991px) {
                    nav { padding: 0 5%; }
                    h1 { fontSize: 3rem !important; }
                    section { padding: 100px 5% 50px !important; }
                    div[style*="gridTemplateColumns"] { grid-template-columns: 1fr !important; }
                }
            `}</style>
        </div>
    );
};

export default LandingPage;
