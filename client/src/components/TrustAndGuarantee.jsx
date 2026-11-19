import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  RotateCcw,
  CheckCircle2,
  HelpCircle,
  ChevronDown,
  Mail,
  Sparkles,
  ArrowRight,
  PackageCheck,
  Handshake,
} from 'lucide-react';

/**
 * Trust, How It Works, Guarantee & FAQ Component
 * Provides complete support for navbar anchors:
 * - #how-it-works
 * - #guarantee
 * - #faqs
 * - #contact
 */
const TrustAndGuarantee = () => {
  const [openFaq, setOpenFaq] = useState(null);

  const toggleFaq = (idx) => {
    setOpenFaq(openFaq === idx ? null : idx);
  };

  const faqs = [
    {
      q: 'How are security deposits handled?',
      a: 'The listing shows the deposit amount. Confirm the deposit and return terms with the owner before handover, and contact support if anything is unclear.',
    },
    {
      q: 'How do I arrange pickup and payment?',
      a: 'After the owner approves your request, contact them to confirm pickup, payment, and deposit details before handover.',
    },
    {
      q: 'What happens if equipment is accidentally damaged?',
      a: 'Contact the owner as soon as possible and refer to the rental terms. Keep a record of the item condition and the details of what happened.',
    },
    {
      q: 'How do I list my gear and start earning?',
      a: 'Choose "Create Item", add photos and details, set your rental rates and deposit, then publish. Renters can request your listing once it is available.',
    },
    {
      q: 'Can I extend my rental period mid-booking?',
      a: 'Contact the owner before your agreed return time to discuss an extension. Any change depends on the owner and updated booking terms.',
    },
  ];

  return (
    <div className="space-y-16 py-12">
      {/* ========================================================
          1. HOW S-RENT WORKS (#how-it-works)
          ======================================================== */}
      <section id="how-it-works" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-gradient-to-b from-gray-50/80 to-white rounded-3xl p-8 sm:p-12 border border-gray-100">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider mb-3 border border-red-200">
              <Sparkles size={13} className="text-red-500" />
              <span>Simple 3-Step Process</span>
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-red-700 tracking-tight">
              How s-rent works
            </h2>
            <p className="text-sm sm:text-base text-gray-600 mt-2">
              Browse listings, request your dates, and coordinate the rental details directly with the owner.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Step 1 */}
            <div className="relative bg-white rounded-2xl p-7 border border-red-100/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-red-500/30 mb-5">
                1
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Find & Request Gear</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Explore nearby listings, compare their details, select your dates, and send a rental request.
                </p>
              </div>
              <div className="text-xs font-bold text-red-600 flex items-center gap-1">
                <Search size={14} />
                <span>Zero upfront browsing fees</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="relative bg-white rounded-2xl p-7 border border-red-100/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-red-500/30 mb-5">
                2
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Coordinate with the Owner</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Once your request is approved, agree on pickup, payment, and handover details with the owner.
                </p>
              </div>
              <div className="text-xs font-bold text-red-600 flex items-center gap-1">
                <Handshake size={14} />
                <span>Confirm the details directly</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="relative bg-white rounded-2xl p-7 border border-red-100/80 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow">
              <div className="w-12 h-12 rounded-2xl bg-red-600 text-white font-extrabold text-xl flex items-center justify-center shadow-lg shadow-red-500/30 mb-5">
                3
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">Return & Confirm</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">
                  Return the equipment as agreed, confirm its condition with the owner, and follow the deposit terms for your booking.
                </p>
              </div>
              <div className="text-xs font-bold text-red-600 flex items-center gap-1">
                <RotateCcw size={14} />
                <span>Agree return and deposit terms</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          2. RENTAL ESSENTIALS (#guarantee)
          ======================================================== */}
      <section id="guarantee" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="rounded-3xl bg-gradient-to-br from-red-600 to-red-700 text-white p-8 sm:p-14 shadow-xl shadow-red-600/15 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-white/10 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold uppercase tracking-wider mb-4 backdrop-blur-sm">
              <CheckCircle2 size={16} />
              <span>Rental essentials</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4 leading-tight">
              Know the details before you book
            </h2>

            <p className="text-red-50 text-base sm:text-lg mb-8 leading-relaxed">
              Review the listing, rates, deposit, and availability, then confirm pickup and return arrangements with the owner.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <PackageCheck size={22} className="text-white mb-2" />
                <h4 className="font-bold text-base mb-1">Clear Listing Details</h4>
                <p className="text-xs text-red-100">
                  Check the rate, deposit, condition, and availability before you send a request.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <Handshake size={22} className="text-white mb-2" />
                <h4 className="font-bold text-base mb-1">Coordinate Directly</h4>
                <p className="text-xs text-red-100">
                  Confirm pickup, payment, and return arrangements with the owner.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15">
                <Handshake size={22} className="text-white mb-2" />
                <h4 className="font-bold text-base mb-1">Agree on the Terms</h4>
                <p className="text-xs text-red-100">
                  Confirm rental dates, pickup details, and deposit return expectations before handover.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================
          3. FAQ's SECTION (#faqs)
          ======================================================== */}
      <section id="faqs" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider mb-3 border border-red-200">
            <HelpCircle size={13} className="text-red-500" />
            <span>Got Questions?</span>
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-red-700 tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm sm:text-base text-gray-600 mt-2">
            Everything you need to know about renting gear and listing your equipment on s-rent.
          </p>
        </div>

        <div className="space-y-3.5">
          {faqs.map((faq, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-red-100/90 overflow-hidden shadow-sm transition-all"
            >
              <button
                type="button"
                onClick={() => toggleFaq(idx)}
                className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 hover:text-red-600 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-red-600"
                aria-expanded={openFaq === idx}
                aria-controls={`faq-answer-${idx}`}
              >
                <span className="text-sm sm:text-base pr-4">{faq.q}</span>
                <ChevronDown
                  size={18}
                  className={`text-red-600 flex-shrink-0 transition-transform duration-200 ${
                    openFaq === idx ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {openFaq === idx && (
                <div
                  id={`faq-answer-${idx}`}
                  className="px-5 pb-5 pt-1 text-sm text-gray-600 leading-relaxed border-t border-gray-50 bg-red-50/20"
                >
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================
          4. CONTACT & SUPPORT SECTION (#contact)
          ======================================================== */}
      <section id="contact" className="scroll-mt-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="bg-white rounded-3xl border-2 border-red-100 p-8 sm:p-12 shadow-md flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider mb-2 border border-red-200">
              <Mail size={13} className="text-red-500" />
              <span>We're Here to Help</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">
              Need assistance with a rental?
            </h3>
            <p className="text-sm sm:text-base text-gray-600 max-w-xl">
              Reach our support team by email for help with your account or a rental.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <a
              href="mailto:support@s-rent.com"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md shadow-red-500/20 transition-all"
            >
              <Mail size={16} />
              <span>support@s-rent.com</span>
            </a>

            <Link
              to="/items"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold text-sm transition-all"
            >
              <span>Explore Marketplace</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TrustAndGuarantee;
