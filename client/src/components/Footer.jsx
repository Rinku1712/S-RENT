import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

/**
 * Footer Component
 * Features:
 * - SRENT brand wordmark & official tagline: "Sab Rent Par, Saste Rent Par"
 * - Marketplace links, User links, Trust & Security guarantees
 * - 100% Lucide React icons, zero emojis
 */
const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="container">
        <div className="footer-grid">
          {/* Col 1: SRENT Brand & Tagline */}
          <div className="footer-col">
            <Link to="/" className="brand-logo" style={{ marginBottom: 12 }}>
              <div className="brand-icon-box">
                <span>S</span>
              </div>
              <div className="brand-text-block">
                <span className="brand-title">
                  S<span className="red-accent">RENT</span>
                </span>
                <span className="brand-tagline-pill">Sab Rent Par, Saste Rent Par</span>
              </div>
            </Link>
            <p style={{ fontSize: 14, lineHeight: 1.6, marginBottom: 16 }}>
              India's smart peer-to-peer rental marketplace. Access quality gadgets, appliances, cameras, tools, and lifestyle equipment without paying full retail prices.
            </p>
            <div className="footer-trust-box">
              <ShieldCheck size={20} className="text-red" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: 13, color: 'var(--text-primary)', display: 'block' }}>
                  Community Trust & Protection
                </strong>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  OTP verification, verified owners, and refundable security deposits.
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Marketplace Catalog */}
          <div className="footer-col">
            <h4>Explore Catalog</h4>
            <ul className="footer-links">
              <li>
                <Link to="/items">All Available Items</Link>
              </li>
              <li>
                <Link to="/items?category=Electronics">Electronics & Laptops</Link>
              </li>
              <li>
                <Link to="/items?category=Toys">Toys & Gaming Gear</Link>
              </li>
              <li>
                <Link to="/items?category=Vehicles">Vehicles & Transport</Link>
              </li>
              <li>
                <a href="/#how-it-works">How SRENT Works</a>
              </li>
            </ul>
          </div>

          {/* Col 3: For Renters & Owners */}
          <div className="footer-col">
            <h4>For Members</h4>
            <ul className="footer-links">
              <li>
                <Link to="/create-item">List Your Item for Rent</Link>
              </li>
              <li>
                <Link to="/dashboard">Member Dashboard</Link>
              </li>
              <li>
                <Link to="/login">Account Login</Link>
              </li>
              <li>
                <Link to="/signup">Register Free Account</Link>
              </li>
              <li>
                <Link to="/profile">Profile & Security</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Platform Safety */}
          <div className="footer-col">
            <h4>Safety & Assurance</h4>
            <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 14, color: 'var(--text-secondary)' }}>
              Our transparent peer-to-peer system ensures fair daily pricing, item inspection periods, and verified transactions across all categories.
            </p>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Legal */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} SRENT Marketplace. All rights reserved.</p>
          <div className="footer-legal-links">
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }}>Terms and Conditions</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }}>Security Deposit Protection</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
