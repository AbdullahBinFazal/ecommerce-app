import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Signup from './pages/Signup';
import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import ProtectedRoute from './components/ProtectedRoute';
import { getCurrentUser } from './store/authSlice';
import { fetchCart } from './store/cartSlice';

function RoutesShell() {
  const location = useLocation();

  return (
    <div className="app-wrapper">
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <Navbar />
      <main key={location.pathname} className="main-content">
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/cart" element={<Cart />} />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin"
            element={
              <ProtectedRoute requireAdmin>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getCurrentUser());
    dispatch(fetchCart());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <RoutesShell />
    </BrowserRouter>
  );
}

export default App;