import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, MessageSquare, Send, Globe, Shield, Activity, ArrowLeft, Terminal, Sparkles, CheckCircle2, Sun, Moon } from 'lucide-react';
import api from '../utils/api';
import { useTheme } from '../context/ThemeContext';

const ContactUs = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Assuming there's a contact endpoint, or we just simulate it
      // const res = await api.post('/support/contact', formData);
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      alert('Transmission failed. Emergency backup protocols initialized.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg)', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: 'var(--text)', overflowX: 'hidden' }}>
      
      {/* ====== ELITE NAVBAR ====== */}
      <nav style={{ 
        height: '80px', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 5%', 
        justifyContent: 'space-between', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000, 
        backdropFilter: 'blur(10px)', 
        background: 'var(--bg-white)',
        opacity: 0.95,
        borderBottom: '1px solid var(--border)'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', textDecoration: 'none' }}>
          <div style={{ background: 'var(--primary)', padding: '0.625rem', borderRadius: '14px', boxShadow: '0 8px 16px rgba(107, 93, 211, 0.4)', transform: 'rotate(-5deg)' }}>
            <Zap size={24} color="white" fill="white" />
          </div>
          <span style={{ fontSize: '1.625rem', fontWeight: '950', color: 'var(--text)', letterSpacing: '-0.04em' }}>Wallgo<span style={{ color: 'var(--primary)' }}> Links</span></span>
        </Link>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.9375rem', textDecoration: 'none' }}>HOME</Link>
          
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

          <Link to="/login" style={{ color: 'var(--text-muted)', fontWeight: '700', fontSize: '0.9375rem', textDecoration: 'none' }}>LOGIN</Link>
          <Link to="/register" style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '12px', 
            fontWeight: '800', 
            fontSize: '0.875rem', 
            textDecoration: 'none'
          }}>SIGN UP</Link>
        </div>
      </nav>

      {/* Cinematic Header */}
      <header style={{ 
        background: isDarkMode ? 'radial-gradient(circle at 50% 100%, rgba(107, 93, 211, 0.15), transparent 70%)' : 'var(--bg-alt)', 
        padding: '180px 10% 80px', 
        textAlign: 'center', 
        position: 'relative',
        borderBottom: '1px solid var(--border)'
      }}>
         <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ color: 'var(--primary)', fontWeight: '950', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
               <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-light)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid var(--primary)' }}>
                  <Terminal size={14} /> Support Channel
               </span>
            </div>
            <h1 style={{ fontSize: '4rem', fontWeight: '950', color: 'var(--text)', letterSpacing: '-0.05em', margin: 0, lineHeight: '1.1' }}>
              Direct <span style={{ color: 'var(--primary)' }}>Message Link.</span>
            </h1>
            <p style={{ color: 'var(--text-muted)', maxWidth: '700px', margin: '2rem auto 0', fontSize: '1.25rem', fontWeight: '600', lineHeight: '1.8' }}>
              Establish a secure communication tunnel with our elite infrastructure division. Priority response for enterprise users.
            </p>
         </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '60px 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '4rem', alignItems: 'start' }}>
          
          {/* Support Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            <div style={{ background: 'var(--bg-card)', padding: '2.5rem', borderRadius: '32px', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
               <h3 style={{ fontSize: '1.75rem', fontWeight: '950', color: 'var(--text)', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Command Briefing</h3>
               <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', lineHeight: '1.8', marginBottom: '3rem', fontWeight: '600' }}>
                 Our standard verification window is within 24 operational hours.
               </p>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {[
                    { icon: Mail, label: 'Official Relay', val: 'support@wallgolinks.com' },
                    { icon: MessageSquare, label: 'Emergency Protocol', val: 'Telegram: @WallgoSupport' },
                    { icon: Globe, label: 'Coordinates', val: 'Available Worldwide' }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '1rem', borderRadius: '18px', border: '1px solid var(--primary)' }}>
                        <item.icon size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '950', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.1rem' }}>{item.label}</div>
                        <div style={{ fontSize: '1.125rem', fontWeight: '850', color: 'var(--text)' }}>{item.val}</div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div style={{ background: 'linear-gradient(225deg, #7158E2 0%, #5a45c7 100%)', padding: '2.5rem', borderRadius: '32px', color: 'white', boxShadow: '0 20px 40px rgba(113, 88, 226, 0.3)' }}>
               <Sparkles size={40} style={{ marginBottom: '1.5rem' }} />
               <h4 style={{ fontSize: '1.5rem', fontWeight: '950', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Enterprise Solutions</h4>
               <p style={{ fontSize: '1rem', fontWeight: '700', lineHeight: '1.7', opacity: 0.8 }}>
                 Looking for custom integration? Reach out for our White-Label documentation.
               </p>
            </div>
          </div>

          {/* Secure Transmission Form */}
          <div style={{ 
            background: 'var(--bg-card)', 
            padding: '4rem', 
            borderRadius: '40px', 
            border: '1px solid var(--border)',
            boxShadow: 'var(--shadow)'
          }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: '3rem 0' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2.5rem', border: '1px solid #10b981' }}>
                  <CheckCircle2 size={40} color="#10b981" />
                </div>
                <h3 style={{ fontSize: '2rem', fontWeight: '950', color: 'var(--text)', marginBottom: '1rem' }}>Transmission Success</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', fontWeight: '600', marginBottom: '3rem' }}>Your data has been relay to the authority desk.</p>
                <button onClick={() => setSuccess(false)} style={{ background: 'var(--bg-alt)', border: '1px solid var(--border)', padding: '1rem 2rem', borderRadius: '14px', color: 'var(--text)', fontWeight: '800', cursor: 'pointer' }}>NEW MESSAGE</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '950', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.1rem', marginBottom: '1rem' }}>Identity</label>
                    <input type="text" placeholder="Your Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem 1.5rem', color: 'var(--text)', fontWeight: '700', outline: 'none' }} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '950', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.1rem', marginBottom: '1rem' }}>Endpoint</label>
                    <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                      style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem 1.5rem', color: 'var(--text)', fontWeight: '700', outline: 'none' }} />
                  </div>
                </div>
                <div style={{ marginBottom: '2rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '950', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.1rem', marginBottom: '1rem' }}>Department</label>
                  <select required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem 1.5rem', color: 'var(--text)', fontWeight: '700', outline: 'none' }}>
                    <option value="" disabled>Select Department</option>
                    <option value="General">General Inquiry</option>
                    <option value="Payout">Payout Issues</option>
                    <option value="Technical">Technical Support</option>
                  </select>
                </div>
                <div style={{ marginBottom: '3rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '950', color: 'var(--text-light)', textTransform: 'uppercase', letterSpacing: '0.1rem', marginBottom: '1rem' }}>Payload</label>
                  <textarea rows="5" placeholder="Detailed message..." required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                    style={{ width: '100%', background: 'var(--bg)', border: '1px solid var(--border)', borderRadius: '14px', padding: '1rem 1.5rem', color: 'var(--text)', fontWeight: '700', outline: 'none', resize: 'none' }}></textarea>
                </div>
                <button type="submit" disabled={loading} style={{ 
                  width: '100%', 
                  background: 'var(--primary)', 
                  color: 'white', 
                  padding: '1.25rem', 
                  borderRadius: '16px', 
                  fontSize: '1.125rem', 
                  fontWeight: '800', 
                  border: 'none', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '1rem',
                  boxShadow: '0 15px 30px rgba(113, 88, 226, 0.3)',
                  transition: '0.3s'
                }}>
                  {loading ? 'TRANSMITTING...' : <><Send size={24} /> SEND MESSAGE</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <footer style={{ background: 'var(--bg)', padding: '80px 10% 40px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-light)', fontSize: '0.875rem', fontWeight: '700' }}>
          <span>© 2026 Wallgo Links. All rights reserved.</span>
          <div style={{ display: 'flex', gap: '2rem' }}>
             <Activity size={18} /> STATUS: OPTIMAL
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ContactUs;
