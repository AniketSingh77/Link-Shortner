import React, { useState, useEffect } from 'react';
import DashboardLayout from '../components/common/DashboardLayout';
import { Zap, Copy, Code, FileText, Plus, Minus, ExternalLink, ShieldCheck, Terminal, Cpu, Layers, MousePointer2, CheckCircle2, Brackets, Globe, Box, Workflow, Fingerprint, Sparkles, Sun, Activity, ShieldAlert } from 'lucide-react';
import api from '../utils/api';

// ========================================
// QUICK SHORTENER
// ========================================
export const QuickLink = () => {
  const [url, setUrl] = useState('');
  const [alias, setAlias] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleShorten = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/links/shorten', { originalUrl: url, alias: alias || undefined });
      setResult(`${window.location.origin}/st/${res.data.alias}`);
    } catch (err) { console.error('Shorten error', err); }
    finally { setLoading(false); }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout title="Quick Link">
      <div style={{ maxWidth: '800px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: '24px', border: '1px solid #eee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '3rem' }}>
           <div style={{ background: '#f0effc', color: 'var(--primary)', padding: '0.75rem', borderRadius: '12px' }}><Zap size={32} /></div>
           <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Quick Shortener</h3>
              <p style={{ color: '#666', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>Anonymously shorten your links in one click.</p>
           </div>
        </div>

        <form onSubmit={handleShorten}>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ fontWeight: '700', fontSize: '0.875rem', display: 'block', marginBottom: '0.75rem' }}>Long URL</label>
            <input type="url" placeholder="https://example.com/very-long-url-here..."
              value={url} onChange={e => setUrl(e.target.value)} required 
              style={{ padding: '1rem 1.25rem', borderRadius: '12px', background: '#f9f9f9', border: '1px solid #eee', color: '#1a1a1a', width: '100%', fontSize: '1rem' }} />
          </div>
          <div style={{ marginBottom: '2.5rem' }}>
            <label style={{ fontWeight: '700', fontSize: '0.875rem', display: 'block', marginBottom: '0.75rem' }}>Custom Alias (Optional)</label>
            <div style={{ display: 'flex', alignItems: 'center', background: '#f9f9f9', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
              <span style={{ padding: '0 1.25rem', fontSize: '0.9375rem', fontWeight: '700', color: '#aaa', background: '#f0f0f0', height: '50px', display: 'flex', alignItems: 'center' }}>{window.location.hostname}/st/</span>
              <input type="text" placeholder="custom-alias" value={alias} onChange={e => setAlias(e.target.value)} 
                style={{ border: 'none', background: 'transparent', flex: 1, height: '50px', fontWeight: '700', color: '#1a1a1a', padding: '0 1.25rem', fontSize: '1rem' }} />
            </div>
          </div>
          <button type="submit" disabled={loading} style={{ 
            width: '100%', 
            padding: '1.25rem', 
            borderRadius: '12px', 
            fontWeight: '800', 
            fontSize: '1.125rem', 
            background: 'var(--primary)',
            color: 'white',
            border: 'none',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: '0.75rem', 
            cursor: 'pointer'
          }}>
            {loading ? 'Shortening...' : 'Get Link'}
          </button>
        </form>

        {result && (
          <div style={{ marginTop: '3rem', background: '#f0effc', border: '2px dashed var(--primary)', borderRadius: '16px', padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', fontWeight: '800', color: 'var(--primary)', marginBottom: '1.5rem', wordBreak: 'break-all' }}>{result}</div>
            <button onClick={handleCopy} style={{ 
                background: copied ? '#10b981' : 'var(--primary)', 
                color: 'white', 
                border: 'none', 
                padding: '0.75rem 2rem', 
                borderRadius: '8px', 
                fontWeight: '700', 
                cursor: 'pointer'
            }}>
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

// ========================================
// BULK SHORTENER
// ========================================
export const BulkShortener = () => {
  const [urls, setUrls] = useState(['']);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addRow = () => setUrls(prev => [...prev, '']);
  const removeRow = (i) => setUrls(prev => prev.filter((_, idx) => idx !== i));
  const updateRow = (i, val) => setUrls(prev => { const n = [...prev]; n[i] = val; return n; });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const valid = urls.filter(u => u.trim());
    if (!valid.length) return;
    setLoading(true);
    try {
      const res = await api.post('/links/bulk', { urls: valid.map(u => ({ url: u })) });
      setResults(res.data);
    } catch (err) { console.error('Bulk error', err); }
    finally { setLoading(false); }
  };

  const copyAll = () => {
    const text = results.map(r => r.shortUrl ? `${window.location.origin}/st/${r.alias || r.shortUrl.split('/').pop()}` : `Error: ${r.error}`).join('\n');
    navigator.clipboard.writeText(text);
  };

  return (
    <DashboardLayout title="Bulk Shortener">
      <div style={{ maxWidth: '900px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: '24px', border: '1px solid #eee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '3rem' }}>
           <div style={{ background: '#ecfdf5', color: '#10b981', padding: '0.75rem', borderRadius: '12px' }}><Layers size={32} /></div>
           <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Bulk Tool</h3>
              <p style={{ color: '#666', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>Shorten up to 20 links at once. One URL per line.</p>
           </div>
        </div>

        <form onSubmit={handleSubmit}>
          {urls.map((u, i) => (
            <div key={i} style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
              <input type="url" placeholder="https://example.com/link..."
                value={u} onChange={e => updateRow(i, e.target.value)}
                style={{ flex: 1, padding: '0.75rem 1.25rem', borderRadius: '10px', background: '#f9f9f9', border: '1px solid #eee', fontSize: '0.9375rem' }} />
              {urls.length > 1 && (
                <button type="button" onClick={() => removeRow(i)} style={{ background: '#fff5f5', color: '#ef4444', border: '1px solid #fee2e2', borderRadius: '10px', padding: '0 1rem', cursor: 'pointer' }}>
                  <Minus size={20} />
                </button>
              )}
            </div>
          ))}
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2.5rem' }}>
            <button type="button" onClick={addRow} style={{ padding: '0.875rem 1.75rem', borderRadius: '10px', border: '1px solid #eee', background: 'white', fontWeight: '700', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={18} /> Add Row
            </button>
            <button type="submit" disabled={loading} style={{ flex: 1, padding: '0.875rem', borderRadius: '10px', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: '800', fontSize: '1rem', cursor: 'pointer' }}>
              {loading ? 'Processing...' : 'Shorten All'}
            </button>
          </div>
        </form>

        {results.length > 0 && (
          <div style={{ marginTop: '3rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h4 style={{ fontSize: '1.125rem', fontWeight: '800' }}>Results</h4>
                <button onClick={copyAll} style={{ background: 'white', border: '1px solid #eee', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: '700', fontSize: '0.8125rem', cursor: 'pointer' }}>Copy All</button>
            </div>
            <div style={{ borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead style={{ background: '#f9f9f9' }}>
                  <tr style={{ borderBottom: '1px solid #eee' }}>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#aaa' }}>Source</th>
                    <th style={{ padding: '1rem', textAlign: 'left', fontSize: '0.75rem', fontWeight: '800', color: '#aaa' }}>Short URL</th>
                  </tr>
                </thead>
                <tbody>
                  {results.map((r, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f9f9f9' }}>
                      <td style={{ padding: '1rem', fontSize: '0.875rem', color: '#666', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.url}</td>
                      <td style={{ padding: '1rem' }}>
                        {r.error ? <span style={{ color: '#ef4444', fontSize: '0.875rem' }}>Error</span> : 
                          <a href={`${window.location.origin}/st/${r.alias || r.shortUrl.split('/').pop()}`} target="_blank" rel="noreferrer" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>
                            {window.location.hostname}/st/{r.alias || r.shortUrl.split('/').pop()}
                          </a>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

// ========================================
// FULL PAGE SCRIPT
// ========================================
export const FullPageScript = () => {
  const [profile, setProfile] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    api.get('/user/profile').then(r => setProfile(r.data)).catch(() => {});
  }, []);

  const token = profile?.apiToken || '••••••••••••••••••••••••••••';
  const scriptContent = `<!-- Wallgo Links - Full Page Script -->\n<script>\n  var WL_Config = {\n    apiKey: '${token}',\n    domain: '${window.location.origin}',\n    excludeSelectors: ['.no-monetize']\n  };\n</script>\n<script src="${window.location.origin}/sdk/monetizer.js" async></script>`;

  const copy = () => {
    navigator.clipboard.writeText(scriptContent);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout title="Full Page Script">
      <div style={{ maxWidth: '900px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: '24px', border: '1px solid #eee' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '3rem' }}>
           <div style={{ background: '#fffbeb', color: '#f59e0b', padding: '0.75rem', borderRadius: '12px' }}><Code size={32} /></div>
           <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>Full Page Script</h3>
              <p style={{ color: '#666', fontSize: '0.875rem', margin: '0.25rem 0 0' }}>Monetize every link on your website automatically.</p>
           </div>
        </div>

        <div style={{ background: '#f8f9ff', padding: '2rem', borderRadius: '20px', marginBottom: '2.5rem', border: '1px solid #eef2ff' }}>
            <h5 style={{ fontSize: '1rem', fontWeight: '800', marginBottom: '1rem' }}>How to use:</h5>
            <ol style={{ paddingLeft: '1.25rem', color: '#666', fontSize: '0.9375rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <li>Copy the script code below.</li>
                <li>Paste it into the header (<code>&lt;head&gt;</code>) of your website.</li>
                <li>All outgoing links on your site will now be automatically shortened and monetized!</li>
            </ol>
        </div>

        <div style={{ position: 'relative' }}>
          <pre style={{ 
            background: '#1a1a1a', 
            color: '#10b981', 
            borderRadius: '16px', 
            padding: '2.5rem 1.5rem', 
            fontSize: '0.875rem', 
            overflow: 'auto', 
            lineHeight: '1.6', 
            fontFamily: "monospace"
          }}>
            {scriptContent}
          </pre>
          <button 
            onClick={copy}
            style={{ 
              position: 'absolute', 
              top: '1rem', 
              right: '1rem', 
              borderRadius: '8px', 
              padding: '0.625rem 1rem', 
              fontWeight: '700', 
              background: copied ? '#10b981' : 'var(--primary)', 
              color: 'white',
              border: 'none',
              fontSize: '0.8125rem', 
              cursor: 'pointer'
            }}
          >
            {copied ? 'Copied!' : 'Copy Script'}
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
};

// ========================================
// API DOCUMENTATION
// ========================================
export const ApiDocumentation = () => {
  const [profile, setProfile] = useState(null);
  const [copied, setCopied] = useState('');

  useEffect(() => {
    api.get('/user/profile').then(r => setProfile(r.data)).catch(() => {});
  }, []);

  const token = profile?.apiToken || '••••••••••••••••••••••••••••';

  const copy = (key, text) => {
    navigator.clipboard.writeText(text);
    setCopied(key);
    setTimeout(() => setCopied(''), 2000);
  };

  return (
    <DashboardLayout title="Developer API">
      <div style={{ maxWidth: '1000px', margin: '0 auto', background: 'white', padding: '3rem', borderRadius: '24px', border: '1px solid #eee' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                <div style={{ background: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '12px' }}><Terminal size={32} /></div>
                <div>
                   <h3 style={{ fontSize: '1.5rem', fontWeight: '800', margin: 0 }}>API Integration</h3>
                   <p style={{ color: '#666', fontSize: '0.875rem' }}>Build your own tools using our REST API.</p>
                </div>
            </div>
            <div style={{ background: '#f9f9f9', padding: '0.75rem 1.5rem', borderRadius: '12px', border: '1px solid #eee', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontSize: '0.875rem', fontWeight: '700', color: '#666' }}>API Key:</span>
                <code style={{ fontWeight: '800', color: 'var(--primary)', letterSpacing: '2px' }}>{token}</code>
                <button onClick={() => copy('token', token)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa' }}><Copy size={16} /></button>
            </div>
        </div>

        <div style={{ background: '#f8f9ff', padding: '2rem', borderRadius: '20px', border: '1px solid #eef2ff' }}>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
               <span style={{ background: '#10b981', color: 'white', padding: '0.375rem 0.75rem', borderRadius: '6px', fontSize: '0.75rem', fontWeight: '800' }}>GET</span>
               <code style={{ fontSize: '1.125rem', fontWeight: '800' }}>/api/v1/shorten</code>
            </div>
            <p style={{ color: '#666', marginBottom: '2rem' }}>Returns a shortened URL for any long URL provided. Requires an API key.</p>

            <h5 style={{ fontSize: '0.875rem', fontWeight: '800', marginBottom: '1rem' }}>Parameters:</h5>
            <div style={{ background: 'white', borderRadius: '12px', border: '1px solid #eee', overflow: 'hidden', marginBottom: '2rem' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead style={{ background: '#f9f9f9' }}>
                        <tr style={{ borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', color: '#aaa' }}>Name</th>
                            <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', color: '#aaa' }}>Type</th>
                            <th style={{ padding: '0.75rem 1.25rem', textAlign: 'left', fontSize: '0.75rem', color: '#aaa' }}>Description</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr style={{ borderBottom: '1px solid #f9f9f9' }}>
                            <td style={{ padding: '0.75rem 1.25rem' }}><code>api</code></td>
                            <td style={{ padding: '0.75rem 1.25rem' }}>String</td>
                            <td style={{ padding: '0.75rem 1.25rem' }}>Your private API key</td>
                        </tr>
                        <tr>
                            <td style={{ padding: '0.75rem 1.25rem' }}><code>url</code></td>
                            <td style={{ padding: '0.75rem 1.25rem' }}>String</td>
                            <td style={{ padding: '0.75rem 1.25rem' }}>The long URL to shorten</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <h5 style={{ fontSize: '0.875rem', fontWeight: '800', marginBottom: '1rem' }}>Exapmle URL:</h5>
            <pre style={{ background: '#1a1a1a', color: 'white', padding: '1.5rem', borderRadius: '12px', fontSize: '0.875rem', overflow: 'auto' }}>
                {window.location.origin}/api/v1/shorten?api={token}&url=https://google.com
            </pre>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ApiDocumentation;
