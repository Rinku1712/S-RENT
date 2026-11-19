import { Link } from 'react-router-dom';
import { ArrowRight, CalendarDays, PackagePlus, Search } from 'lucide-react';

const benefits = [
  {
    icon: Search,
    title: 'Find the right item',
    description:
      'Browse available listings and compare photos, pricing, availability, and location before you send a request.',
  },
  {
    icon: CalendarDays,
    title: 'Arrange the rental',
    description:
      'Choose your dates and, after approval, confirm pickup and payment details directly with the owner.',
  },
  {
    icon: PackagePlus,
    title: 'Share what you own',
    description:
      'Create a listing with photos, rental details, and pricing, then review incoming requests in your dashboard.',
  },
];

const Testimonials = () => (
  <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
    <div className="mx-auto mb-10 max-w-2xl text-center">
      <span className="mb-3 inline-flex items-center rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-700">
        How it works
      </span>
      <h2 className="text-2xl font-extrabold tracking-tight text-gray-900 sm:text-3xl lg:text-4xl">
        Rent what you need. Share what you own.
      </h2>
      <p className="mt-3 text-sm leading-relaxed text-gray-600 sm:text-base">
        Explore equipment listed by other members, or create a listing for gear you can lend.
      </p>
    </div>

    <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
      {benefits.map(({ icon: Icon, title, description }) => (
        <article
          key={title}
          className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md sm:p-7"
        >
          <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-700">
            <Icon size={21} aria-hidden="true" />
          </div>
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{description}</p>
        </article>
      ))}
    </div>

    <div className="mt-7 flex flex-col items-center justify-center gap-3 sm:flex-row">
      <Link
        to="/items"
        className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-red-700 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-red-800"
      >
        Browse items
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
      <Link
        to="/create-item"
        className="inline-flex min-h-11 items-center justify-center rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:border-gray-400 hover:bg-gray-50"
      >
        List your gear
      </Link>
    </div>
  </section>
);

export default Testimonials;
