import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { placeOrder } from '../store/cartSlice';

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items } = useSelector((state) => state.cart);

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerAddress: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  useEffect(() => {
    if (!items.length) {
      navigate('/cart');
    }
  }, [items.length, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple validation
    if (!formData.customerName.trim()) {
      setError('Please enter your full name');
      setLoading(false);
      return;
    }
    if (!formData.customerEmail.trim()) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }
    if (!formData.customerAddress.trim()) {
      setError('Please enter your shipping address');
      setLoading(false);
      return;
    }

    try {
      const orderData = {
        ...formData,
        items,
        totalAmount: total,
      };

      // ✅ FIXED: Removed .unwrap() - now it works!
      const result = await dispatch(placeOrder(orderData));
      
      setSuccess(true);
      
      // Redirect to home after 2.5 seconds
      setTimeout(() => {
        navigate('/');
      }, 2500);
    } catch (err) {
      console.error('Order error:', err);
      setError(err?.message || 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return null;
  }

  return (
    <div style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container" style={{ paddingBottom: 'var(--space-24)' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 'var(--space-16)' }}>
          <h1 className="h1" style={{ marginBottom: 'var(--space-2)' }}>Checkout</h1>
          <p className="text-muted">Complete your purchase in just a few steps</p>
        </div>

        {/* Main Grid: Form + Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
          {/* Checkout Form */}
          <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: 'var(--space-8)' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: 'var(--space-8)', color: 'var(--text-primary)' }}>
              Shipping information
            </h2>

            {/* Full Name Field */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label htmlFor="customerName" style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
                Full name *
              </label>
              <input
                id="customerName"
                name="customerName"
                type="text"
                value={formData.customerName}
                onChange={handleChange}
                placeholder="John Doe"
                required
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all var(--transition-fast)',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-subtle)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>

            {/* Email Field */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label htmlFor="customerEmail" style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
                Email address *
              </label>
              <input
                id="customerEmail"
                name="customerEmail"
                type="email"
                value={formData.customerEmail}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all var(--transition-fast)',
                  outline: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-subtle)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>

            {/* Address Field */}
            <div style={{ marginBottom: 'var(--space-6)' }}>
              <label htmlFor="customerAddress" style={{ display: 'block', fontSize: '0.95rem', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
                Shipping address *
              </label>
              <textarea
                id="customerAddress"
                name="customerAddress"
                value={formData.customerAddress}
                onChange={handleChange}
                placeholder="123 Main Street, City, State, ZIP"
                required
                rows={4}
                style={{
                  width: '100%',
                  padding: 'var(--space-3) var(--space-4)',
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: 'var(--radius-md)',
                  color: 'var(--text-primary)',
                  fontSize: '0.95rem',
                  fontFamily: 'var(--font-sans)',
                  transition: 'all var(--transition-fast)',
                  outline: 'none',
                  resize: 'none',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'var(--accent-primary)';
                  e.target.style.backgroundColor = 'rgba(99, 102, 241, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'var(--border-subtle)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
                }}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div
                style={{
                  padding: 'var(--space-4)',
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  borderRadius: 'var(--radius-md)',
                  color: '#fca5a5',
                  fontSize: '0.9rem',
                  marginBottom: 'var(--space-6)',
                  animation: 'fadeIn var(--transition-normal) forwards',
                }}
              >
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{
                width: '100%',
                fontSize: '1rem',
                padding: 'var(--space-3) var(--space-6)',
                opacity: loading ? 0.7 : 1,
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'all var(--transition-bounce)',
              }}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 'var(--space-2)' }}>
                  <span
                    style={{
                      display: 'inline-block',
                      width: '14px',
                      height: '14px',
                      border: '2px solid rgba(255, 255, 255, 0.3)',
                      borderTopColor: '#fff',
                      borderRadius: '50%',
                      animation: 'spin 0.8s linear infinite',
                    }}
                  />
                  Placing your order…
                </span>
              ) : (
                'Place order'
              )}
            </button>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'var(--space-4)', textAlign: 'center' }}>
              Your payment and information are secure
            </p>
          </form>

          {/* Order Summary Sidebar */}
          <div className="glass-panel" style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-6)', color: 'var(--text-primary)' }}>
              Order summary
            </h3>

            {/* Order Items */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              {items.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 'var(--space-3)', borderBottom: '1px solid var(--border-subtle)' }}>
                  <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                    {item.productName} × {item.quantity}
                  </span>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }}>
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div style={{ height: '1px', background: 'var(--border-subtle)', marginBottom: 'var(--space-6)' }} />

            {/* Summary Details */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Subtotal</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Tax (10%)</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  ${tax.toFixed(2)}
                </span>
              </div>
            </div>

            <div style={{ height: '1px', background: 'var(--border-subtle)', marginBottom: 'var(--space-6)' }} />

            {/* Total */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Total</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                ${total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      {success && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.6)',
            backdropFilter: 'blur(5px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            animation: 'fadeIn var(--transition-normal) forwards',
          }}
        >
          <div
            className="glass-panel"
            style={{
              padding: 'var(--space-12)',
              textAlign: 'center',
              maxWidth: 400,
              animation: 'bounceIn var(--transition-slow) forwards',
            }}
          >
            <div
              style={{
                fontSize: '3.5rem',
                marginBottom: 'var(--space-4)',
                animation: 'bounceIn 0.6s var(--transition-bounce) forwards',
              }}
            >
              ✓
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: 'var(--space-3)', color: 'var(--text-primary)' }}>
              Thank you!
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: 'var(--space-6)' }}>
              Your order is confirmed. We're sending you a confirmation email.
            </p>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Redirecting you home in a moment…
            </p>
          </div>
        </div>
      )}

      {/* Loading spinner animation */}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Checkout;