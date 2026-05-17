const Loader = () => (
  <div className="loader-wrap page-transition">
    <div style={{ display: 'grid', placeItems: 'center', gap: 12 }}>
      <div className="loader-ring" aria-hidden />
      <span className="text-muted shimmer" style={{ padding: '0.35rem 1rem', fontSize: '0.95rem', fontWeight: 600 }}>
        Loading brilliance…
      </span>
      <span className="sr-only">Loading</span>
    </div>
  </div>
);

export default Loader;