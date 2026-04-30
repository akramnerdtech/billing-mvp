import React, { useState, useEffect } from 'react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Search, ShoppingCart, LayoutGrid, ChevronLeft } from 'lucide-react';
import { ProductCard } from '../components/billing/ProductCard';
import { CartItem } from '../components/billing/CartItem';
import { PriceSummary } from '../components/billing/PriceSummary';

const Billing = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  // Mobile tab: 'products' | 'cart'
  const [mobileTab, setMobileTab] = useState('products');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data } = await api.get('/products');
      setProducts(data);
    } catch (err) {
      toast.error('Failed to load product catalog');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    if (product.quantity <= 0) {
      toast.error('Insufficient stock available');
      return;
    }

    const existing = cart.find(item => item.product === product._id);
    if (existing) {
      if (existing.quantity >= product.quantity) {
        toast.error(`Stock limited to ${product.quantity} units`);
        return;
      }
      setCart(cart.map(item =>
        item.product === product._id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, {
        product: product._id,
        name: product.name,
        price: product.price,
        imageUrl: product.imageUrl,
        quantity: 1,
        maxQ: product.quantity
      }]);
    }
  };

  const updateQuantity = (id, delta) => {
    setCart(cart.map(item => {
      if (item.product === id) {
        const newQ = item.quantity + delta;
        if (newQ > item.maxQ) {
          toast.error(`Max stock is ${item.maxQ}`);
          return item;
        }
        if (newQ <= 0) return item;
        return { ...item, quantity: newQ };
      }
      return item;
    }));
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.product !== id));
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setSubmitting(true);

    try {
      const total = calculateTotal();
      await api.post('/orders', { items: cart, total });

      toast.success('Order processed successfully');
      setCart([]);
      setMobileTab('products');
      fetchProducts();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <span className="h-8 w-8 animate-spin rounded-full border-4 border-white/10 border-t-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] lg:h-[calc(100vh-4rem)]">

      {/* ── Mobile Tab Bar ─────────────────────────────────────────── */}
      <div className="lg:hidden flex bg-[#111827] border-b border-white/10 shrink-0">
        <button
          onClick={() => setMobileTab('products')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
            mobileTab === 'products'
              ? 'text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-400 border-b-2 border-transparent hover:text-white'
          }`}
        >
          <LayoutGrid size={16} /> Products
        </button>
        <button
          onClick={() => setMobileTab('cart')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors relative ${
            mobileTab === 'cart'
              ? 'text-blue-400 border-b-2 border-blue-500'
              : 'text-gray-400 border-b-2 border-transparent hover:text-white'
          }`}
        >
          <ShoppingCart size={16} /> Cart
          {cart.length > 0 && (
            <span className="absolute top-2 right-[calc(50%-28px)] h-5 w-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center shadow-[0_0_8px_rgba(59,130,246,0.6)]">
              {cart.length}
            </span>
          )}
        </button>
      </div>

      {/* ── Main Content ───────────────────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 flex-1 min-h-0 pt-4 lg:pt-0">

        {/* LEFT PANE: Product Catalog */}
        <div className={`flex-1 flex flex-col min-w-0 bg-[#0B1220] ${mobileTab === 'products' ? 'flex' : 'hidden'} lg:flex`}>

          {/* Search */}
          <div className="relative mb-4 lg:mb-6">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-500">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full bg-[#111827] border border-white/10 focus:border-blue-500 rounded-lg pl-12 pr-4 py-3 text-white placeholder:text-gray-500 outline-none transition-colors"
            />
          </div>

          {/* Product Grid */}
          <div className="flex-1 overflow-y-auto pr-1 pb-6 custom-scrollbar">
            {filteredProducts.length === 0 ? (
              <div className="h-full flex items-center justify-center text-gray-500 flex-col gap-4">
                <LayoutGrid size={48} className="text-gray-700 opacity-50" />
                <p className="text-sm font-medium uppercase tracking-widest">No products found</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 lg:gap-4">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    onAddToCart={() => {
                      handleAddToCart(product);
                      // Auto-switch to cart tab on mobile when item added
                      // (optional: uncomment below)
                      // setMobileTab('cart');
                    }}
                  />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT PANE: Cart & Checkout */}
        <div className={`w-full lg:w-[380px] xl:w-[420px] flex flex-col bg-[#111827] rounded-xl border border-white/10 shrink-0 overflow-hidden shadow-lg ${mobileTab === 'cart' ? 'flex' : 'hidden'} lg:flex`}>

          {/* Cart Header */}
          <div className="p-4 lg:p-5 border-b border-white/10 flex items-center gap-3 bg-white/5">
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h3 className="font-bold text-white text-lg leading-tight">Current Order</h3>
              <p className="text-gray-400 text-xs">{cart.length} items selected</p>
            </div>
          </div>

          {/* Cart Items */}
          <div className="flex-1 overflow-y-auto p-4 lg:p-5 custom-scrollbar">
            {cart.length === 0 ? (
              <div className="h-full flex items-center justify-center flex-col gap-3 text-gray-500">
                <ShoppingCart size={32} className="opacity-50" />
                <p className="text-sm font-medium">Cart is empty</p>
              </div>
            ) : (
              <div className="space-y-4 lg:space-y-5">
                {cart.map((item) => (
                  <CartItem
                    key={item.product}
                    item={item}
                    onUpdateQuantity={updateQuantity}
                    onRemove={removeFromCart}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Checkout Summary */}
          <PriceSummary
            subtotal={calculateTotal()}
            tax={0}
            total={calculateTotal()}
            onCheckout={handleCheckout}
            submitting={submitting}
            disabled={cart.length === 0}
          />
        </div>
      </div>
    </div>
  );
};

export default Billing;
