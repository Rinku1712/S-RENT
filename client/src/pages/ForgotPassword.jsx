import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../services/authService';
import { useAuth } from '../context/AuthContext';
import {
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  RotateCcw,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import BrandLogo from '../components/BrandLogo';

/**
 * Premium S-RENT Forgot Password & Password Reset Experience
 * Multi-step flow:
 * 1. Step 'request': Enter registered email to receive 6-digit OTP
 * 2. Step 'reset': Enter received OTP + set new password
 * 3. Step 'success': Confirmation card with direct link to Login
 */
const ForgotPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isSuperAdmin } = useAuth();

  // Multi-step: 'request' | 'reset' | 'success'
  const [step, setStep] = useState('request');

  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // Resend cooldown timer in seconds
  const [resendCooldown, setResendCooldown] = useState(30);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(isSuperAdmin ? '/admin/dashboard' : '/dashboard', { replace: true });
    }
  }, [isAuthenticated, isSuperAdmin, navigate]);

  // Resend cooldown timer countdown
  useEffect(() => {
    if (step === 'reset' && resendCooldown > 0) {
      const timer = setInterval(() => {
        setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step, resendCooldown]);

  if (isAuthenticated) {
    return null;
  }

  // Step 1: Request Password Reset OTP
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      setError('Please provide your registered email address.');
      return;
    }

    try {
      setLoading(true);
      const res = await forgotPassword({ email: trimmedEmail });
      setSuccessMsg(res.message || 'Verification code sent to your email.');
      setStep('reset');
      setResendCooldown(30);
    } catch (err) {
      setError(err.message || 'Unable to request password reset code.');
    } finally {
      setLoading(false);
    }
  };

  // Resend code while on reset step
  const handleResendCode = async () => {
    if (resendCooldown > 0 || resending) return;
    setError(null);
    setSuccessMsg(null);

    try {
      setResending(true);
      const res = await forgotPassword({ email: email.trim().toLowerCase() });
      setSuccessMsg(res.message || 'A fresh verification code has been sent to your email.');
      setResendCooldown(45);
    } catch (err) {
      setError(err.message || 'Failed to resend code. Please try again.');
    } finally {
      setResending(false);
    }
  };

  // Step 2: Validate OTP and Set New Password
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    const cleanOtp = otp.trim();
    if (!cleanOtp || cleanOtp.length !== 6) {
      setError('Please enter the valid 6-digit code sent to your email.');
      return;
    }

    if (newPassword.length < 8) {
      setError('New password must be at least 8 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match. Please ensure both passwords match.');
      return;
    }

    try {
      setLoading(true);
      const res = await resetPassword({
        email: email.trim().toLowerCase(),
        otp: cleanOtp,
        newPassword,
      });

      if (res.success || res.message) {
        setStep('success');
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (err) {
      setError(err.message || 'Invalid or expired code. Please verify and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 480 }}>
        {/* Brand Header */}
        <div className="auth-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
            <BrandLogo size="lg" variant="compact" />
          </div>

          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 12px',
            }}
          >
            {step === 'success' ? (
              <CheckCircle2 size={26} className="text-success" />
            ) : (
              <KeyRound size={26} />
            )}
          </div>

          <h2>
            {step === 'request' && 'Forgot Password?'}
            {step === 'reset' && 'Create New Password'}
            {step === 'success' && 'Password Reset Complete!'}
          </h2>

          <p>
            {step === 'request' &&
              "Enter your registered account email and we'll send a 6-digit verification code to reset your password."}
            {step === 'reset' &&
              'Enter the 6-digit code sent to your inbox and choose a new secure password.'}
            {step === 'success' &&
              'Your password has been successfully updated. You can now sign in with your new credentials.'}
          </p>
        </div>

        {/* Global Error Banner */}
        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 20 }}>
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Success Feedback Banner */}
        {successMsg && step !== 'success' && (
          <div className="alert alert-success" style={{ marginBottom: 20 }}>
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* =======================================================
            STEP 1: REQUEST CODE (Enter Email)
            ======================================================= */}
        {step === 'request' && (
          <form onSubmit={handleRequestCode}>
            <div className="form-group">
              <label className="form-label">Registered Email Address</label>
              <div style={{ position: 'relative' }}>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                  autoFocus
                />
                <Mail
                  size={16}
                  className="text-muted"
                  style={{ position: 'absolute', left: 12, top: 13 }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
            >
              <KeyRound size={16} />
              <span>{loading ? 'Sending Code...' : 'Send Verification Code'}</span>
            </button>

            <div style={{ textAlign: 'center', marginTop: 20 }}>
              <Link
                to="/login"
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                <ArrowLeft size={14} />
                <span>Back to Sign In</span>
              </Link>
            </div>
          </form>
        )}

        {/* =======================================================
            STEP 2: ENTER OTP & NEW PASSWORD
            ======================================================= */}
        {step === 'reset' && (
          <form onSubmit={handleResetSubmit}>
            {/* Target Email summary with change button */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '10px 14px',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--bg-subtle)',
                border: '1px solid var(--border)',
                marginBottom: 16,
                fontSize: '0.86rem',
              }}
            >
              <div>
                <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem' }}>
                  Code sent to
                </span>
                <strong style={{ color: 'var(--text-primary)' }}>{email}</strong>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStep('request');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="btn btn-ghost btn-sm"
                style={{ fontSize: '0.78rem', padding: '4px 8px' }}
              >
                Change
              </button>
            </div>

            {/* 6-Digit OTP */}
            <div className="form-group">
              <label className="form-label">6-Digit Verification Code</label>
              <input
                type="text"
                required
                maxLength="6"
                placeholder="123456"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="form-input"
                style={{
                  fontSize: '1.25rem',
                  letterSpacing: '6px',
                  textAlign: 'center',
                  fontWeight: 700,
                  fontFamily: 'monospace',
                }}
                autoFocus
              />
            </div>

            {/* New Password */}
            <div className="form-group">
              <label className="form-label">New Password (min 8 characters)</label>
              <div className="password-input-wrapper">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter new strong password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                />
                <Lock
                  size={16}
                  className="text-muted"
                  style={{ position: 'absolute', left: 12, top: 13 }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="password-toggle-btn"
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="form-group">
              <label className="form-label">Confirm New Password</label>
              <div className="password-input-wrapper">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="form-input"
                  style={{ paddingLeft: 38 }}
                />
                <Lock
                  size={16}
                  className="text-muted"
                  style={{ position: 'absolute', left: 12, top: 13 }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="password-toggle-btn"
                  aria-label="Toggle password visibility"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Resend Code Section */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                margin: '12px 0 16px',
                fontSize: '0.84rem',
              }}
            >
              <span style={{ color: 'var(--text-muted)' }}>Didn't receive code?</span>
              <button
                type="button"
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || resending}
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--primary)', fontWeight: 600, padding: '2px 6px' }}
              >
                {resending ? (
                  'Resending...'
                ) : resendCooldown > 0 ? (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: 'var(--text-muted)' }}>
                    <Clock size={13} />
                    Resend in {resendCooldown}s
                  </span>
                ) : (
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                    <RotateCcw size={13} />
                    Resend Code
                  </span>
                )}
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <ShieldCheck size={16} />
              <span>{loading ? 'Updating Password...' : 'Reset Password'}</span>
            </button>

            <div style={{ textAlign: 'center', marginTop: 18 }}>
              <button
                type="button"
                onClick={() => {
                  setStep('request');
                  setError(null);
                  setSuccessMsg(null);
                }}
                className="btn btn-ghost btn-sm"
                style={{ color: 'var(--text-secondary)' }}
              >
                <ArrowLeft size={14} />
                <span>Use a different email</span>
              </button>
            </div>
          </form>
        )}

        {/* =======================================================
            STEP 3: SUCCESS CONFIRMATION
            ======================================================= */}
        {step === 'success' && (
          <div style={{ textAlign: 'center', padding: '10px 0' }}>
            <div
              style={{
                padding: '16px',
                backgroundColor: 'var(--bg-subtle)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border)',
                marginBottom: 24,
                fontSize: '0.9rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
              }}
            >
              Your password has been securely reset. You can now use your new password to access your S-RENT marketplace account.
            </div>

            <Link
              to="/login"
              state={{ verifiedEmail: email }}
              className="btn btn-primary btn-lg"
              style={{ width: '100%', justifyContent: 'center' }}
            >
              <span>Sign In to Account</span>
            </Link>
          </div>
        )}

        {/* Card Footer */}
        {step !== 'success' && (
          <div className="auth-footer" style={{ marginTop: 24, paddingTop: 16 }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
              Remember your password?{' '}
              <Link to="/login" className="text-red" style={{ fontWeight: 700 }}>
                Sign In
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

