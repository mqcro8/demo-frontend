import { useState } from 'react';
import './App.css';

function App() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState<{ email: string; valid: boolean; reason: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rateLimitInfo, setRateLimitInfo] = useState('');

  const handleVerify = async () => {
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:4000'}/api/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const remaining = response.headers.get('X-RateLimit-Remaining');
      const limit = response.headers.get('X-RateLimit-Limit');

      if (remaining !== null && limit !== null) {
        setRateLimitInfo(`${remaining} requests remaining (${limit} per minute)`);
      }

      const data = await response.json();

      if (data.success) {
        setResult(data);
      } else {
        setError(data.error || 'Verification failed');
      }
    } catch {
      setError('Failed to connect to the server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <nav className="nav">
        <div className="logo">VerifyAPI</div>
        <div className="rapidapi-badge-placeholder">
          <a href="https://rapidapi.com/YOUR_USERNAME/api/YOUR_API" target="_blank">
          <img src="https://storage.googleapis.com/rapidapi-documentation/connect-on-rapidapi-dark.png" width="215" alt="Connect on RapidAPI"/>
        </a>
        </div>
      </nav>

      <section className="hero">
        <h1>Verify emails in <span className="highlight">&lt;200ms</span></h1>
        <p className="subtitle">High-performance email verification API with real-time validation, DNS checks, and risk scoring.</p>
      </section>

      <section id="demo" className="demo-section">
        <p className="demo-description">Enter an email to verify its validity instantly.</p>

        <div className="demo-card">
          <div className="input-group">
            <input
              type="email"
              placeholder="Enter email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleVerify()}
              disabled={loading}
            />
            <button onClick={handleVerify} disabled={loading || !email}>
              {loading ? 'Verifying...' : 'Verify'}
            </button>
          </div>

          {rateLimitInfo && <div className="rate-limit">Rate limit: {rateLimitInfo}</div>}
          {error && <div className="error">{error}</div>}

          {result && (
            <div className={`result ${result.valid ? 'valid' : 'invalid'}`}>
              <div className="result-icon">{result.valid ? '✓' : '✗'}</div>
              <div className="result-text">
                <strong>{result.email}</strong>
                <span>{result.reason}</span>
              </div>
            </div>
          )}

        </div>
      </section>

      <section className="features">
        <h2>Features</h2>
        <div className="features-grid">
          <div className="feature">
            <h3>Format Validation</h3>
            <p>Checks email syntax and structure</p>
          </div>
          <div className="feature">
            <h3>DNS/MX Lookup</h3>
            <p>Verifies domain and mail server existence</p>
          </div>
          <div className="feature">
            <h3>Disposable Detection</h3>
            <p>Identifies temporary email providers</p>
          </div>
          <div className="feature">
            <h3>Risk Scoring</h3>
            <p>0-1 risk score with confidence metrics</p>
          </div>
        </div>
      </section>

      <footer className="footer">
        <p>Verification API</p>
        <div className="footer-links">
          <a href="mailto:miguel.ceballos.a@hotmail.com">Contact Me</a>
          <a href="https://rapidapi.com/user/macqro888" target="_blank" rel="noopener noreferrer">RapidAPI</a>
          <a href="https://github.com/mqcro8" target="_blank" rel="noopener noreferrer">GitHub</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
