import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="footer-wrapper">
      <div className="container">

        <div className="footer-grid">

          {/* Brand Column */}
          <div className="footer-col">
            <Link to="/" className="navbar-brand">
              <span className="navbar-logo-mark">🛒</span>
              ShopHub
            </Link>
            <p className="p-large" style={{ fontSize: '0.9rem', maxWidth: '240px' }}>
              The future of e-commerce. Premium quality, seamless experience, and unmatched design.
            </p>
          </div>

          {/* Shop */}
          <div className="footer-col">
            <h3>Shop</h3>
            <div className="footer-links">
              <Link to="/products">All Products</Link>
              <Link to="/categories/electronics">Electronics</Link>
              <Link to="/categories/clothing">Clothing</Link>
              <Link to="/categories/accessories">Accessories</Link>
            </div>
          </div>

          {/* Company */}
          <div className="footer-col">
            <h3>Company</h3>
            <div className="footer-links">
              <Link to="/about">About Us</Link>
              <Link to="/careers">Careers</Link>
              <Link to="/blog">Blog</Link>
              <Link to="/press">Press</Link>
            </div>
          </div>

          {/* Support */}
          <div className="footer-col">
            <h3>Support</h3>
            <div className="footer-links">
              <Link to="/help">Help Center</Link>
              <Link to="/shipping">Shipping Policy</Link>
              <Link to="/returns">Returns &amp; Refunds</Link>
              <Link to="/contact">Contact Us</Link>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} ShopHub. All rights reserved.</p>
          <div className="footer-links" style={{ flexDirection: 'row', gap: '1.5rem' }}>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms of Service</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
