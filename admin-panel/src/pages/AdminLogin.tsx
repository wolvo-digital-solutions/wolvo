import { useState, type FormEvent } from 'react';
import { Lock, Mail, AlertCircle, ArrowRight, Sparkles, CheckCircle2, UserPlus, LogIn } from 'lucide-react';
import { useAdminAuth } from '@/context/AdminAuthContext';

export function AdminLogin() {
  const { login, register, isConfigured } = useAdminAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both your administrator email and password.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      if (isSignUp) {
        await register(email, password);
      } else {
        await login(email, password);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Authentication failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const fillDemo = () => {
    setEmail('admin@wolvo.agency');
    setPassword('admin123');
    setError(null);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'radial-gradient(circle at 50% 20%, rgba(0, 102, 255, 0.12), transparent 70%), #07090e',
      }}
    >
      <div
        className="admin-card"
        style={{
          width: '100%',
          maxWidth: '440px',
          padding: '36px',
          borderColor: 'rgba(0, 102, 255, 0.3)',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div
            style={{
              width: '64px',
              height: '64px',
              margin: '0 auto 16px',
              borderRadius: '16px',
              background: 'rgba(0, 102, 255, 0.08)',
              border: '1px solid rgba(0, 102, 255, 0.25)',
              display: 'grid',
              placeItems: 'center',
              padding: '12px',
              boxShadow: '0 8px 24px -4px rgba(0, 102, 255, 0.25)',
            }}
          >
            <img
              src="/brand/wolvo-mark.png"
              alt="Wolvo Logo"
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
              onError={(e) => {
                (e.currentTarget as HTMLElement).style.display = 'none';
              }}
            />
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '6px' }}>
            <h1 style={{ fontSize: '1.45rem', fontWeight: 800, color: '#fff', letterSpacing: '-0.02em', margin: 0 }}>
              Wolvo Admin CMS
            </h1>
            <span className="admin-brand-tag">SaaS CMS</span>
          </div>
          <p style={{ fontSize: '0.85rem', color: '#a3b1c4', marginTop: '4px' }}>
            {isSignUp ? 'Register New Administrator' : 'Authorized Administrator Access Only'}
          </p>

          {isConfigured && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                marginTop: '12px',
                padding: '4px 10px',
                borderRadius: '100px',
                background: 'rgba(16, 185, 129, 0.12)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                fontSize: '0.75rem',
                color: '#34d399',
                fontWeight: 600,
              }}
            >
              <CheckCircle2 size={12} />
              <span>Connected to Live Supabase</span>
            </div>
          )}
        </div>

        {error && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.825rem',
              marginBottom: '20px',
            }}
          >
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 14px',
              borderRadius: '10px',
              background: 'rgba(16, 185, 129, 0.12)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              color: '#34d399',
              fontSize: '0.825rem',
              marginBottom: '20px',
            }}
          >
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label className="admin-label" htmlFor="admin-email">
              Admin Email
            </label>
            <div style={{ position: 'relative' }}>
              <Mail
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7a90',
                }}
              />
              <input
                id="admin-email"
                type="email"
                className="admin-input"
                style={{ paddingLeft: '38px' }}
                placeholder="admin@wolvoinfotech.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>
          </div>

          <div className="admin-form-group">
            <label className="admin-label" htmlFor="admin-password">
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <Lock
                size={16}
                style={{
                  position: 'absolute',
                  left: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  color: '#6b7a90',
                }}
              />
              <input
                id="admin-password"
                type="password"
                className="admin-input"
                style={{ paddingLeft: '38px' }}
                placeholder="••••••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="admin-btn admin-btn--primary"
            style={{ width: '100%', padding: '12px', marginTop: '10px' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <span>Processing...</span>
            ) : isSignUp ? (
              <>
                <UserPlus size={16} />
                <span>Create Administrator Account</span>
              </>
            ) : (
              <>
                <span>Sign in to Dashboard</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: '20px', textAlign: 'center' }}>
          <button
            type="button"
            onClick={() => {
              setIsSignUp(!isSignUp);
              setError(null);
              setSuccess(null);
            }}
            style={{
              background: 'none',
              border: 'none',
              color: '#0066ff',
              cursor: 'pointer',
              fontSize: '0.825rem',
              fontWeight: 500,
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
            }}
          >
            {isSignUp ? (
              <>
                <LogIn size={14} />
                <span>Already have an admin account? Sign in</span>
              </>
            ) : (
              <>
                <UserPlus size={14} />
                <span>First time setup? Create initial admin</span>
              </>
            )}
          </button>
        </div>

        {!isConfigured && (
          <div style={{ marginTop: '24px', borderTop: '1px solid #1e293b', paddingTop: '18px', textAlign: 'center' }}>
            <p style={{ fontSize: '0.75rem', color: '#6b7a90', marginBottom: '10px' }}>
              Local Demo Mode Active (Supabase credentials not yet set)
            </p>
            <button
              type="button"
              className="admin-btn admin-btn--secondary admin-btn--sm"
              onClick={fillDemo}
              style={{ width: '100%' }}
            >
              <Sparkles size={14} />
              <span>Fill Demo Admin Credentials</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
