import { Link } from 'react-router-dom';
import { ShieldCheck, CheckCircle2 } from 'lucide-react';

/**
 * Footer Component (Startup-Grade Marketplace Footer)
 * Features:
 * - Brand wordmark & official tagline: "Sab Rent Par, Saste Rent Par"
 * - Catalog discovery links
 * - Member & Owner links
 * - Safety & Trust guarantees
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
            <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 16 }}>
              India's premier peer-to-peer rental marketplace. Access high-end tech, cameras, appliances, power tools, and vehicles at affordable daily and weekly rates.
            </p>
            <div className="footer-trust-box">
              <ShieldCheck size={20} className="text-red" style={{ flexShrink: 0, marginTop: 2 }} />
              <div>
                <strong style={{ fontSize: 13, color: 'var(--text-primary)', display: 'block' }}>
                  100% Deposit Protection
                </strong>
                <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  Safe OTP verification, verified owners, and transparent security deposits.
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Marketplace Catalog */}
          <div className="footer-col">
            <h4>Explore Rentals</h4>
            <ul className="footer-links">
              <li>
                <Link to="/items">All Rental Items</Link>
              </li>
              <li>
                <Link to="/items?category=Electronics">Electronics & Laptops</Link>
              </li>
              <li>
                <Link to="/items?category=Cameras">Cameras & Photography</Link>
              </li>
              <li>
                <Link to="/items?category=Vehicles">Bikes & Vehicles</Link>
              </li>
              <li>
                <a href="/#how-it-works">How S-RENT Works</a>
              </li>
              <li>
                <a href="/#benefits">Why Rent Instead of Buy</a>
              </li>
            </ul>
          </div>

          {/* Col 3: For Renters & Owners */}
          <div className="footer-col">
            <h4>Member Services</h4>
            <ul className="footer-links">
              <li>
                <Link to="/create-item">List Your Item for Rent</Link>
              </li>
              <li>
                <Link to="/dashboard">Member Dashboard</Link>
              </li>
              <li>
                <Link to="/dashboard?tab=wishlist">Saved Wishlist</Link>
              </li>
              <li>
                <Link to="/dashboard?tab=rentals">My Bookings & Rentals</Link>
              </li>
              <li>
                <Link to="/dashboard?tab=requests">Incoming Owner Requests</Link>
              </li>
              <li>
                <Link to="/profile">Profile & Security Settings</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust, Safety & Assurance */}
          <div className="footer-col">
            <h4>Trust & Safety</h4>
            <p style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 14, color: 'var(--text-secondary)' }}>
              Our peer-to-peer verification engine ensures transparent pricing, safe handovers, and prompt return of security deposits.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={14} className="text-success" />
                <span>Verified phone & email credentials</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={14} className="text-success" />
                <span>Mandatory item inspection period</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <CheckCircle2 size={14} className="text-success" />
                <span>Zero hidden booking platform charges</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} SRENT Marketplace. All rights reserved. Built for smart renters across India.</p>
          <div className="footer-legal-links">
            <span style={{ cursor: 'pointer' }}>Privacy Policy</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }}>Terms of Service</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }}>Rental Agreement</span>
            <span>•</span>
            <span style={{ cursor: 'pointer' }}>Security Deposit Guarantee</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
