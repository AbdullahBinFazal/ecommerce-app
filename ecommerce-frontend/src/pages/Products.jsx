import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';
import { useSearchParams } from 'react-router-dom';

const API_URL = 'http://localhost:5000/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    filterProducts();
  }, [searchTerm, selectedCategory, products]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/products`);
      setProducts(response.data);
      setFilteredProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get(`${API_URL}/products/categories/all`);
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const filterProducts = () => {
    let filtered = [...products];
    
    if (searchTerm) {
      filtered = filtered.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory) {
      filtered = filtered.filter(product => 
        product.category === selectedCategory
      );
    }
    
    setFilteredProducts(filtered);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="container" style={{ padding: 'var(--space-12) var(--container-padding)' }}>
      <h1 className="h1" style={{ marginBottom: 'var(--space-8)', textAlign: 'center' }}>
        Our Products
      </h1>
      
      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ 
        display: 'flex', 
        gap: 'var(--space-4)', 
        marginBottom: 'var(--space-12)',
        flexWrap: 'wrap',
        padding: 'var(--space-4)',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            flex: '1',
            minWidth: '200px',
            outline: 'none',
            fontSize: '1rem'
          }}
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={{
            padding: 'var(--space-3) var(--space-4)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            background: 'var(--bg-surface)',
            color: 'var(--text-primary)',
            outline: 'none',
            fontSize: '1rem',
            cursor: 'pointer'
          }}
        >
          <option value="">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
        
        {selectedCategory && (
          <button
            onClick={() => setSelectedCategory('')}
            className="btn btn-secondary"
          >
            Clear Filter
          </button>
        )}
      </div>
      
      {filteredProducts.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: 'var(--space-12)' }}>
          <h3 className="h3 text-muted">No products found.</h3>
          <p style={{ marginTop: 'var(--space-2)' }}>Try adjusting your search or category filters.</p>
        </div>
      ) : (
        <div className="grid-cols-auto">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Products;