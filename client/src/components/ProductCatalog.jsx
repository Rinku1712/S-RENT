import { Link } from 'react-router-dom';
import { ArrowRight, Package, RefreshCw, Sparkles } from 'lucide-react';
import ItemCard from './ItemCard';

const ProductCatalog = ({
  items = [],
  title = 'Recently listed items',
  loading = false,
  error = '',
  onRetry,
}) => (
  <section className="mx-auto w-full max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
    <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-red-100 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-700">
          <Sparkles size={13} aria-hidden="true" />
          <span>Community listings</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
          {title}
        </h2>
        <p className="mt-1 text-sm text-gray-600 sm:text-base">
          Find equipment listed by people in your community.
        </p>
      </div>

      <Link
        to="/items"
        className="inline-flex min-h-10 items-center gap-2 self-start text-sm font-semibold text-red-700 transition-colors hover:text-red-800 sm:self-auto"
      >
        <span>Browse all items</span>
        <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>

    {loading ? (
      <div
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        aria-label="Loading items"
        aria-busy="true"
      >
        {[1, 2, 3].map((item) => (
          <div key={item} className="animate-pulse rounded-2xl border border-gray-200 bg-white p-3">
            <div className="aspect-[4/3] rounded-xl bg-gray-100" />
            <div className="mt-4 h-4 w-3/4 rounded bg-gray-100" />
            <div className="mt-2 h-4 w-1/2 rounded bg-gray-100" />
          </div>
        ))}
        <span className="sr-only">Loading recently listed items</span>
      </div>
    ) : error ? (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center sm:p-8" role="alert">
        <p className="font-semibold text-gray-900">{error}</p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800"
          >
            <RefreshCw size={15} aria-hidden="true" />
            Try again
          </button>
        )}
      </div>
    ) : items.length > 0 ? (
      <div className="grid grid-cols-1 items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {items.slice(0, 6).map((item) => (
          <ItemCard key={item._id} item={item} />
        ))}
      </div>
    ) : (
      <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-5 py-12 text-center sm:px-8">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm">
          <Package size={22} aria-hidden="true" />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">No listings to show yet</h3>
        <p className="mx-auto mt-2 max-w-md text-sm text-gray-600">
          Browse the marketplace to see what is available, or check back as new items are listed.
        </p>
        <Link
          to="/items"
          className="mt-5 inline-flex min-h-10 items-center justify-center rounded-lg bg-red-700 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-800"
        >
          Explore the marketplace
        </Link>
      </div>
    )}
  </section>
);

export default ProductCatalog;
