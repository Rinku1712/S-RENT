import { Component } from 'react';
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { WishlistProvider } from './context/WishlistContext';
import { ProtectedRoute, AdminRoute, GuestRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AdminLayout from './components/AdminLayout';
import { AlertCircle, Search, Home as HomeIcon } from 'lucide-react';

// Public Customer Pages
import Home from './pages/Home';
import Browse from './pages/Browse';
import ItemDetails from './pages/ItemDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import ForgotPassword from './pages/ForgotPassword';
import AdminLogin from './pages/AdminLogin';

// Protected Customer Pages
import CreateItem from './pages/CreateItem';
import UserDashboard from './pages/UserDashboard';
import Profile from './pages/Profile';

// Protected SuperAdmin Enterprise Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminUsers from './pages/AdminUsers';
import AdminItems from './pages/AdminItems';
import AdminRentals from './pages/AdminRentals';
import AdminCategories from './pages/AdminCategories';
import AdminSettings from './pages/AdminSettings';

// Error Boundary to prevent blank screen crashes
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Unhandled Application Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
          <div className="card" style={{ maxWidth: 500, margin: '0 auto', padding: 40 }}>
            <div className="empty-icon-circle" style={{ margin: '0 auto 16px', backgroundColor: 'var(--danger-bg)', borderColor: '#FECACA' }}>
              <AlertCircle size={32} className="text-danger" />
            </div>
            <h2>Something went wrong</h2>
            <p style={{ margin: '12px 0 24px', color: 'var(--text-secondary)' }}>
              An unexpected error occurred while loading this page.
            </p>
            <button
              onClick={() => {
                this.setState({ hasError: false });
                window.location.href = '/';
              }}
              className="btn btn-primary"
            >
              <HomeIcon size={16} />
              <span>Return to Homepage</span>
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// 404 Not Found Page Component
const NotFound = () => (
  <div className="container" style={{ padding: '80px 20px', textAlign: 'center' }}>
    <div className="card" style={{ maxWidth: 500, margin: '0 auto', padding: 40 }}>
      <div className="empty-icon-circle" style={{ margin: '0 auto 16px' }}>
        <Search size={32} className="text-muted" />
      </div>
      <h2>404 - Page Not Found</h2>
      <p style={{ margin: '12px 0 24px', color: 'var(--text-secondary)' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn btn-primary">
        <HomeIcon size={16} />
        <span>Back to Home</span>
      </Link>
    </div>
  </div>
);

// App shell with conditional customer header & footer vs dedicated admin layout
const AppContent = () => {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith('/admin');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      {/* Show Public Marketplace Navbar only for customer routes */}
      {!isAdminPath && <Navbar />}

      {/* Main Application Routes */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          {/* 1. Public Customer Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/items" element={<Browse />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/items/:id" element={<ItemDetails />} />
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <GuestRoute>
                <Signup />
              </GuestRoute>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <GuestRoute>
                <VerifyOTP />
              </GuestRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <GuestRoute>
                <ForgotPassword />
              </GuestRoute>
            }
          />

          {/* 2. Public SuperAdmin Portal Login */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* 3. Protected SuperAdmin Console Routes (Nested under AdminLayout) */}
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminLayout />
              </AdminRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="items" element={<AdminItems />} />
            <Route path="rentals" element={<AdminRentals />} />
            <Route path="categories" element={<AdminCategories />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* 4. Protected Customer Member Routes */}
          <Route
            path="/create-item"
            element={
              <ProtectedRoute>
                <CreateItem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* 5. Fallback 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Show Public Marketplace Footer only for customer routes */}
      {!isAdminPath && <Footer />}
    </div>
  );
};

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <WishlistProvider>
          <BrowserRouter>
            <AppContent />
          </BrowserRouter>
        </WishlistProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
