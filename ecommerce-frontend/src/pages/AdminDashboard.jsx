import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

const AdminDashboard = () => {
  const { token } = useSelector((state) => state.auth);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [activeTab, setActiveTab] = useState('products');
  const [showAddModal, setShowAddModal] = useState(false);
  const [filterText, setFilterText] = useState(''); // ✅ ADDED
  const [newProduct, setNewProduct] = useState({
    name: '',
    price: '',
    description: '',
    category: '',
    imageUrl: '',
    stock: ''
  });

  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  useEffect(() => {
    fetchProducts();
    fetchUsers();
    fetchOrders();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/products`, axiosConfig);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/users`, axiosConfig);
      setUsers(res.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${API_URL}/admin/orders`, axiosConfig);
      setOrders(res.data);
    } catch (err) {
      console.error('Error fetching orders:', err);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${API_URL}/admin/products`, newProduct, axiosConfig);
      alert('Product added successfully!');
      setNewProduct({ name: '', price: '', description: '', category: '', imageUrl: '', stock: '' });
      setShowAddModal(false);
      fetchProducts();
    } catch (err) {
      alert('Error adding product');
    }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete this product?')) {
      await axios.delete(`${API_URL}/admin/products/${id}`, axiosConfig);
      fetchProducts();
    }
  };

  // ✅ ADDED: filtered products derived from state
  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(filterText.toLowerCase()) ||
    product.category.toLowerCase().includes(filterText.toLowerCase())
  );

  const getStatusColor = (status) => {
    switch(status) {
      case 'pending': return '#ffb783';
      case 'completed': return '#10b981';
      case 'shipped': return '#c0c1ff';
      default: return '#c7c4d7';
    }
  };

  const getStatusBgColor = (status) => {
    switch(status) {
      case 'pending': return 'rgba(255, 183, 131, 0.2)';
      case 'completed': return 'rgba(16, 185, 129, 0.2)';
      case 'shipped': return 'rgba(192, 193, 255, 0.2)';
      default: return 'rgba(199, 196, 215, 0.2)';
    }
  };

  const getStockColor = (stock) => {
    return stock < 20 ? '#ffb783' : '#10b981';
  };

  return (
    <div style={{
      backgroundColor: '#12121d',
      minHeight: '100vh',
      padding: '32px'
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: '32px',
          flexWrap: 'wrap',
          gap: '16px'
        }}>
          <div>
            <h1 style={{
              fontSize: '36px',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #c0c1ff, #d0bcff)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: '8px'
            }}>
              Admin Dashboard
            </h1>
            <p style={{ color: '#c7c4d7', fontSize: '16px' }}>
              Manage your retail ecosystem with precision.
            </p>
          </div>
          {activeTab === 'products' && (
            <button
              onClick={() => setShowAddModal(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #c0c1ff, #d0bcff)',
                color: '#07006c',
                border: 'none',
                borderRadius: '12px',
                fontWeight: 'bold',
                cursor: 'pointer',
                transition: 'transform 0.3s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
              onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>add</span>
              Add Product
            </button>
          )}
        </div>

        {/* Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          padding: '4px',
          background: 'rgba(31, 30, 42, 0.6)',
          borderRadius: '16px',
          width: 'fit-content',
          marginBottom: '32px',
          backdropFilter: 'blur(12px)'
        }}>
          {['products', 'users', 'orders'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 32px',
                borderRadius: '12px',
                background: activeTab === tab ? 'linear-gradient(135deg, #c0c1ff, #d0bcff)' : 'transparent',
                color: activeTab === tab ? '#07006c' : '#c7c4d7',
                border: 'none',
                fontWeight: activeTab === tab ? 'bold' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.3s'
              }}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        {/* Products Tab */}
        {activeTab === 'products' && (
          <div style={{
            background: 'rgba(27, 26, 38, 0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '20px',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '20px 24px',
              borderBottom: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#e3e0f1' }}>Inventory Management</h2>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                background: '#1f1e2a',
                padding: '8px 16px',
                borderRadius: '30px',
                boxShadow: 'inset 2px 2px 5px rgba(0,0,0,0.5), inset -1px -1px 2px rgba(255,255,255,0.02)'
              }}>
                <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#908fa0' }}>search</span>
                {/* ✅ CHANGED: connected value and onChange */}
                <input
                  type="text"
                  placeholder="Filter products..."
                  value={filterText}
                  onChange={(e) => setFilterText(e.target.value)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    color: '#e3e0f1',
                    outline: 'none',
                    width: '200px'
                  }}
                />
              </div>
            </div>
            
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'rgba(41, 41, 53, 0.5)', color: '#c7c4d7' }}>
                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Product</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Category</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Stock</th>
                    <th style={{ padding: '16px 24px', textAlign: 'left' }}>Price</th>
                    <th style={{ padding: '16px 24px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {/* ✅ CHANGED: filteredProducts instead of products */}
                  {filteredProducts.map((product) => (
                    <tr key={product.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.3s' }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.03)'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            background: '#343440',
                            overflow: 'hidden'
                          }}>
                            <img src={product.imageUrl || 'https://via.placeholder.com/40'} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          </div>
                          <span style={{ fontWeight: 500, color: '#e3e0f1' }}>{product.name}</span>
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px', color: '#c7c4d7' }}>{product.category}</td>
                      <td style={{ padding: '20px 24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <div style={{
                            width: '8px',
                            height: '8px',
                            borderRadius: '50%',
                            backgroundColor: getStockColor(product.stock)
                          }} />
                          <span style={{ color: '#e3e0f1' }}>{product.stock} Units</span>
                        </div>
                      </td>
                      <td style={{ padding: '20px 24px', fontWeight: 'bold', color: '#c0c1ff' }}>${Number(product.price).toFixed(2)}</td>
                      <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          style={{
                            padding: '8px',
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            borderRadius: '8px',
                            transition: 'background 0.3s'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(239,68,68,0.2)'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <span className="material-symbols-outlined" style={{ color: '#fca5a5', fontSize: '20px' }}>delete</span>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '24px'
          }}>
            {/* Users List */}
            <div style={{
              background: 'rgba(27, 26, 38, 0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '20px',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#e3e0f1'
              }}>
                <span className="material-symbols-outlined" style={{ color: '#d0bcff' }}>group</span>
                User Directory
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {users.map((user) => (
                  <div key={user.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <div>
                      <p style={{ fontWeight: 'bold', color: '#e3e0f1' }}>{user.name}</p>
                      <p style={{ fontSize: '12px', color: '#c7c4d7' }}>{user.email}</p>
                    </div>
                    <span style={{
                      padding: '4px 12px',
                      borderRadius: '20px',
                      background: user.role === 'admin' ? 'rgba(192,193,255,0.2)' : 'rgba(52,52,64,0.5)',
                      color: user.role === 'admin' ? '#c0c1ff' : '#c7c4d7',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Orders */}
            <div style={{
              background: 'rgba(27, 26, 38, 0.6)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(255,255,255,0.05)',
              borderRadius: '20px',
              padding: '24px'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                marginBottom: '20px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                color: '#e3e0f1'
              }}>
                <span className="material-symbols-outlined" style={{ color: '#ffb783' }}>receipt_long</span>
                Recent Orders
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px',
                    background: 'rgba(255,255,255,0.03)',
                    borderRadius: '16px',
                    border: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <div>
                      <p style={{ fontWeight: 'bold', color: '#e3e0f1' }}>Order #{order.id}</p>
                      <p style={{ fontSize: '12px', color: '#c7c4d7' }}>{order.customerName}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 'bold', color: '#c0c1ff' }}>${order.totalAmount}</p>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: getStatusBgColor(order.status),
                        color: getStatusColor(order.status),
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div style={{
            background: 'rgba(27, 26, 38, 0.6)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '20px',
            padding: '24px'
          }}>
            <h3 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              marginBottom: '20px',
              color: '#e3e0f1'
            }}>
              All Orders
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {orders.map((order) => (
                <div key={order.id} style={{
                  padding: '20px',
                  background: 'rgba(255,255,255,0.03)',
                  borderRadius: '16px',
                  border: '1px solid rgba(255,255,255,0.05)'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
                    <div>
                      <p style={{ fontWeight: 'bold', fontSize: '18px', color: '#e3e0f1' }}>Order #{order.id}</p>
                      <p style={{ color: '#c7c4d7', marginTop: '4px' }}><strong>Customer:</strong> {order.customerName}</p>
                      <p style={{ color: '#c7c4d7' }}><strong>Email:</strong> {order.customerEmail}</p>
                      <p style={{ color: '#c7c4d7' }}><strong>Address:</strong> {order.customerAddress}</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontSize: '24px', fontWeight: 'bold', color: '#c0c1ff' }}>${order.totalAmount}</p>
                      <span style={{
                        padding: '4px 12px',
                        borderRadius: '20px',
                        background: getStatusBgColor(order.status),
                        color: getStatusColor(order.status),
                        fontSize: '12px',
                        fontWeight: 'bold'
                      }}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                  <div style={{
                    marginTop: '16px',
                    paddingTop: '16px',
                    borderTop: '1px solid rgba(255,255,255,0.05)'
                  }}>
                    <p style={{ fontSize: '14px', color: '#c7c4d7' }}><strong>Items:</strong> {order.items}</p>
                    <p style={{ fontSize: '12px', color: '#908fa0', marginTop: '8px' }}>
                      Ordered on: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'rgba(27, 26, 38, 0.95)',
            backdropFilter: 'blur(12px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '32px',
            maxWidth: '500px',
            width: '90%'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#e3e0f1' }}>Add New Product</h2>
              <button
                onClick={() => setShowAddModal(false)}
                style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}
              >
                <span className="material-symbols-outlined" style={{ color: '#c7c4d7' }}>close</span>
              </button>
            </div>

            <form onSubmit={handleAddProduct}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <input
                  type="text"
                  placeholder="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#1f1e2a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#e3e0f1',
                    outline: 'none'
                  }}
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#1f1e2a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#e3e0f1',
                    outline: 'none'
                  }}
                />
                <input
                  type="text"
                  placeholder="Category"
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#1f1e2a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#e3e0f1',
                    outline: 'none'
                  }}
                />
                <input
                  type="text"
                  placeholder="Image URL"
                  value={newProduct.imageUrl}
                  onChange={(e) => setNewProduct({...newProduct, imageUrl: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#1f1e2a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#e3e0f1',
                    outline: 'none'
                  }}
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({...newProduct, stock: e.target.value})}
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#1f1e2a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#e3e0f1',
                    outline: 'none'
                  }}
                />
                <textarea
                  placeholder="Description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  rows="3"
                  style={{
                    width: '100%',
                    padding: '14px',
                    background: '#1f1e2a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '12px',
                    color: '#e3e0f1',
                    outline: 'none',
                    resize: 'none'
                  }}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  style={{
                    padding: '12px 24px',
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '12px',
                    color: '#c7c4d7',
                    cursor: 'pointer'
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: '12px 24px',
                    background: 'linear-gradient(135deg, #c0c1ff, #d0bcff)',
                    color: '#07006c',
                    border: 'none',
                    borderRadius: '12px',
                    fontWeight: 'bold',
                    cursor: 'pointer'
                  }}
                >
                  Add Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;