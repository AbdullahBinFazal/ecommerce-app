import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { updateCartItem, removeFromCart, clearCart } from '../store/cartSlice';
import Loader from '../components/Loader';

const Cart = () => {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((state) => state.cart);

  const updateQuantity = (id, quantity) => {
    if (quantity < 1) return;
    dispatch(updateCartItem(id, quantity));
  };

  const removeItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const clearAll = () => {
    if (window.confirm('Clear everything from your cart?')) {
      dispatch(clearCart());
    }
  };

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const tax = subtotal * 0.1;
  const total = subtotal + tax;

  if (loading) {
    return <Loader />;
  }

  if (items.length === 0) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'var(--space-16)' }}>
        <h1 className="h2" style={{ marginBottom: 'var(--space-4)', textAlign: 'center' }}>Your cart awaits ✨</h1>
        <p className="p-large text-muted" style={{ marginBottom: 'var(--space-8)', textAlign: 'center', maxWidth: 500 }}>
          Add items to unlock free shipping tiers and perks.
        </p>
        <Link to="/products" className="btn btn-primary">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ paddingTop: 'var(--space-8)' }}>
      <div className="container" style={{ paddingBottom: 'var(--space-24)' }}>
        {/* Page Header */}
        <div style={{ marginBottom: 'var(--space-16)' }}>
          <h1 className="h1" style={{ marginBottom: 'var(--space-2)' }}>Shopping cart</h1>
          <p className="text-muted">You have {items.length} item{items.length !== 1 ? 's' : ''} in your cart</p>
        </div>

        {/* Main Grid: Items + Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 2fr) 1fr', gap: 'var(--space-8)', alignItems: 'start' }}>
          {/* Cart Items Column */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              {items.map((item) => (
                <div key={item.id} className="glass-panel" style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: 'var(--space-6)', alignItems: 'start', padding: 'var(--space-6)' }}>
                  {/* Product Image */}
                  <img
                    src={item.imageUrl || 'https://via.placeholder.com/140'}
                    alt={item.productName}
                    style={{
                      width: '100%',
                      aspectRatio: '1',
                      objectFit: 'cover',
                      borderRadius: 'var(--radius-md)',
                    }}
                  />

                  {/* Product Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', justifyContent: 'space-between', height: '100%' }}>
                    <div>
                      <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: 'var(--space-2)', color: 'var(--text-primary)' }}>
                        {item.productName}
                      </h3>
                      <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
                        ${Number(item.price).toFixed(2)} each
                      </p>
                    </div>

                    {/* Quantity & Remove */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', backgroundColor: 'rgba(255, 255, 255, 0.05)', borderRadius: 'var(--radius-full)', padding: '0.4rem 0.6rem' }}>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            width: '1.5rem',
                            height: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'color var(--transition-fast)',
                          }}
                          onMouseEnter={(e) => (e.target.style.color = 'var(--accent-primary)')}
                          onMouseLeave={(e) => (e.target.style.color = 'var(--text-primary)')}
                        >
                          −
                        </button>
                        <span style={{ minWidth: '2rem', textAlign: 'center', fontWeight: 600, color: 'var(--text-primary)' }}>
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          style={{
                            background: 'none',
                            border: 'none',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            width: '1.5rem',
                            height: '1.5rem',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            transition: 'color var(--transition-fast)',
                          }}
                          onMouseEnter={(e) => (e.target.style.color = 'var(--accent-primary)')}
                          onMouseLeave={(e) => (e.target.style.color = 'var(--text-primary)')}
                        >
                          +
                        </button>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Line total</p>
                          <p style={{ fontSize: '1.25rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="btn btn-secondary"
                          style={{ padding: '0.5rem 1rem', fontSize: '0.9rem', whiteSpace: 'nowrap' }}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <button
              type="button"
              onClick={clearAll}
              style={{
                marginTop: 'var(--space-6)',
                padding: 'var(--space-3) var(--space-6)',
                background: 'transparent',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-secondary)',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                fontSize: '0.95rem',
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--accent-secondary)';
                e.target.style.color = 'var(--accent-secondary)';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'var(--border-subtle)';
                e.target.style.color = 'var(--text-secondary)';
              }}
            >
              Clear cart
            </button>
          </div>

          {/* Order Summary Sidebar */}
          <div className="glass-panel" style={{ position: 'sticky', top: '100px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: 'var(--space-6)', color: 'var(--text-primary)' }}>
              Order summary
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginBottom: 'var(--space-6)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Subtotal</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  ${subtotal.toFixed(2)}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>Estimated tax (10%)</span>
                <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>
                  ${tax.toFixed(2)}
                </span>
              </div>
            </div>

            <div style={{ height: '1px', background: 'var(--border-subtle)', marginBottom: 'var(--space-6)' }} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-8)' }}>
              <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>Total</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 800, background: 'linear-gradient(135deg, var(--accent-primary), var(--accent-secondary))', WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent' }}>
                ${total.toFixed(2)}
              </span>
            </div>

            <Link to="/checkout" style={{ textDecoration: 'none' }}>
              <button className="btn btn-primary" style={{ width: '100%' }}>
                Proceed to checkout
              </button>
            </Link>

            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: 'var(--space-4)', textAlign: 'center' }}>
              Free shipping on orders over $100
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;