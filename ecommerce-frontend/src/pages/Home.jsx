import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import heroBg from '../assets/hero-bg.jpg';

const WORDS_TO_TYPE = ['effortlessly.', 'in style.', 'with confidence.', 'today.'];

const Home = () => {
  const categories = [
    {
      name: 'Electronics',
      image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=400&q=80',
    },
    {
      name: 'Clothing',
      image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400&q=80',
    },
    {
      name: 'Home',
      image: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&q=80',
    },
    {
      name: 'Accessories',
      image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&q=80',
    },
    {
      name: 'Footwear',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80',
    },
  ];

  const [typed, setTyped] = useState('');
  const [wordIndex, setWordIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const current = WORDS_TO_TYPE[wordIndex];
    const speed = deleting ? 45 : 95;

    const id = window.setTimeout(() => {
      if (!deleting) {
        const next = current.slice(0, charIndex + 1);
        setTyped(next);
        if (next === current) {
          window.setTimeout(() => setDeleting(true), 950);
        } else {
          setCharIndex(charIndex + 1);
        }
      } else {
        const next = current.slice(0, charIndex - 1);
        setTyped(next);
        if (next === '') {
          setDeleting(false);
          setWordIndex((w) => (w + 1) % WORDS_TO_TYPE.length);
          setCharIndex(0);
        } else {
          setCharIndex(charIndex - 1);
        }
      }
    }, speed);

    return () => window.clearTimeout(id);
  }, [charIndex, deleting, wordIndex]);

  const features = [
    { icon: '🚚', title: 'Free Shipping', desc: 'On orders over $50' },
    { icon: '🛡️', title: 'Secure Checkout', desc: 'Encryption you can trust' },
    { icon: '🔄', title: 'Easy Returns', desc: '30-day hassle-free policy' },
    { icon: '🎧', title: '24/7 Support', desc: 'Real humans, real answers' },
  ];

  return (
    <div>
      {/* ═══ PREMIUM HERO SECTION WITH BACKGROUND ═══ */}
      <section
        className="hero-section"
        style={{
          backgroundImage: `url(${heroBg})`,
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div className="container" style={{ textAlign: 'center', position: 'relative', zIndex: 2 }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            {/* Badge */}
            <div
              style={{
                display: 'inline-block',
                padding: 'var(--space-2) var(--space-4)',
                background: 'rgba(18, 18, 23, 0.7)',
                backdropFilter: 'blur(16px)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-full)',
                color: 'var(--text-secondary)',
                fontSize: '0.85rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                marginBottom: 'var(--space-6)',
              }}
            >
              🎯 Premium Marketplace
            </div>

            {/* Main Heading with Typing Animation */}
            <h1
              className="h1"
              style={{
                marginBottom: 'var(--space-6)',
                textShadow: '0 2px 20px rgba(0,0,0,0.5)',
              }}
            >
              Shop the future <br />
              <span className="text-gradient-accent">{typed}</span>
              <span
                style={{
                  marginLeft: '0.3rem',
                  animation: 'blink 1s infinite',
                  display: 'inline-block',
                }}
              >
                |
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="p-large"
              style={{
                marginBottom: 'var(--space-8)',
                maxWidth: '650px',
                marginInline: 'auto',
                textShadow: '0 1px 10px rgba(0,0,0,0.4)',
              }}
            >
              Curated products, luminous UI, checkout that feels effortless. Built for founders who refuse to look generic.
            </p>

            {/* CTA Buttons */}
            <div className="flex-center" style={{ gap: 'var(--space-4)', flexWrap: 'wrap' }}>
              <Link to="/products" className="btn btn-primary hover-lift">
                Explore Products →
              </Link>
              <Link to="/signup" className="btn btn-secondary hover-lift">
                Join ShopHub
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ REST OF CONTENT ═══ */}
      <div className="container">

        {/* Features Section */}
        <section style={{ padding: 'var(--space-12) 0' }}>
          <h2 className="h2" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            Built for discerning shoppers
          </h2>
          <div className="grid-cols-auto">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="card-3d glass-panel hover-lift"
                style={{ textAlign: 'center', padding: 'var(--space-8)' }}
              >
                <div style={{ fontSize: '3rem', marginBottom: 'var(--space-4)' }}>
                  {feature.icon}
                </div>
                <h3 className="h3" style={{ fontSize: '1.25rem', marginBottom: 'var(--space-2)' }}>
                  {feature.title}
                </h3>
                <p className="text-muted">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Categories Section */}
        <section style={{ padding: 'var(--space-12) 0 var(--space-24)' }}>
          <h2 className="h2" style={{ textAlign: 'center', marginBottom: 'var(--space-12)' }}>
            Shop by category
          </h2>
          <div
            className="grid-cols-auto"
            style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}
          >
            {categories.map((category) => (
              <Link
                key={category.name}
                to={`/products?category=${encodeURIComponent(category.name)}`}
                className="card-3d hover-lift"
                style={{
                  height: '180px',
                  textDecoration: 'none',
                  position: 'relative',
                  overflow: 'hidden',
                  borderRadius: 'var(--radius-lg)',
                  display: 'block',
                }}
              >
                {/* Background Image */}
                <img
                  src={category.image}
                  alt={category.name}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.08)')}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
                />

                {/* Dark gradient overlay */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)',
                    zIndex: 1,
                  }}
                />

                {/* Category Label */}
                <span
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    left: 0,
                    right: 0,
                    textAlign: 'center',
                    zIndex: 2,
                    fontSize: '1.2rem',
                    fontWeight: '700',
                    color: '#ffffff',
                    textShadow: '0 2px 8px rgba(0,0,0,0.6)',
                    letterSpacing: '0.5px',
                  }}
                >
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;