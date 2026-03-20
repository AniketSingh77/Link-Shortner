import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Zap, Globe, ArrowRight, Search, DollarSign, Wallet, Shield, Activity, Star, BarChart3, TrendingUp, Sparkles, ChevronRight } from 'lucide-react';
import api from '../utils/api';

const PayoutRates = () => {
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await api.get('/pages/payout-rates-data');
        setRates(res.data);
      } catch (e) {
        setRates([
          { countryName: 'United States', countryCode: 'US', rate: 12.0 },
          { countryName: 'United Kingdom', countryCode: 'GB', rate: 10.0 },
          { countryName: 'Canada', countryCode: 'CA', rate: 9.0 },
          { countryName: 'Australia', countryCode: 'AU', rate: 8.0 },
          { countryName: 'Global (Default)', countryCode: 'GLOBAL', rate: 5.0 },
          { countryName: 'India', countryCode: 'IN', rate: 3.5 },
        ]);
      } finally { setLoading(false); }
    };
    fetchRates();
  }, []);

  const filteredRates = rates.filter(r => 
    r.countryName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.countryCode.toLowerCase().includes(searchTerm.toLowerCase())
  ).sort((a, b) => b.rate - a.rate);

  return (
    <div style={{ background: '#ffffff', minHeight: '100vh', fontFamily: "'Gordita', 'Inter', sans-serif", color: '#1a1a1a' }}>
      
      {/* NAVBAR */}
      <nav style={{ 
        height: '80px', display: 'flex', alignItems: 'center', padding: '0 8%', justifyContent: 'space-between', 
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000, background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <Zap size={32} color="var(--primary)" fill="var(--primary)" />
          <span style={{ fontSize: '1.5rem', fontWeight: '900', color: '#1a1a1a', letterSpacing: '-0.5px' }}>Wallgo<span style={{ color: 'var(--primary)' }}>Links</span></span>
        </Link>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#666', fontWeight: '700', fontSize: '0.9375rem', textDecoration: 'none' }}>Home</Link>
          <Link to="/payout-rates" style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '0.9375rem', textDecoration: 'none' }}>Payout Rates</Link>
          <Link to="/login" style={{ color: '#1a1a1a', fontWeight: '700', fontSize: '0.9375rem', textDecoration: 'none' }}>Login</Link>
          <Link to="/register" style={{ 
            background: 'var(--primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: '12px', 
            fontWeight: '800', fontSize: '0.9375rem', textDecoration: 'none', boxShadow: '0 8px 24px rgba(113, 88, 226, 0.25)'
          }}>Sign Up</Link>
        </div>
      </nav>

      {/* Hero */}
      <header style={{ padding: '160px 8% 100px', background: '#f8f9ff', textAlign: 'center' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', background: '#e1e1fc', borderRadius: '100px', color: 'var(--primary)', fontSize: '0.8125rem', fontWeight: '800', marginBottom: '2rem' }}>
              <Star size={14} fill="var(--primary)" /> Trusted by 50,000+ Publishers
            </div>
            <h1 style={{ fontSize: '4.5rem', fontWeight: '900', color: '#1a1a1a', lineHeight: '1.1', marginBottom: '1.5rem', letterSpacing: '-2px' }}>High Payout <span style={{ color: 'var(--primary)' }}>Rates.</span></h1>
            <p style={{ color: '#666', fontSize: '1.25rem', fontWeight: '600', lineHeight: '1.6', marginBottom: '3rem' }}>
              We offer the best CPM in the industry. Check our real-time rates for all countries.
            </p>
        </div>
      </header>

      {/* Search & Table */}
      <main style={{ maxWidth: '1000px', margin: '-50px auto 100px', padding: '0 2rem' }}>
         <div style={{ background: 'white', borderRadius: '24px', boxShadow: '0 30px 60px rgba(0,0,0,0.05)', padding: '3rem', border: '1px solid #f0f0f0', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                <h3 style={{ fontSize: '1.5rem', fontWeight: '900' }}>CPM Rates</h3>
                <div style={{ position: 'relative', width: '300px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
                    <input 
                      type="text" 
                      placeholder="Search country..." 
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{ width: '100%', background: '#f9f9f9', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', border: '1px solid #eee', fontSize: '0.9375rem', outline: 'none' }} 
                    />
                </div>
            </div>

            <div style={{ borderRadius: '16px', border: '1px solid #eee', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: '#f9f9f9', borderBottom: '1px solid #eee' }}>
                    <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#aaa', textTransform: 'uppercase' }}>Country</th>
                    <th style={{ padding: '1.25rem 2rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#aaa', textTransform: 'uppercase' }}>CP Type</th>
                    <th style={{ padding: '1.25rem 2rem', textAlign: 'right', fontSize: '0.75rem', fontWeight: '800', color: '#aaa', textTransform: 'uppercase' }}>Rate / 1000 Views</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRates.length > 0 ? filteredRates.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '1.25rem 2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#f0effc', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Globe size={18} />
                          </div>
                          <span style={{ fontWeight: '800', fontSize: '1rem' }}>{r.countryName}</span>
                        </div>
                      </td>
                      <td style={{ padding: '1.25rem 2rem' }}>
                        <span style={{ fontSize: '0.8125rem', fontWeight: '800', color: '#666', background: '#f0f0f0', padding: '0.25rem 0.6rem', borderRadius: '6px' }}>Desktop + Mobile</span>
                      </td>
                      <td style={{ padding: '1.25rem 2rem', textAlign: 'right' }}>
                        <div style={{ color: '#10b981', fontWeight: '900', fontSize: '1.25rem' }}>${r.rate.toFixed(2)}</div>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: '5rem', color: '#aaa' }}>No rates found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                <div style={{ padding: '2rem', borderRadius: '20px', background: '#f0effc', border: '1px solid #e1e1fc' }}>
                    <h5 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '1rem', color: 'var(--primary)' }}>Payment Methods</h5>
                    <p style={{ fontSize: '0.875rem', color: '#666', lineHeight: '1.5' }}>Withdraw your earnings through UPI, PayPal, Bank Transfer and more. Fast processing and reliable payouts.</p>
                </div>
                <div style={{ padding: '2rem', borderRadius: '20px', background: '#ecfdf5', border: '1px solid #d1fae5' }}>
                    <h5 style={{ fontSize: '1.125rem', fontWeight: '800', marginBottom: '1rem', color: '#10b981' }}>Minimum Payout</h5>
                    <p style={{ fontSize: '0.875rem', color: '#047857', lineHeight: '1.5' }}>Low $5.00 threshold for most payment methods! Get paid as soon as you reach the limit.</p>
                </div>
            </div>
         </div>
      </main>

      <footer style={{ padding: '5rem 8% 4rem', background: '#1a1a1a', color: 'white' }}>
         <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #333', paddingBottom: '3rem', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
               <Zap size={24} color="var(--primary)" fill="var(--primary)" />
               <h2 style={{ fontSize: '1.25rem', fontWeight: '900', letterSpacing: '-0.5px' }}>WallgoLinks</h2>
            </div>
            <div style={{ display: 'flex', gap: '3rem' }}>
               <Link to="/pages/terms" style={{ color: '#aaa', fontSize: '0.875rem', fontWeight: '700', textDecoration: 'none' }}>Terms</Link>
               <Link to="/pages/privacy" style={{ color: '#aaa', fontSize: '0.875rem', fontWeight: '700', textDecoration: 'none' }}>Privacy</Link>
               <Link to="/pages/contact-us" style={{ color: '#aaa', fontSize: '0.875rem', fontWeight: '700', textDecoration: 'none' }}>Support</Link>
            </div>
         </div>
         <p style={{ textAlign: 'center', color: '#666', fontSize: '0.875rem', fontWeight: '600' }}>&copy; {new Date().getFullYear()} Wallgo Links Network. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default PayoutRates;
