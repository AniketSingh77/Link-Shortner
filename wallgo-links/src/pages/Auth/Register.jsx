import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Zap, Mail, Lock, User, UserPlus, ArrowRight, ShieldCheck, CheckCircle2, Star, Sparkles, Globe, Shield, Fingerprint, Award } from 'lucide-react';
import api from '../../utils/api';

const Register = () => {
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [searchParams] = useSearchParams();
    const referralCode = searchParams.get('ref');
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }
        setLoading(true);
        setError('');
        try {
            const res = await api.post('/auth/register', {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                referredBy: referralCode || undefined
            });
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(res.data.user));
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.msg || 'Registration failed. Please try again.');
        } finally { setLoading(false); }
    };

    const update = (key) => (e) => setFormData(prev => ({ ...prev, [key]: e.target.value }));

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: '#ffffff', fontFamily: "'Inter', sans-serif" }}>

            {/* LEFT SIDE - BRANDING & FEATURES */}
            <div style={{
                flex: 1,
                background: '#E1E1FC',
                padding: '5rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden'
            }} className="hide-mobile">
                <div style={{ position: 'relative', zIndex: 10 }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', marginBottom: '4rem' }}>
                        <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '10px' }}>
                            <Zap size={24} color="white" fill="white" />
                        </div>
                        <span style={{ fontSize: '1.75rem', fontWeight: '800', color: '#1a1a1a', letterSpacing: '-0.02em' }}>Wallgo<span style={{ color: 'var(--primary)' }}>Links</span></span>
                    </Link>

                    <h1 style={{ fontSize: '3.5rem', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.1', marginBottom: '2rem' }}>
                        Join the <br />
                        <span style={{ color: 'var(--primary)' }}>Earning Network</span>
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#666', lineHeight: '1.6', marginBottom: '3rem', maxWidth: '500px' }}>
                        Create an account to start shortening links and earning money today. High rates, low payout threshold.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {[
                            'Free to join, no hidden costs',
                            'Get $1.00 bonus on first sign-up',
                            'Multiple payout methods supported',
                            '24/7 Dedicated user support'
                        ].map((text, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: '700', color: '#1a1a1a' }}>
                                <CheckCircle2 size={24} color="var(--primary)" /> {text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Decorative Pattern */}
                <div style={{
                    position: 'absolute',
                    top: '-50px',
                    left: '-50px',
                    width: '300px',
                    height: '300px',
                    border: '50px solid rgba(113, 88, 226, 0.05)',
                    borderRadius: '50%'
                }} />
            </div>

            {/* RIGHT SIDE - REGISTER FORM */}
            <div style={{
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem'
            }}>
                <div style={{ width: '100%', maxWidth: '440px' }}>
                    <div style={{ marginBottom: '2.5rem' }}>
                        <h2 style={{ fontSize: '2.25rem', fontWeight: '900', marginBottom: '0.75rem' }}>Sign Up</h2>
                        <p style={{ color: '#666', fontWeight: '500' }}>Get started with your free account</p>
                    </div>

                    {error && (
                        <div style={{
                            background: '#fff5f5',
                            border: '1px solid #feb2b2',
                            color: '#c53030',
                            padding: '1rem',
                            borderRadius: '12px',
                            marginBottom: '2rem',
                            fontWeight: '700',
                            fontSize: '0.875rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem'
                        }}>
                            <ShieldCheck size={20} /> {error}
                        </div>
                    )}

                    <form onSubmit={handleRegister}>
                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontWeight: '800', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Full Name</label>
                            <div style={{ position: 'relative' }}>
                                <User size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                                <input
                                    type="text"
                                    placeholder="Your Name"
                                    value={formData.name}
                                    onChange={update('name')}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 1rem 0.875rem 3rem',
                                        borderRadius: '12px',
                                        border: '1px solid #eee',
                                        background: '#f9f9f9',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                    className="focus:border-primary focus:bg-white"
                                />
                            </div>
                        </div>

                        <div style={{ marginBottom: '1.25rem' }}>
                            <label style={{ display: 'block', fontWeight: '800', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email Address</label>
                            <div style={{ position: 'relative' }}>
                                <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                                <input
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={update('email')}
                                    required
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 1rem 0.875rem 3rem',
                                        borderRadius: '12px',
                                        border: '1px solid #eee',
                                        background: '#f9f9f9',
                                        fontSize: '1rem',
                                        outline: 'none'
                                    }}
                                    className="focus:border-primary focus:bg-white"
                                />
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', fontWeight: '800', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Password</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.password}
                                        onChange={update('password')}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem 0.875rem 3rem',
                                            borderRadius: '12px',
                                            border: '1px solid #eee',
                                            background: '#f9f9f9',
                                            fontSize: '1rem',
                                            outline: 'none'
                                        }}
                                        className="focus:border-primary focus:bg-white"
                                    />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontWeight: '800', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Confirm</label>
                                <div style={{ position: 'relative' }}>
                                    <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                                    <input
                                        type="password"
                                        placeholder="••••••••"
                                        value={formData.confirmPassword}
                                        onChange={update('confirmPassword')}
                                        required
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem 1rem 0.875rem 3rem',
                                            borderRadius: '12px',
                                            border: '1px solid #eee',
                                            background: '#f9f9f9',
                                            fontSize: '1rem',
                                            outline: 'none'
                                        }}
                                        className="focus:border-primary focus:bg-white"
                                    />
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '2.5rem' }}>
                            <input type="checkbox" id="terms" required style={{ width: '20px', height: '20px', accentColor: 'var(--primary)', cursor: 'pointer' }} />
                            <label htmlFor="terms" style={{ fontSize: '0.875rem', fontWeight: '600', color: '#666', lineHeight: '1.4', cursor: 'pointer' }}>
                                I agree to the <Link to="/pages/terms" style={{ color: 'var(--primary)', fontWeight: '800', textDecoration: 'none' }}>Terms of Use</Link> and <Link to="/pages/privacy" style={{ color: 'var(--primary)', fontWeight: '800', textDecoration: 'none' }}>Privacy Policy</Link>.
                            </label>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            style={{
                                width: '100%',
                                background: 'var(--primary)',
                                color: 'white',
                                padding: '1.125rem',
                                borderRadius: '12px',
                                border: 'none',
                                fontWeight: '800',
                                fontSize: '1.125rem',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.75rem',
                                transition: '0.3s'
                            }}
                            className="hover:scale-[1.02]"
                        >
                            {loading ? 'Creating Account...' : 'Create Account'}
                            <UserPlus size={20} />
                        </button>
                    </form>

                    <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                        <p style={{ color: '#666', fontWeight: '600' }}>
                            Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '800', textDecoration: 'none' }}>Login Now</Link>
                        </p>
                    </div>
                </div>
            </div>

            <style>{`
                .focus\\:border-primary:focus { border-color: var(--primary) !important; }
                .focus\\:bg-white:focus { background: white !important; }
                @media (max-width: 991px) {
                    .hide-mobile { display: none !important; }
                }
            `}</style>
        </div>
    );
};

export default Register;
