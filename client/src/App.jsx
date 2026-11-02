import { Component } from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute, AdminRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { AlertCircle, Search, Home as HomeIcon } from 'lucide-react';

// Public Pages
import Home from './pages/Home';
import Browse from './pages/Browse';
import ItemDetails from './pages/ItemDetails';
import Login from './pages/Login';
import Signup from './pages/Signup';
import VerifyOTP from './pages/VerifyOTP';
import AdminLogin from './pages/AdminLogin';

// Protected User Pages
import CreateItem from './pages/CreateItem';
import UserDashboard from './pages/UserDashboard';
import Profile from './pages/Profile';

// Protected SuperAdmin Pages
import AdminDashboard from './pages/AdminDashboard';
import AdminCategories from './pages/AdminCategories';

// Error Boundary to prevent blank screen crashes
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
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

// 404 Not Found Page Component (Zero emojis, Lucide icon)
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

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <BrowserRouter>
          <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            {/* Sticky Navigation Bar */}
            <Navbar />

            {/* Main Application Routes */}
            <main style={{ flex: 1 }}>
              <Routes>
                {/* 1. Public Routes (Accessible without login) */}
                <Route path="/" element={<Home />} />
                <Route path="/items" element={<Browse />} />
                <Route path="/browse" element={<Browse />} />
                <Route path="/items/:id" element={<ItemDetails />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/verify-otp" element={<VerifyOTP />} />
                <Route path="/admin/login" element={<AdminLogin />} />

                {/* 2. Protected Registered User Routes */}
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

                {/* 3. Protected SuperAdmin Routes */}
                <Route
                  path="/admin/dashboard"
                  element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  }
                />
                <Route
                  path="/admin/categories"
                  element={
                    <AdminRoute>
                      <AdminCategories />
                    </AdminRoute>
                  }
                />

                {/* 4. Fallback 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>

            {/* Shared Footer */}
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;
