import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Plus, Minus, X, Trash2, Clock, Truck, Store, ArrowRight, Heart, Star, CircleCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product, createOrder } from '@/lib/db-utils';

interface CartItem extends Product {
  qty: number;
}

export const OrderSystem = ({ 
  products, 
  cart, 
  setCart, 
  isCartOpen, 
  setIsCartOpen 
}: { 
  products: Product[], 
  cart: CartItem[], 
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>,
  isCartOpen: boolean,
  setIsCartOpen: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [orderType, setOrderType] = useState<'collect' | 'delivery'>('collect');
  const [isOrdering, setIsOrdering] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState<string | null>(null);

  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [pickupTime, setPickupTime] = useState('');
  const [postcode, setPostcode] = useState('');
  const [street, setStreet] = useState('');
  const [notes, setNotes] = useState('');

  const categories = ['All', 'Coffee & Drinks', 'Food & Brunch', 'Cakes & Pastries', 'Specials', 'Kid-Friendly'];
  
  const filteredProducts = activeCategory === 'All'
    ? products
    : activeCategory === 'Kid-Friendly'
      ? products.filter(p => p.kidFriendly)
      : products.filter(p => p.category === activeCategory);
  const addToCart = (product: Product) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prev, { ...product, qty: 1 }];
    });
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQty = Math.max(1, item.qty + delta);
        return { ...item, qty: newQty };
      }
      return item;
    }));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const deliveryFee = orderType === 'delivery' ? 2.50 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (!customerName || !customerEmail || !customerPhone || (orderType === 'delivery' && (!postcode || !street)) || (orderType === 'collect' && !pickupTime)) {
      alert("Please fill in all required fields.");
      return;
    }
    setIsOrdering(true);
    try {
      const orderData = {
        customerName,
        customerEmail,
        customerPhone,
        items: cart.map(item => ({ 
          productId: item.id!, 
          name: item.name, 
          price: item.price, 
          qty: item.qty 
        })),
        total,
        type: orderType,
        pickupTime: orderType === 'collect' ? pickupTime : null,
        deliveryAddress: orderType === 'delivery' ? { postcode, street } : null,
        notes
      };
      
      const docRef = await createOrder(orderData as any);
      if (docRef) {
        setOrderSuccess(docRef.id);
        setCart([]);
        setIsCartOpen(false);
      }
    } catch (error) {
    } finally {
      setIsOrdering(false);
    }
  };

  /* Stagger variants */
  const gridVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07 } },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 20 } },
    exit: { opacity: 0, scale: 0.96, transition: { duration: 0.2 } },
  };

  return (
    <section id="menu" className="relative py-28 md:py-36 bg-background overflow-hidden">
      {/* Ambient blurs — desaturated */}
      <div className="absolute top-0 right-0 w-[350px] h-[350px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-accent/4 blur-[100px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 md:px-8 relative z-10">
        {/* Section Header — asymmetric layout */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 pb-10 border-b border-border-warm">
          <div className="max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs font-bold tracking-[0.3em] uppercase text-primary mb-3 block font-sans"
            >
              Curated Selection
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05, type: 'spring', stiffness: 100, damping: 20 }}
              className="font-display text-3xl md:text-5xl font-bold text-text-deep leading-tight tracking-tight"
            >
              The Artisan{' '}
              <span className="italic text-primary">Collection.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.15 }}
            className="text-text-deep/45 max-w-xs text-base font-light leading-relaxed"
          >
            Freshly prepared, halal ingredients, and coffee crafted with boutique precision.
          </motion.p>
        </div>

        {/* Halal Trust Signal */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.2 }}
          className="flex items-center justify-center gap-3 bg-primary/5 text-primary rounded-full px-6 py-3 mb-10 text-sm font-sans font-medium tracking-wide"
        >
          <CircleCheck className="size-4 shrink-0" />
          <span>Everything on Our Menu is 100% Halal Certified</span>
        </motion.div>

        {/* Category Pills — rounded, layoutId shared transition */}
        <div className="flex flex-wrap gap-3 mb-14">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`relative px-6 py-2.5 rounded-full font-sans text-[11px] font-bold tracking-[0.15em] uppercase transition-colors duration-200 cursor-pointer ${
                activeCategory === cat
                  ? 'text-warm-white'
                  : 'text-text-deep/40 hover:text-text-deep'
              }`}
            >
              {activeCategory === cat && (
                <motion.div
                  layoutId="activeCategory"
                  className="absolute inset-0 bg-primary rounded-full z-0"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.5 }}
                />
              )}
              <span className="relative z-10">{cat}</span>
            </button>
          ))}
        </div>

        {/* Product Grid — asymmetric 2-col (no 3 equal columns — taste §7) */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10"
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((p) => (
              <motion.div
                layout
                key={p.id}
                variants={cardVariants}
                exit="exit"
                className="group relative flex flex-col sm:flex-row bg-warm-white/60 rounded-2xl border border-border-warm/40 overflow-hidden hover:border-primary/25 transition-all duration-300 tinted-shadow-sm hover:tinted-shadow cursor-pointer"
              >
                {/* Image — full color, no grayscale (anti-pattern: poor food photos) */}
                <div className="sm:w-[200px] h-[220px] sm:h-auto overflow-hidden relative shrink-0">
                  <img
                    src={p.imageUrl}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Badges */}
                  <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                    <span className="bg-warm-white/90 backdrop-blur-md text-text-deep text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest">
                      {p.category}
                    </span>
                    {filteredProducts.indexOf(p) < 2 && (
                      <span className="bg-accent/90 backdrop-blur-md text-warm-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                        <Heart className="size-2.5 fill-warm-white" /> Popular
                      </span>
                    )}
                    {filteredProducts.indexOf(p) === 2 && (
                      <span className="bg-primary/90 backdrop-blur-md text-warm-white text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-widest flex items-center gap-1.5">
                        <Star className="size-2.5 fill-warm-white" /> Staff Pick
                      </span>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 justify-between">
                  <div>
                    <div className="flex justify-between items-baseline mb-2 gap-3">
                      <h3 className="font-display text-xl font-bold text-text-deep tracking-tight">{p.name}</h3>
                      <span className="font-display text-lg text-primary font-medium italic shrink-0">
                        £{p.price.toFixed(2)}
                      </span>
                    </div>
                    <p className="text-text-deep/45 text-sm font-light leading-relaxed mb-4 line-clamp-2">
                      {p.description}
                    </p>
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-border-warm/30">
                    <div className="flex items-center gap-2 text-primary">
                      <Clock className="size-3.5" />
                      <span className="text-[10px] font-bold uppercase tracking-widest font-sans">15-20 Min</span>
                    </div>
                    <Button
                      onClick={(e) => { e.stopPropagation(); addToCart(p); }}
                      disabled={!p.available}
                      className="bg-primary hover:bg-primary-dark text-warm-white rounded-full px-5 py-2 text-[10px] font-bold tracking-widest uppercase cursor-pointer active:scale-[0.98] transition-all duration-200"
                    >
                      <Plus className="size-3 mr-1.5" /> Add
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Skeleton empty state */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-text-deep/30 font-sans tracking-widest uppercase text-xs">
              No items in this category yet
            </p>
          </div>
        )}
      </div>

      {/* ── Cart Drawer — Liquid Glass ── */}
      <AnimatePresence>
        {isCartOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsCartOpen(false)}
              className="fixed inset-0 bg-text-deep/20 backdrop-blur-sm z-[60] cursor-pointer"
            />
            <motion.div
              initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 h-full w-full max-w-md liquid-glass bg-warm-white/85 z-[70] flex flex-col"
            >
              <div className="p-8 border-b border-border-warm flex justify-between items-center">
                <div>
                  <h3 className="font-display text-2xl font-bold text-text-deep italic">Your Selection</h3>
                  <p className="text-text-deep/35 text-[10px] font-bold uppercase tracking-widest mt-0.5 font-sans">Bembe Artisan Cafe</p>
                </div>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="size-10 rounded-full border border-border-warm flex items-center justify-center hover:bg-primary hover:text-warm-white transition-all duration-200 cursor-pointer"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6">
                {cart.length === 0 ? (
                  <div className="text-center py-16 flex flex-col items-center">
                    <div className="size-20 rounded-full bg-primary/5 flex items-center justify-center mb-5">
                      <ShoppingCart className="size-8 text-primary/20" />
                    </div>
                    <p className="text-text-deep/35 font-sans tracking-widest uppercase text-xs mb-6">Your basket is feeling a little empty...</p>
                    <Button onClick={() => setIsCartOpen(false)} className="bg-primary text-warm-white rounded-full px-8 py-5 font-bold tracking-widest uppercase text-xs cursor-pointer">
                      Explore Selection
                    </Button>
                  </div>
                ) : (
                  <>
                    {/* Order type toggle */}
                    <div className="flex bg-card p-1 rounded-full border border-border-warm/50">
                      <button
                        onClick={() => setOrderType('collect')}
                        className={`flex-1 py-2.5 rounded-full flex items-center justify-center gap-2 font-sans text-[10px] font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer ${orderType === 'collect' ? 'bg-primary text-warm-white tinted-shadow-sm' : 'text-text-deep/35'}`}
                      >
                        <Store className="size-3" /> Collect
                      </button>
                      <button
                        onClick={() => setOrderType('delivery')}
                        className={`flex-1 py-2.5 rounded-full flex items-center justify-center gap-2 font-sans text-[10px] font-bold tracking-widest uppercase transition-all duration-200 cursor-pointer ${orderType === 'delivery' ? 'bg-primary text-warm-white tinted-shadow-sm' : 'text-text-deep/35'}`}
                      >
                        <Truck className="size-3" /> Delivery
                      </button>
                    </div>

                    {/* Cart items */}
                    <div className="space-y-4">
                      {cart.map(item => (
                        <div key={item.id} className="flex gap-4 items-center group">
                          <div className="size-16 rounded-xl overflow-hidden shrink-0">
                            <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-display font-bold text-base text-text-deep italic truncate">{item.name}</h4>
                            <div className="flex items-center gap-3 mt-1.5">
                              <div className="flex items-center gap-2 bg-card px-2.5 py-1 rounded-full">
                                <button onClick={() => updateQty(item.id!, -1)} className="text-text-deep/35 hover:text-primary transition-colors cursor-pointer"><Minus className="size-3" /></button>
                                <span className="text-xs font-bold w-4 text-center font-sans">{item.qty}</span>
                                <button onClick={() => updateQty(item.id!, 1)} className="text-text-deep/35 hover:text-primary transition-colors cursor-pointer"><Plus className="size-3" /></button>
                              </div>
                              <span className="text-sm font-display font-medium text-primary italic">£{(item.price * item.qty).toFixed(2)}</span>
                            </div>
                          </div>
                          <button onClick={() => removeFromCart(item.id!)} className="text-text-deep/10 hover:text-accent transition-colors cursor-pointer">
                            <Trash2 className="size-4" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Order form — labels above inputs (taste Rule 6) */}
                    <div className="p-6 bg-card rounded-2xl space-y-4">
                      <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-primary font-sans">Order Information</h4>
                      <div className="space-y-1.5">
                        <label htmlFor="cart-name" className="text-[10px] font-bold uppercase tracking-widest text-text-deep/40 font-sans">Full Name</label>
                        <input id="cart-name" type="text" className="w-full bg-transparent border-b border-border-warm py-2 font-sans text-sm tracking-wide focus:border-primary outline-none transition-colors" value={customerName} onChange={(e) => setCustomerName(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="cart-email" className="text-[10px] font-bold uppercase tracking-widest text-text-deep/40 font-sans">Email Address</label>
                        <input id="cart-email" type="email" className="w-full bg-transparent border-b border-border-warm py-2 font-sans text-sm tracking-wide focus:border-primary outline-none transition-colors" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} />
                      </div>
                      <div className="space-y-1.5">
                        <label htmlFor="cart-phone" className="text-[10px] font-bold uppercase tracking-widest text-text-deep/40 font-sans">Phone Number</label>
                        <input id="cart-phone" type="tel" className="w-full bg-transparent border-b border-border-warm py-2 font-sans text-sm tracking-wide focus:border-primary outline-none transition-colors" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} />
                      </div>
                      {orderType === 'collect' ? (
                        <div className="space-y-1.5">
                          <label htmlFor="cart-time" className="text-[10px] font-bold uppercase tracking-widest text-primary font-sans">Ready for collection by:</label>
                          <input id="cart-time" type="time" className="w-full bg-transparent border-b border-border-warm py-2 font-sans text-sm tracking-wide focus:border-primary outline-none transition-colors" value={pickupTime} onChange={(e) => setPickupTime(e.target.value)} />
                        </div>
                      ) : (
                        <>
                          <div className="space-y-1.5">
                            <label htmlFor="cart-postcode" className="text-[10px] font-bold uppercase tracking-widest text-text-deep/40 font-sans">Postcode</label>
                            <input id="cart-postcode" type="text" className="w-full bg-transparent border-b border-border-warm py-2 font-sans text-sm tracking-wide uppercase focus:border-primary outline-none transition-colors" value={postcode} onChange={(e) => setPostcode(e.target.value)} />
                          </div>
                          <div className="space-y-1.5">
                            <label htmlFor="cart-street" className="text-[10px] font-bold uppercase tracking-widest text-text-deep/40 font-sans">Street Address</label>
                            <input id="cart-street" type="text" className="w-full bg-transparent border-b border-border-warm py-2 font-sans text-sm tracking-wide focus:border-primary outline-none transition-colors" value={street} onChange={(e) => setStreet(e.target.value)} />
                          </div>
                        </>
                      )}
                      <div className="space-y-1.5">
                        <label htmlFor="cart-notes" className="text-[10px] font-bold uppercase tracking-widest text-text-deep/40 font-sans">Notes (Allergens, Special Requests)</label>
                        <textarea id="cart-notes" className="w-full bg-transparent border-b border-border-warm py-2 font-sans text-sm tracking-wide focus:border-primary outline-none resize-none transition-colors" rows={2} value={notes} onChange={(e) => setNotes(e.target.value)} />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {cart.length > 0 && (
                <div className="p-8 bg-warm-white border-t border-border-warm space-y-4">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xs font-bold tracking-widest text-text-deep/35 uppercase font-sans">Total Estimate</span>
                    <span className="text-3xl font-display font-bold text-text-deep italic">£{total.toFixed(2)}</span>
                  </div>
                  <Button
                    disabled={isOrdering}
                    onClick={handlePlaceOrder}
                    className="w-full bg-primary hover:bg-primary-dark text-warm-white rounded-full py-6 font-sans font-bold tracking-[0.2em] uppercase text-xs transition-all duration-200 tinted-shadow cursor-pointer active:scale-[0.98]"
                  >
                    {isOrdering ? 'Processing...' : 'Ready to savor?'}
                  </Button>
                  <p className="text-[10px] text-center text-text-deep/25 font-sans tracking-widest uppercase">
                    By confirming, you agree to our artisan standards.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {orderSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-text-deep/70 backdrop-blur-xl"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
              className="bg-warm-white p-10 rounded-2xl tinted-shadow-lg max-w-sm w-full text-center relative z-10"
            >
              <div className="size-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-6">
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.15 }}>
                  <Store className="size-8" />
                </motion.div>
              </div>
              <h3 className="text-3xl font-display font-bold mb-3 text-text-deep italic">Selection Received</h3>
              <p className="text-text-deep/45 mb-6 font-light leading-relaxed text-sm">
                Thank you for choosing Bembe. Your artisan order has been placed successfully.
                <span className="block font-display font-bold text-primary mt-4 text-xl tracking-tight italic">Order ID: #{orderSuccess}</span>
              </p>
              <Button onClick={() => setOrderSuccess(null)} className="w-full bg-primary text-warm-white rounded-full py-5 font-bold tracking-widest uppercase text-xs cursor-pointer">
                Back to delightful treats!
              </Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};
