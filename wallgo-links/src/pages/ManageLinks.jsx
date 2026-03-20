import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import { Copy, Calendar, ExternalLink, Eye, EyeOff, Trash2, Edit2, Check, X, Search, Globe, MoreVertical, List as ListIcon, Clock, ChevronRight, Activity, ArrowRight, Zap, Sparkles } from 'lucide-react';
import api from '../utils/api';

const LinkCard = ({ link, onUpdate, onDelete }) => {
  const [editing, setEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(link.title || '');
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const shortUrl = `${window.location.origin}/st/${link.alias}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveTitle = async () => {
    try {
      await api.put(`/links/${link._id}`, { title: editTitle });
      onUpdate();
      setEditing(false);
    } catch {}
  };

  const handleHideToggle = async () => {
    setLoading(true);
    try {
      await api.put(`/links/${link._id}/hide`);
      onUpdate();
    } finally { setLoading(false); }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this link?')) return;
    setLoading(true);
    try {
      await api.delete(`/links/${link._id}`);
      onDelete(link._id);
    } finally { setLoading(false); }
  };

  return (
    <div style={{ 
      padding: '1.5rem', 
      background: 'white', 
      borderRadius: '16px', 
      border: '1px solid #eee', 
      marginBottom: '1rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      transition: '0.3s'
    }} className="link-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
            {editing ? (
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flex: 1 }}>
                <input value={editTitle} onChange={e => setEditTitle(e.target.value)}
                  style={{ flex: 1, padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--primary)', outline: 'none' }} autoFocus />
                <button onClick={handleSaveTitle} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.625rem', borderRadius: '8px' }}><Check size={18} /></button>
                <button onClick={() => setEditing(false)} style={{ background: '#f9f9f9', color: '#666', border: 'none', padding: '0.625rem', borderRadius: '8px' }}><X size={18} /></button>
              </div>
            ) : (
              <>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '800', margin: 0 }}>{link.title || 'Untitled Link'}</h4>
                <button onClick={() => setEditing(true)} style={{ background: 'none', border: 'none', color: '#aaa', cursor: 'pointer' }}><Edit2 size={14} /></button>
              </>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.8125rem', color: '#aaa' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14} /> {new Date(link.createdAt).toLocaleDateString()}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Globe size={14} /> {link.originalUrl.substring(0, 30)}...</span>
            <span style={{ padding: '0.25rem 0.5rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800', background: link.status === 'Active' ? '#ecfdf5' : '#f9f9f9', color: link.status === 'Active' ? '#10b981' : '#aaa' }}>{link.status}</span>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '2rem', textAlign: 'right', paddingRight: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '800' }}>{link.clicks.toLocaleString()}</div>
                <div style={{ fontSize: '0.75rem', color: '#aaa', fontWeight: '700' }}>VIEWS</div>
            </div>
            <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#10b981' }}>${(link.earnings || 0).toFixed(4)}</div>
                <div style={{ fontSize: '0.75rem', color: '#aaa', fontWeight: '700' }}>EARNINGS</div>
            </div>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleHideToggle} disabled={loading} style={{ background: 'white', border: '1px solid #eee', padding: '0.625rem', borderRadius: '10px', color: '#666', cursor: 'pointer' }}>
                {link.status === 'Active' ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <button onClick={handleDelete} disabled={loading} style={{ background: '#fef2f2', border: '1px solid #fee2e2', padding: '0.625rem', borderRadius: '10px', color: '#ef4444', cursor: 'pointer' }}>
                <Trash2 size={18} />
            </button>
        </div>
      </div>

      <div style={{ background: '#f8f9ff', padding: '1rem', borderRadius: '12px', border: '1px solid #eef2ff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ color: 'var(--primary)', fontWeight: '800', fontSize: '1rem' }}>{window.location.hostname.replace('www.', '')}/st/{link.alias}</div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={handleCopy} style={{ background: copied ? '#10b981' : 'white', color: copied ? 'white' : 'var(--primary)', border: '1px solid ' + (copied ? '#10b981' : '#eef2ff'), padding: '0.5rem 1rem', borderRadius: '8px', fontSize: '0.8125rem', fontWeight: '800', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {copied ? <Check size={14} /> : <Copy size={14} />} {copied ? 'Copied' : 'Copy'}
            </button>
            <a href={shortUrl} target="_blank" rel="noreferrer" style={{ background: 'white', color: '#666', border: '1px solid #eef2ff', padding: '0.5rem', borderRadius: '8px', display: 'flex', alignItems: 'center' }}>
                <ExternalLink size={16} />
            </a>
        </div>
      </div>
    </div>
  );
};

const ManageLinks = ({ hideOnly = false }) => {
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchLinks = async (pg = 1, q = search) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: pg, limit: 10 });
      if (q) params.append('search', q);
      if (hideOnly) params.append('status', 'Hidden');
      const res = await api.get(`/links/user?${params}`);
      const data = res.data;
      if (data.links) {
        setLinks(data.links);
        setTotalPages(data.pages || 1);
      } else {
        setLinks(data);
      }
    } catch (err) { console.error('Fetch error', err); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchLinks(1, ''); }, [hideOnly]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchLinks(1, search);
  };

  const handleReset = () => {
    setSearch('');
    setPage(1);
    fetchLinks(1, '');
  };

  const handlePageChange = (p) => {
    setPage(p);
    fetchLinks(p, search);
  };

  const handleDelete = (id) => {
    setLinks(prev => prev.filter(l => l._id !== id));
  };

  return (
    <DashboardLayout title={hideOnly ? 'Archives' : 'All Links'}>
      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '16px', border: '1px solid #eee', marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={20} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#aaa' }} />
            <input 
              type="text" 
              placeholder="Search links..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ padding: '0.75rem 1rem 0.75rem 3rem', borderRadius: '10px', border: '1px solid #eee', width: '100%', outline: 'none', background: '#f9f9f9', fontSize: '0.9375rem' }}
            />
          </div>
          <button type="submit" style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0 2rem', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>Search</button>
          <button type="button" onClick={handleReset} style={{ background: 'none', border: '1px solid #eee', color: '#666', padding: '0 1.5rem', borderRadius: '10px', fontWeight: '700', cursor: 'pointer' }}>Reset</button>
        </form>
      </div>

      <div style={{ minHeight: '400px' }}>
        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '5rem' }}>
             <Activity size={40} className="spin" style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
             <p style={{ color: '#aaa', fontWeight: '700' }}>Fetching links...</p>
          </div>
        ) : links.length === 0 ? (
          <div style={{ background: 'white', padding: '5rem', borderRadius: '24px', border: '1px solid #eee', textAlign: 'center' }}>
            <Search size={64} style={{ color: '#eee', marginBottom: '1.5rem' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: '800', marginBottom: '1rem' }}>No Links Found</h3>
            <p style={{ color: '#666', marginBottom: '2rem' }}>We couldn't find any links matching your search or criteria.</p>
            <button onClick={() => window.location.reload()} style={{ background: 'var(--primary)', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '10px', fontWeight: '800', cursor: 'pointer' }}>Reload Links</button>
          </div>
        ) : (
          <div>
            {links.map(link => (
              <LinkCard key={link._id} link={link} onUpdate={() => fetchLinks(page, search)} onDelete={handleDelete} />
            ))}
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', marginTop: '3rem' }}>
          <button disabled={page <= 1} onClick={() => handlePageChange(page - 1)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #eee', background: 'white', opacity: page <= 1 ? 0.5 : 1 }}>Prev</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button key={p} onClick={() => handlePageChange(p)} style={{ 
                width: '40px', height: '40px', borderRadius: '8px', border: '1px solid ' + (p === page ? 'var(--primary)' : '#eee'), 
                background: p === page ? 'var(--primary)' : 'white', 
                color: p === page ? 'white' : '#666',
                fontWeight: '800'
            }}>{p}</button>
          ))}
          <button disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #eee', background: 'white', opacity: page >= totalPages ? 0.5 : 1 }}>Next</button>
        </div>
      )}
      <style>{`.spin { animation: spin 1s linear infinite; } @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </DashboardLayout>
  );
};

export default ManageLinks;
