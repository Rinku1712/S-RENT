import { useState, useEffect, useCallback } from 'react';
import { getCommonDashboard } from '../services/dashboardService';
import { getCategories } from '../services/categoryService';
import HeroSection from '../components/HeroSection';
import CategoryExplorer from '../components/CategoryExplorer';
import ProductCatalog from '../components/ProductCatalog';
import Testimonials from '../components/Testimonials';
import TrustAndGuarantee from '../components/TrustAndGuarantee';

/**
 * s-rent Production-Ready Homepage
 * Fully responsive, red-and-white theme, modular component hierarchy.
 */
const Home = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dashboardError, setDashboardError] = useState('');

  const fetchHomeData = useCallback(async () => {
    setLoading(true);
    setDashboardError('');

    const [dashboardResult, categoriesResult] = await Promise.allSettled([
      getCommonDashboard(),
      getCategories(),
    ]);

    if (dashboardResult.status === 'fulfilled' && dashboardResult.value?.success && dashboardResult.value?.data) {
      setDashboardData(dashboardResult.value.data);
    } else {
      const error = dashboardResult.status === 'rejected' ? dashboardResult.reason : null;
      if (error) console.error('Error loading homepage listings:', error);
      setDashboardData(null);
      setDashboardError('Featured items could not be loaded. Please try again.');
    }

    if (categoriesResult.status === 'fulfilled' && categoriesResult.value?.data) {
      setCategories(categoriesResult.value.data);
    } else if (categoriesResult.status === 'rejected') {
      console.error('Error loading homepage categories:', categoriesResult.reason);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#1F2937]">
      {/* 1. Hero Section with Banner Container, Red Vector Illustrations & Search */}
      <HeroSection />

      {/* 2. Category Explorer ("Or browse our most popular categories...") */}
      <CategoryExplorer categories={categories} />

      {/* 3. Product Catalog Grid ("Recently active items in St James's, Westminster") */}
      <ProductCatalog
        items={dashboardData?.recentItems || []}
        loading={loading}
        error={dashboardError}
        onRetry={fetchHomeData}
        title="Recently listed items"
      />

      {/* 4. Testimonials Section ("Here's what some of our users think") */}
      <Testimonials />

      {/* 5. Trust, How It Works, Guarantee & FAQ Anchor Sections */}
      <TrustAndGuarantee />
    </div>
  );
};

export default Home;
