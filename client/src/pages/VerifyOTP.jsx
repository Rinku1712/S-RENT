import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { verifyOTP, resendOTP } from '../services/authService';
import {
  MailCheck,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

/**
 * Premium S-RENT OTP Verification Screen
 * URL: /verify-otp
 */
const VerifyOTP = () => {
  const [searchParams] = useSearchParams();
  const initialEmail = searchParams.get('email') || '';

  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);

  // 5-minute countdown (300 seconds)
  const [secondsLeft, setSecondsLeft] = useState(300);
  // Resend cooldown timer (30 seconds)
  const [resendCooldown, setResendCooldown] = useState(30);

  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
      setResendCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTimer = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setError('Please provide a valid registered email address.');
      return;
    }

    if (otp.trim().length !== 6) {
      setError('Please enter the 6-digit verification code.');
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOTP({ email: email.trim(), otp: otp.trim() });
      setSuccessMsg(res.message || 'Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { state: { verifiedEmail: email } });
      }, 1400);
    } catch (err) {
      setError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setError(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setError('Please enter your email to receive a new OTP.');
      return;
    }

    try {
      setResending(true);
      const res = await resendOTP({ email: email.trim() });
      setSuccessMsg(res.message || 'A fresh OTP has been sent to your email.');
      setSecondsLeft(300);
      setResendCooldown(45);
    } catch (err) {
      setError(err.message || 'Failed to resend code. Please wait.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: 460 }}>
        {/* Brand Header */}
        <div className="auth-header">
          <div
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 14px',
            }}
          >
            <MailCheck size={28} />
          </div>
          <h2>Verify Your Email</h2>
          <p>We've sent a 6-digit verification code to your email</p>
        </div>

        {error && (
          <div className="alert alert-danger" style={{ marginBottom: 20 }}>
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success" style={{ marginBottom: 20 }}>
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleVerify}>
          {/* Email (Editable in case user wants to change) */}
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
              placeholder="user@example.com"
            />
          </div>

          {/* 6-Digit OTP */}
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <label className="form-label" style={{ margin: 0 }}>
                6-Digit Security Code
              </label>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontSize: '0.8rem',
                  color: secondsLeft < 60 ? 'var(--danger)' : 'var(--text-secondary)',
                  fontWeight: 600,
                }}
              >
                <Clock size={13} />
                <span>Expires in {formatTimer(secondsLeft)}</span>
              </div>
            </div>

            <input
              type="text"
              required
              maxLength="6"
              autoFocus
              placeholder="1 2 3 4 5 6"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="form-input"
              style={{
                textAlign: 'center',
                fontSize: '1.6rem',
                letterSpacing: '0.4em',
                fontWeight: 800,
                padding: '12px 14px',
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
          >
            <CheckCircle2 size={16} />
            <span>{loading ? 'Verifying Code...' : 'Verify Email & Continue'}</span>
          </button>
        </form>

        {/* Resend Cooldown Section */}
        <div style={{ textAlign: 'center', marginTop: 22 }}>
          {resendCooldown > 0 ? (
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Resend code available in <strong>{resendCooldown}s</strong>
            </span>
          ) : (
            <button
              onClick={handleResend}
              disabled={resending}
              type="button"
              className="btn btn-link"
              style={{
                fontSize: '0.85rem',
                color: 'var(--primary)',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <RotateCcw size={14} />
              <span>{resending ? 'Sending new code...' : 'Resend Verification Code'}</span>
            </button>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="auth-footer" style={{ marginTop: 20 }}>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', margin: 0 }}>
            Already verified?{' '}
            <Link to="/login" className="text-red" style={{ fontWeight: 700 }}>
              Back to Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
