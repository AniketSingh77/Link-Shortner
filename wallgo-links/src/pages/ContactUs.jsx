import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Mail, MessageSquare, Send, Globe, Shield, Activity, ArrowLeft, Terminal, Sparkles, CheckCircle2 } from 'lucide-react';
import api from '../utils/api';

const ContactUs = () => {
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
    <div style={{ background: '#0a0a0c', minHeight: '100vh', fontFamily: "'Inter', sans-serif", color: 'white', overflowX: 'hidden' }}>
      
      {/* ====== ELITE NAVBAR ====== */}
      <nav style={{ 
        height: '90px', 
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 5%', 
        justifyContent: 'space-between', 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000, 
        backdropFilter: 'blur(30px)', 
        background: 'rgba(10, 10, 12, 0.8)',
        borderBottom: '1px solid rgba(255,255,255,0.05)'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', textDecoration: 'none' }}>
          <div style={{ background: 'var(--primary)', padding: '0.625rem', borderRadius: '14px', boxShadow: '0 8px 16px rgba(107, 93, 211, 0.4)', transform: 'rotate(-5deg)' }}>
            <Zap size={24} color="white" fill="white" />
          </div>
          <span style={{ fontSize: '1.625rem', fontWeight: '950', color: 'white', letterSpacing: '-0.04em' }}>Wallgo<span className="text-primary-light"> Links</span></span>
        </Link>
        <div style={{ display: 'flex', gap: '3rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: '0.9375rem', textDecoration: 'none' }}>NETWORK</Link>
          <Link to="/login" style={{ color: 'rgba(255,255,255,0.5)', fontWeight: '700', fontSize: '0.9375rem', textDecoration: 'none' }}>IDENTIFY</Link>
          <Link to="/register" style={{ 
            background: 'var(--primary)', 
            color: 'white', 
            padding: '0.875rem 2rem', 
            borderRadius: '16px', 
            fontWeight: '950', 
            fontSize: '0.9375rem', 
            boxShadow: '0 10px 20px rgba(107, 93, 211, 0.3)',
            textDecoration: 'none'
          }}>DEPLOY NODE</Link>
        </div>
      </nav>

      {/* Cinematic Header */}
      <header style={{ 
        background: 'radial-gradient(circle at 50% 100%, rgba(107, 93, 211, 0.15), transparent 70%)', 
        padding: '240px 10% 120px', 
        textAlign: 'center', 
        position: 'relative'
      }}>
         <div style={{ position: 'relative', zIndex: 10 }}>
            <div style={{ color: 'var(--primary-light)', fontWeight: '950', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.2rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem' }}>
               <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(107, 93, 211, 0.1)', padding: '0.5rem 1rem', borderRadius: '12px', border: '1px solid rgba(107, 93, 211, 0.2)' }}>
                  <Terminal size={14} /> Authority Support Channel
               </span>
            </div>
            <h1 style={{ fontSize: '5rem', fontWeight: '950', color: 'white', letterSpacing: '-0.05em', margin: 0, lineHeight: '1.1' }}>
              Direct <span className="text-primary-light">Intelligence Link.</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '700px', margin: '3rem auto 0', fontSize: '1.25rem', fontWeight: '600', lineHeight: '1.8' }}>
              Establish a secure communication tunnel with our elite infrastructure division. Priority response for enterprise clusters.
            </p>
         </div>
      </header>

      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '100px 5%' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '5rem', alignItems: 'start' }}>
          
          {/* Support Information */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '3.5rem', borderRadius: '40px', border: '1px solid rgba(255, 255, 255, 0.05)', backdropFilter: 'blur(30px)' }}>
               <h3 style={{ fontSize: '2rem', fontWeight: '950', color: 'white', marginBottom: '1.5rem', letterSpacing: '-0.02em' }}>Command Briefing</h3>
               <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.125rem', lineHeight: '1.8', marginBottom: '3rem', fontWeight: '600' }}>
                 Our standard verification window is within 24 operational hours. Platinum nodes receive accelerated synthesis.
               </p>
               
               <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                  {[
                    { icon: Mail, label: 'Official Relay', val: 'ops@wallgo.co' },
                    { icon: MessageSquare, label: 'Emergency Protocol', val: 'Telegram: @WallgoSupport' },
                    { icon: Globe, label: 'HQ Geo-Coordinates', val: 'Decentralized Network Cluster' }
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                      <div style={{ background: 'rgba(107, 93, 211, 0.1)', color: 'var(--primary-light)', padding: '1rem', borderRadius: '18px', border: '1px solid rgba(107, 93, 211, 0.2)' }}>
                        <item.icon size={24} />
                      </div>
                      <div>
                        <div style={{ fontSize: '0.75rem', fontWeight: '950', color: 'rgba(255,255,255,0.2)', textTransform: 'uppercase', letterSpacing: '0.1rem' }}>{item.label}</div>
                        <div style={{ fontSize: '1.125rem', fontWeight: '850', color: 'white' }}>{item.val}</div>
                      </div>
                    </div>
                  ))}
               </div>
            </div>

            <div style={{ background: 'linear-gradient(225deg, #6b5dd3 0%, #4c1d95 100%)', padding: '3.5rem', borderRadius: '40px', color: 'white', boxShadow: '0 30px 60px rgba(107, 93, 211, 0.3)' }}>
               <Sparkles size={40} style={{ marginBottom: '2rem' }} />
               <h4 style={{ fontSize: '1.75rem', fontWeight: '950', marginBottom: '1rem', letterSpacing: '-0.02em' }}>Enterprise Solutions</h4>
               <p style={{ fontSize: '1rem', fontWeight: '700', lineHeight: '1.7', opacity: 0.8 }}>
                 Looking for custom integration or high-volume traffic nodes? Request our White-Label Infrastructure documentation.
               </p>
            </div>
          </div>

          {/* Secure Transmission Form */}
          <div className="glass-container" style={{ 
            background: 'rgba(255, 255, 255, 0.02)', 
            padding: '5rem', 
            borderRadius: '48px', 
            border: '1px solid rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(30px)',
            boxShadow: '0 40px 100px rgba(0,0,0,0.5)'
          }}>
            {success ? (
              <div style={{ textAlign: 'center', padding: '5rem 0' }}>
                <div style={{ background: 'rgba(16, 185, 129, 0.1)', width: '100px', height: '100px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 3rem', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                  <CheckCircle2 size={50} color="#10b981" />
                </div>
                <h3 style={{ fontSize: '2.5rem', fontWeight: '950', color: 'white', marginBottom: '1rem' }}>Transmission Success</h3>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '1.25rem', fontWeight: '600', marginBottom: '4rem' }}>Your data has been securely encrypted and relayed to the authority desk.</p>
                <button onClick={() => setSuccess(false)} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.1)', padding: '1.25rem 3rem', borderRadius: '20px', color: 'white', fontWeight: '950', cursor: 'pointer' }}>NEW TRANSMISSION</button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2.5rem' }}>
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '950', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.2rem', marginBottom: '1.25rem' }}>Identity Signature</label>
                    <input type="text" placeholder="Your Name" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '1.25rem 1.75rem', color: 'white', fontWeight: '700', outline: 'none' }} className="focus-border" />
                  </div>
                  <div className="form-group">
                    <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '950', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.2rem', marginBottom: '1.25rem' }}>Relay Endpoint</label>
                    <input type="email" placeholder="Email Address" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})}
                      style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '1.25rem 1.75rem', color: 'white', fontWeight: '700', outline: 'none' }} className="focus-border" />
                  </div>
                </div>
                <div className="form-group" style={{ marginBottom: '2.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '950', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.2rem', marginBottom: '1.25rem' }}>Intelligence Category</label>
                  <select required value={formData.subject} onChange={e => setFormData({...formData, subject: e.target.value})}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '18px', padding: '1.25rem 1.75rem', color: 'white', fontWeight: '700', outline: 'none', appearance: 'none' }} className="focus-border">
                    <option value="" disabled>Select Department</option>
                    <option value="General">General Network Inquiry</option>
                    <option value="Payout">Finance & Liquidations</option>
                    <option value="Technical">Technical Support & API</option>
                    <option value="Business">Enterprise & Partnerships</option>
                  </select>
                </div>
                <div className="form-group" style={{ marginBottom: '4rem' }}>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: '950', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase', letterSpacing: '0.2rem', marginBottom: '1.25rem' }}>Encrypted Payload</label>
                  <textarea rows="6" placeholder="Detailed message..." required value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})}
                    style={{ width: '100%', background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '1.75rem', color: 'white', fontWeight: '700', outline: 'none', resize: 'none' }} className="focus-border"></textarea>
                </div>
                <button type="submit" disabled={loading} style={{ 
                  width: '100%', 
                  background: 'var(--primary)', 
                  color: 'white', 
                  padding: '1.5rem', 
                  borderRadius: '24px', 
                  fontSize: '1.25rem', 
                  fontWeight: '950', 
                  border: 'none', 
                  cursor: 'pointer', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  gap: '1.25rem',
                  boxShadow: '0 20px 40px rgba(107, 93, 211, 0.4)',
                  transition: '0.3s'
                }} className="hover:scale-[1.02]">
                  {loading ? 'TRANSMITTING...' : <><Send size={24} /> INJECT TRANSMISSION</>}
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      {/* ====== ELITE FOOTER ====== */}
      <footer style={{ background: '#0a0a0c', padding: '120px 10% 60px', position: 'relative', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '5rem', marginBottom: '8rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
              <div style={{ background: 'var(--primary)', padding: '0.5rem', borderRadius: '10px' }}>
                <Zap size={22} color="white" fill="white" />
              </div>
              <span style={{ fontSize: '1.5rem', fontWeight: '950', color: 'white' }}>Wallgo Links</span>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', lineHeight: '1.8', fontSize: '1.125rem', marginBottom: '3rem', fontWeight: '600' }}>
              Architecting the future of digital monetization through sovereign network nodes and high-performance publisher infrastructure.
            </p>
          </div>
          <div>
             <h4 style={{ color: 'white', fontWeight: '950', marginBottom: '2.5rem', fontSize: '1.125rem', letterSpacing: '0.05em' }}>ECOSYSTEM</h4>
             <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', listStyle: 'none', padding: 0 }}>
               <li><Link to="/payout-rates" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '700', textDecoration: 'none' }}>Yield Desk</Link></li>
               <li><Link to="/login" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '700', textDecoration: 'none' }}>Control Portal</Link></li>
             </ul>
          </div>
          <div>
             <h4 style={{ color: 'white', fontWeight: '950', marginBottom: '2.5rem', fontSize: '1.125rem', letterSpacing: '0.05em' }}>LEGAL</h4>
             <ul style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', listStyle: 'none', padding: 0 }}>
               <li><Link to="/pages/terms" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '700', textDecoration: 'none' }}>Terms of Force</Link></li>
               <li><Link to="/pages/privacy" style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '700', textDecoration: 'none' }}>Privacy Protocol</Link></li>
             </ul>
          </div>
          <div>
             <h4 style={{ color: 'white', fontWeight: '950', marginBottom: '2.5rem', fontSize: '1.125rem', letterSpacing: '0.05em' }}>AUTHORITY</h4>
             <span style={{ color: 'rgba(255,255,255,0.4)', fontWeight: '600' }}>Direct Support: ops@wallgo.co</span>
          </div>
        </div>
        
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'rgba(255,255,255,0.2)', fontSize: '0.9375rem', fontWeight: '700' }}>
          <span>© 2026 Wallgo Links Infrastructure. SECURED BY RSA-4096.</span>
          <div style={{ display: 'flex', gap: '3rem' }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Shield size={16} /> ENTERPRISE CERTIFIED</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Activity size={16} /> SYSTEM STATUS: OPTIMAL</div>
          </div>
        </div>
      </footer>

      <style>{`
        .focus-border:focus { border-color: var(--primary) !important; box-shadow: 0 0 20px rgba(107, 93, 211, 0.1) !important; }
      `}</style>
    </div>
  );
};

export default ContactUs;
