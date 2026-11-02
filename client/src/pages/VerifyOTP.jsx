import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { verifyOTP, resendOTP } from '../services/authService';
import {
  MailCheck,
  Clock,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

/**
 * OTP Verification Page
 * URL: /verify-otp
 * Features:
 * - 6-digit OTP confirmation
 * - 5-minute countdown expiry timer
 * - Resend OTP cooldown timer
 * - Zero emojis, 100% Lucide React icons
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

  // 5-minute expiry countdown (300 seconds)
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
      setError('Please enter a valid 6-digit verification code.');
      return;
    }

    try {
      setLoading(true);
      const res = await verifyOTP({ email: email.trim(), otp: otp.trim() });
      setSuccessMsg(res.message || 'Email verified successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { state: { verifiedEmail: email } });
      }, 1500);
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
      setError(err.message || 'Failed to resend OTP. Please try again.');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <div className="brand-icon-box" style={{ margin: '0 auto 12px' }}>
            <MailCheck size={20} />
          </div>
          <h2>Verify Your Email</h2>
          <p>We've sent a 6-digit confirmation code to your email</p>
          {email && (
            <div style={{ marginTop: 6, fontWeight: 700, color: 'var(--primary)', fontSize: 14 }}>
              {email}
            </div>
          )}
        </div>

        {error && (
          <div className="alert alert-danger">
            <AlertCircle size={16} style={{ flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="alert alert-success">
            <CheckCircle2 size={16} style={{ flexShrink: 0 }} />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleVerify}>
          {!initialEmail && (
            <div className="form-group">
              <label className="form-label">Registered Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your registered email"
                className="form-input"
              />
            </div>
          )}

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
              <label className="form-label" style={{ margin: 0 }}>
                6-Digit Security Code
              </label>
              <span
                style={{
                  fontSize: 12,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                  color: secondsLeft > 0 ? 'var(--text-secondary)' : 'var(--danger)',
                }}
              >
                <Clock size={12} />
                {secondsLeft > 0 ? `Expires: ${formatTimer(secondsLeft)}` : 'Expired'}
              </span>
            </div>

            <input
              type="text"
              required
              maxLength="6"
              pattern="\d{6}"
              placeholder="0 0 0 0 0 0"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
              className="form-input"
              style={{
                textAlign: 'center',
                letterSpacing: '0.4em',
                fontSize: 22,
                fontWeight: 700,
              }}
              autoFocus
            />
          </div>

          <button
            type="submit"
            disabled={loading || otp.length !== 6}
            className="btn btn-primary btn-lg"
            style={{ width: '100%', marginTop: 8, justifyContent: 'center' }}
          >
            <ShieldCheck size={16} />
            <span>{loading ? 'Verifying...' : 'Verify OTP & Continue'}</span>
          </button>
        </form>

        <div style={{ marginTop: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
            Didn't receive the email code?
          </p>
          <button
            type="button"
            onClick={handleResend}
            disabled={resending || resendCooldown > 0}
            className="btn btn-secondary btn-sm"
            style={{ marginTop: 8 }}
          >
            <RotateCcw size={13} />
            <span>
              {resending
                ? 'Sending...'
                : resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : 'Resend Verification Code'}
            </span>
          </button>
        </div>

        <div className="auth-footer">
          <p style={{ fontSize: 13 }}>
            Wrong email address?{' '}
            <Link to="/signup" className="text-red" style={{ fontWeight: 600 }}>
              Sign up again
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;
