import { useState } from 'react';
import { fetchLogin, fetchRegister } from '../adapters/authAdapters';
import './AuthPage.css';

export default function AuthPage({ onLogin, onRegister }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (mode === 'login') {
        const user = await fetchLogin(username, password);
        onLogin(user);
      } else {
        const user = await fetchRegister(username, password);
        onRegister(user);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMode = () => {
    setMode((m) => (m === 'login' ? 'register' : 'login'));
    setError('');
  };

  return (
    <div className="auth-page">
      {/* ── Left hero panel ── */}
      <div className="auth-hero" aria-hidden="true">
        <div className="auth-hero-blob auth-hero-blob--1" />
        <div className="auth-hero-blob auth-hero-blob--2" />
        <div className="auth-hero-content">
          <h1 className="auth-hero-title">বই</h1>
          <p className="auth-hero-subtitle">Your personal reading world.</p>
          <ul className="auth-hero-features">
            <li>Track what you're reading</li>
            <li>Rate and review your books</li>
            <li>Build your own shelf</li>
          </ul>
        </div>
      </div>

      {/* ── Right form panel ── */}
      <div className="auth-form-panel">
        <div className="auth-form-card">
          <div className="auth-form-header">
            <span className="auth-form-logo">বই (boi)</span>
            <h2 className="auth-form-title">
              {mode === 'login' ? 'Welcome back' : 'Create an account'}
            </h2>
          </div>

          {error && <p className="auth-error" role="alert">{error}</p>}

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="e.g. noboni"
                required
                autoFocus
              />
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={isLoading}>
              {isLoading ? 'Please wait…' : mode === 'login' ? 'Log In' : 'Register'}
            </button>
          </form>

          <p className="auth-toggle">
            {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
            <button className="auth-toggle-btn" onClick={toggleMode}>
              {mode === 'login' ? 'Register' : 'Log In'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}