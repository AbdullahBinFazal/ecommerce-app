import { useEffect, useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../store/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const cartItems = useSelector((state) => state.cart.items);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  const safeCartItems = Array.isArray(cartItems) ? cartItems : [];
  const cartCount = safeCartItems.reduce((total, item) => total + (item.quantity || 0), 0);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setMenuOpen(false);
  };

  const navLinkClass = ({ isActive }) => `nav-link${isActive ? ' active' : ''}`;

  return (
    <header className={`navbar-wrapper${scrolled ? ' scrolled' : ''}`}>
      <div className="container">
        <div className="navbar-inner">

          {/* Brand */}
          <Link to="/" className="navbar-brand" onClick={() => setMenuOpen(false)}>
            <span className="navbar-logo-mark" aria-hidden="true">🛒</span>
            ShopHub
          </Link>

          {/* Desktop Nav Links */}
          <nav className="navbar-links" aria-label="Main navigation">
            <NavLink to="/" end className={navLinkClass}>Home</NavLink>
            <NavLink to="/products" className={navLinkClass}>Products</NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navLinkClass}>Admin</NavLink>
            )}
          </nav>

          {/* Right-side Controls */}
          <div className="navbar-controls">

            <NavLink
              to="/cart"
              className="nav-link flex-center"
              onClick={() => setMenuOpen(false)}
              style={{ gap: '0.4rem', fontWeight: 600 }}
            >
              Cart
              {cartCount > 0 && (
                <span className="cart-badge bounce-once">{cartCount}</span>
              )}
            </NavLink>

            {/* Desktop Auth */}
            <div
              className="desktop-only"
              style={{
                gap: 'var(--space-4)',
                paddingLeft: 'var(--space-4)',
                borderLeft: '1px solid var(--border-subtle)',
              }}
            >
              {isAuthenticated ? (
                <>
                  <span className="text-muted" style={{ fontWeight: 500, fontSize: '0.9rem' }}>
                    Hi, {user?.name?.split(' ')[0] ?? 'User'}
                  </span>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.4rem 1rem', fontSize: '0.875rem' }}
                    onClick={handleLogout}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="nav-link">Login</Link>
                  <Link
                    to="/signup"
                    className="btn btn-primary"
                    style={{ padding: '0.45rem 1.25rem', fontSize: '0.9rem' }}
                  >
                    Sign up
                  </Link>
                </>
              )}
            </div>

            {/* Hamburger */}
            <button
              type="button"
              className={`menu-toggle${menuOpen ? ' open' : ''}`}
              aria-label="Toggle menu"
              onClick={() => setMenuOpen((prev) => !prev)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {menuOpen && (
          <div className="navbar-mobile-menu glass-panel">
            <NavLink to="/" end className={navLinkClass} onClick={() => setMenuOpen(false)}>Home</NavLink>
            <NavLink to="/products" className={navLinkClass} onClick={() => setMenuOpen(false)}>Products</NavLink>
            {user?.role === 'admin' && (
              <NavLink to="/admin" className={navLinkClass} onClick={() => setMenuOpen(false)}>Admin</NavLink>
            )}

            <hr style={{ borderColor: 'var(--border-subtle)', width: '100%', margin: 'var(--space-2) 0' }} />

            <NavLink to="/cart" className={navLinkClass} onClick={() => setMenuOpen(false)}>
              Cart {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </NavLink>

            <hr style={{ borderColor: 'var(--border-subtle)', width: '100%', margin: 'var(--space-2) 0' }} />

            {isAuthenticated ? (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-secondary" onClick={() => setMenuOpen(false)}>Login</Link>
                <Link to="/signup" className="btn btn-primary" onClick={() => setMenuOpen(false)}>Sign up</Link>
              </>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
