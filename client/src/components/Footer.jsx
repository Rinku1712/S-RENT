import { Link } from 'react-router-dom';
import { Handshake } from 'lucide-react';

/**
 * Footer Component (s-rent Red & White Theme Standard)
 * Specifications:
 * - Clean minimal white footer featuring s-rent links, legal notices, copyright,
 *   and social media icons styled consistently in the red-and-white theme.
 */
const Footer = () => {
  return (
    <footer className="bg-white border-t border-red-100 text-gray-700 pt-16 pb-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-gray-100">
          {/* Col 1: Brand & Identity */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-flex items-center gap-2.5 mb-4 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-red-700 to-red-600 flex items-center justify-center shadow-md shadow-red-500/20 group-hover:scale-105 transition-transform duration-200">
                <svg
                  viewBox="0 0 24 24"
                  className="w-6 h-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83" opacity="0.4" />
                  <path d="M16 8h-4a2 2 0 0 0-2 2v0a2 2 0 0 0 2 2h4a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2h-5" />
                </svg>
              </div>
              <div className="flex flex-col">
                <span className="font-extrabold text-2xl tracking-tight text-red-600 group-hover:text-red-700 transition-colors">
                  S-RENT
                </span>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 -mt-0.5">
                  Rent Smart. Live More.
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-600 leading-relaxed mb-6 max-w-sm">
              A peer-to-peer gear rental marketplace. Explore cameras, audio equipment, lenses, outdoor gear, and tools listed by members.
            </p>

            <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-red-50/60 border border-red-100 max-w-sm">
              <Handshake size={22} className="text-red-600 flex-shrink-0" />
              <div>
                <strong className="block text-xs font-bold text-gray-900">
                  Coordinate Directly
                </strong>
                <span className="text-[11px] text-gray-600">
                  Confirm pickup, payment, and return arrangements with the owner.
                </span>
              </div>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
              Explore s-rent
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/items" className="text-gray-600 hover:text-red-600 transition-colors">
                  Explore Catalog
                </Link>
              </li>
              <li>
                <a href="/#how-it-works" className="text-gray-600 hover:text-red-600 transition-colors">
                  How s-rent works
                </a>
              </li>
              <li>
                <a href="/#guarantee" className="text-gray-600 hover:text-red-600 transition-colors">
                  Rental essentials
                </a>
              </li>
              <li>
                <a href="/#faqs" className="text-gray-600 hover:text-red-600 transition-colors">
                  FAQ's
                </a>
              </li>
              <li>
                <a href="/#contact" className="text-gray-600 hover:text-red-600 transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Popular Categories */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
              Popular Categories
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/items?category=Mirrorless Camera" className="text-gray-600 hover:text-red-600 transition-colors">
                  Mirrorless Cameras
                </Link>
              </li>
              <li>
                <Link to="/items?category=Studio Lamp" className="text-gray-600 hover:text-red-600 transition-colors">
                  Studio Lighting
                </Link>
              </li>
              <li>
                <Link to="/items?category=Digital Cinema Cameras" className="text-gray-600 hover:text-red-600 transition-colors">
                  Cinema Rigs
                </Link>
              </li>
              <li>
                <Link to="/items?category=Audio Gear" className="text-gray-600 hover:text-red-600 transition-colors">
                  Pro Audio & Mics
                </Link>
              </li>
              <li>
                <Link to="/items?category=Lenses" className="text-gray-600 hover:text-red-600 transition-colors">
                  Prime & Zoom Lenses
                </Link>
              </li>
              <li>
                <Link to="/items?category=Travel Gear" className="text-gray-600 hover:text-red-600 transition-colors">
                  Travel & Camping Gear
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Member Services & Legal */}
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-4">
              Member Services
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/create-item" className="text-red-600 font-bold hover:underline">
                  + Create Item to Rent
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-red-600 transition-colors">
                  My Member Dashboard
                </Link>
              </li>
              <li>
                <Link to="/dashboard?tab=wishlist" className="text-gray-600 hover:text-red-600 transition-colors">
                  Saved Wishlist
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-600 hover:text-red-600 transition-colors">
                  Sign In to Account
                </Link>
              </li>
              <li>
                <Link to="/signup" className="text-gray-600 hover:text-red-600 transition-colors">
                  Create Free Account
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar: Copyright & Social Links */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} s-rent platform. All rights reserved. Built for smart creators and renters.</p>

          <div className="flex items-center gap-6">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Rental Agreement</span>
          </div>

          {/* Social Media Icons in Red-Accent Theme */}
          <div className="flex items-center gap-3">
            {/* Twitter / X */}
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-200 flex items-center justify-center transition-colors"
              aria-label="s-rent on Twitter"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-200 flex items-center justify-center transition-colors"
              aria-label="s-rent on Instagram"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>

            {/* LinkedIn */}
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer"
              className="w-8 h-8 rounded-full bg-gray-50 hover:bg-red-50 text-gray-500 hover:text-red-600 border border-gray-200 flex items-center justify-center transition-colors"
              aria-label="s-rent on LinkedIn"
            >
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
