import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Zap, Mail, Lock, LogIn, ArrowRight, ShieldCheck, Star, Fingerprint, Sparkles, Globe, Shield, CheckCircle2 } from 'lucide-react';
import api from '../../utils/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', { email, password });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid email or password.');
    } finally { setLoading(false); }
  };

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
                  Welcome back to <br />
                  <span style={{ color: 'var(--primary)' }}>Wallgo Links</span>
              </h1>
              <p style={{ fontSize: '1.25rem', color: '#666', lineHeight: '1.6', marginBottom: '3rem', maxWidth: '500px' }}>
                  Manage your links, track your earnings, and grow your audience with our professional tools.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  {[
                      'High CPM Rates globally',
                      'Detailed real-time analytics',
                      'Minimum payout of only $5.00',
                      '20% Referral bonus for lifetime'
                  ].map((text, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontWeight: '700', color: '#1a1a1a' }}>
                          <CheckCircle2 size={24} color="var(--primary)" /> {text}
                      </div>
                  ))}
              </div>
          </div>
          
          {/* Decorative Circle */}
          <div style={{
              position: 'absolute',
              bottom: '-100px',
              right: '-100px',
              width: '400px',
              height: '400px',
              background: 'var(--primary)',
              borderRadius: '50%',
              opacity: 0.1
          }} />
      </div>

      {/* RIGHT SIDE - LOGIN FORM */}
      <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '3rem'
      }}>
          <div style={{ width: '100%', maxWidth: '420px' }}>
              <div style={{ marginBottom: '2.5rem' }}>
                  <h2 style={{ fontSize: '2.25rem', fontWeight: '900', marginBottom: '0.75rem' }}>Login</h2>
                  <p style={{ color: '#666', fontWeight: '500' }}>Enter your credentials to access your account</p>
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

              <form onSubmit={handleLogin}>
                  <div style={{ marginBottom: '1.5rem' }}>
                      <label style={{ display: 'block', fontWeight: '800', marginBottom: '0.5rem', fontSize: '0.875rem' }}>Email Address</label>
                      <div style={{ position: 'relative' }}>
                          <Mail size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                          <input
                              type="email"
                              placeholder="name@company.com"
                              value={email}
                              onChange={(e) => setEmail(e.target.value)}
                              required
                              style={{
                                  width: '100%',
                                  padding: '1rem 1rem 1rem 3rem',
                                  borderRadius: '12px',
                                  border: '1px solid #eee',
                                  background: '#f9f9f9',
                                  fontSize: '1rem',
                                  outline: 'none',
                                  transition: '0.2s'
                              }}
                              className="focus:border-primary focus:bg-white"
                          />
                      </div>
                  </div>

                  <div style={{ marginBottom: '2rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                          <label style={{ fontWeight: '800', fontSize: '0.875rem' }}>Password</label>
                          <Link to="/forgot-password" style={{ fontSize: '0.875rem', fontWeight: '700', color: 'var(--primary)', textDecoration: 'none' }}>Forgot password?</Link>
                      </div>
                      <div style={{ position: 'relative' }}>
                          <Lock size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                          <input
                              type="password"
                              placeholder="••••••••"
                              value={password}
                              onChange={(e) => setPassword(e.target.value)}
                              required
                              style={{
                                  width: '100%',
                                  padding: '1rem 1rem 1rem 3rem',
                                  borderRadius: '12px',
                                  border: '1px solid #eee',
                                  background: '#f9f9f9',
                                  fontSize: '1rem',
                                  outline: 'none',
                                  transition: '0.2s'
                              }}
                              className="focus:border-primary focus:bg-white"
                          />
                      </div>
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
                      {loading ? 'Logging in...' : 'Login'}
                      <ArrowRight size={20} />
                  </button>
              </form>

              <div style={{ marginTop: '2.5rem', textAlign: 'center' }}>
                  <p style={{ color: '#666', fontWeight: '600' }}>
                      Don't have an account? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '800', textDecoration: 'none' }}>Create Account</Link>
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

export default Login;
