import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { addToCart } from '../store/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [isAdding, setIsAdding] = useState(false);
  const [showToast, setShowToast] = useState(false);

  const preview =
    typeof product.description === 'string'
      ? product.description.slice(0, 80)
      : '';

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/signup');
      return;
    }

    setIsAdding(true);
    try {
      await dispatch(addToCart(product.id, 1));
      setShowToast(true);
      window.setTimeout(() => setShowToast(false), 2200);
    } catch {
      alert('Failed to add to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div style={{ position: 'relative', height: '100%' }}>
      <article className="card-3d flex-center" style={{ 
        flexDirection: 'column', 
        height: '100%', 
        padding: 0,
        gap: 0,
        justifyContent: 'flex-start'
      }}>
        {/* Product Image */}
        <div style={{ 
          width: '100%', 
          height: '240px', 
          overflow: 'hidden', 
          position: 'relative',
          backgroundColor: 'var(--bg-surface-elevated)'
        }}>
          <img 
            src={product.imageUrl || 'https://via.placeholder.com/600x400'} 
            alt={product.name} 
            loading="lazy" 
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'transform var(--transition-slow)'
            }}
            onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.1)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
          />
        </div>

        {/* Product Details */}
        <div style={{ 
          padding: 'var(--space-6)', 
          display: 'flex', 
          flexDirection: 'column', 
          flex: 1, 
          width: '100%' 
        }}>
          <div style={{
            fontSize: '0.75rem',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            color: 'var(--accent-primary)',
            marginBottom: 'var(--space-2)'
          }}>
            {product.category || 'General'}
          </div>
          <h3 className="h3" style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>
            {product.name}
          </h3>
          <p className="text-muted" style={{ fontSize: '0.9rem', marginBottom: 'var(--space-4)', flex: 1 }}>
            {preview}{preview.length >= 80 ? '…' : ''}
          </p>

          <div className="flex-between" style={{ marginTop: 'auto' }}>
            <span style={{ 
              fontSize: '1.5rem', 
              fontWeight: '800', 
              background: 'linear-gradient(135deg, var(--text-primary), var(--text-muted))',
              WebkitBackgroundClip: 'text',
              color: 'transparent'
            }}>
              ${Number(product.price).toFixed(2)}
            </span>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleAddToCart}
              disabled={isAdding}
              style={{ padding: 'var(--space-2) var(--space-4)' }}
            >
              {isAdding ? 'Adding...' : 'Add to cart'}
            </button>
          </div>
        </div>
      </article>

      {/* Toast Notification */}
      {showToast && (
        <div className="glass-panel animate-fade-in" style={{
          position: 'absolute',
          bottom: 'var(--space-4)',
          left: '50%',
          transform: 'translateX(-50%)',
          padding: 'var(--space-2) var(--space-4)',
          color: 'white',
          background: 'rgba(16, 185, 129, 0.9)',
          borderRadius: 'var(--radius-full)',
          fontWeight: '600',
          fontSize: '0.9rem',
          zIndex: 10,
          whiteSpace: 'nowrap'
        }}>
          ✅ Added to cart
        </div>
      )}
    </div>
  );
};

export default ProductCard;