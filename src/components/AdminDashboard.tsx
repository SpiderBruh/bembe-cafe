import { useState, useEffect, useRef } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  doc, 
  deleteDoc,
  addDoc,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage, handleFirestoreError, OperationType } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  CalendarCheck, 
  Coffee as CoffeeIcon, 
  LogOut, 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  XSquare,
  ChevronRight,
  CreditCard,
  Image as ImageIcon,
  Loader2,
  X,
  Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Product } from '@/lib/db-utils';

// Types
interface Stats {
  totalOrdersToday: number;
  pendingBookings: number;
  revenueToday: number;
}

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'bookings' | 'inventory'>('overview');
  const [orders, setOrders] = useState<any[]>([]);
  const [bookings, setBookings] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [stats, setStats] = useState<Stats>({ totalOrdersToday: 0, pendingBookings: 0, revenueToday: 0 });
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Listen for Orders
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
      
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const todayOrders = ordersData.filter((o: any) => o.createdAt?.toDate() >= today);
      setStats(prev => ({
        ...prev,
        totalOrdersToday: todayOrders.length,
        revenueToday: todayOrders.reduce((acc, o: any) => acc + o.total, 0)
      }));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'orders'));
    return () => unsubscribe();
  }, []);

  // Listen for Bookings
  useEffect(() => {
    const q = query(collection(db, 'bookings'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookingsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setBookings(bookingsData);
      setStats(prev => ({
        ...prev,
        pendingBookings: bookingsData.filter((b: any) => b.status === 'pending').length
      }));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'bookings'));
    return () => unsubscribe();
  }, []);

  // Listen for Products
  useEffect(() => {
    const q = query(collection(db, 'products'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    }, (err) => handleFirestoreError(err, OperationType.LIST, 'products'));
    return () => unsubscribe();
  }, []);

  return (
    <div className="min-h-screen bg-[#FDFCFB] flex">
      {/* Sidebar */}
      <aside className="w-64 bg-[#1A1A1A] text-warm-white sticky top-0 h-screen flex flex-col p-6 shadow-2xl z-50">
        <div className="mb-12 px-2">
          <h2 className="font-display text-2xl font-bold italic text-primary">Bembe Admin</h2>
          <p className="text-[10px] uppercase tracking-[0.3em] text-warm-white/30 font-sans font-black mt-1">Management Suite</p>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard size={20} />} label="Overview" />
          <SidebarLink active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBag size={20} />} label="Orders" />
          <SidebarLink active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} icon={<CalendarCheck size={20} />} label="Bookings" />
          <SidebarLink active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<CoffeeIcon size={20} />} label="Inventory" />
        </nav>

        <button 
          onClick={() => window.location.href = '/'}
          className="mt-auto flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-warm-white/60 transition-all font-bold text-xs uppercase tracking-widest"
        >
          <LogOut size={16} /> Exit to Site
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-12 flex justify-between items-end border-b border-border-warm/30 pb-8">
            <div>
              <h1 className="text-4xl font-display font-bold italic capitalize text-text-deep tracking-tight">{activeTab}</h1>
              <p className="text-text-deep/40 text-sm mt-1">Artisan operations management.</p>
            </div>
            <div className="flex gap-4">
               {activeTab === 'inventory' && (
                 <Button onClick={() => { setEditingProduct(null); setIsProductModalOpen(true); }} className="bg-primary hover:bg-primary-dark text-warm-white rounded-full px-6 py-5 font-bold tracking-widest uppercase text-[10px] tinted-shadow">
                   <Plus className="mr-2 size-3" /> New Product
                 </Button>
               )}
            </div>
          </header>

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'overview' && (
                <div className="space-y-12">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <StatCard icon={<ShoppingBag className="text-primary" />} label="Orders Today" value={stats.totalOrdersToday} />
                    <StatCard icon={<CalendarCheck className="text-accent" />} label="Pending Bookings" value={stats.pendingBookings} />
                    <StatCard icon={<CreditCard className="text-primary/60" />} label="Revenue Today" value={`£${stats.revenueToday.toFixed(2)}`} />
                  </div>

                  <div className="bg-white rounded-3xl border border-border-warm shadow-sm overflow-hidden">
                    <div className="p-8 border-b border-border-warm flex justify-between items-center">
                      <h3 className="font-display text-xl font-bold italic">Live Order Feed</h3>
                      <Button variant="ghost" onClick={() => setActiveTab('orders')} className="text-xs uppercase tracking-widest font-bold">See Full Log</Button>
                    </div>
                    <div className="divide-y divide-border-warm/50">
                      {orders.slice(0, 5).map(order => (
                        <div key={order.id} className="p-8 flex justify-between items-center bg-white hover:bg-[#FDFCFB] transition-colors group">
                          <div className="flex gap-6 items-center">
                            <div className={`size-14 rounded-2xl flex items-center justify-center font-bold text-xs tracking-tighter ${order.status === 'new' ? 'bg-primary text-warm-white' : 'bg-[#FDFCFB] text-text-deep/30'}`}>
                              {order.status === 'new' ? 'NEW' : '...'}
                            </div>
                            <div>
                              <p className="font-bold text-lg text-text-deep">{order.customerName}</p>
                              <p className="text-xs text-text-deep/40 font-sans tracking-wide uppercase mt-1">{order.type} • {order.items.length} items • £{order.total.toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-6">
                            <span className={`text-[10px] font-bold px-3 py-1 rounded-full tracking-widest ${getStatusStyle(order.status)}`}>
                              {order.status.toUpperCase()}
                            </span>
                            <ChevronRight size={20} className="text-text-deep/10 group-hover:text-primary transition-colors" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'orders' && <OrdersTab orders={orders} />}
              {activeTab === 'bookings' && <BookingsTab bookings={bookings} />}
              {activeTab === 'inventory' && (
                <InventoryTab 
                  products={products} 
                  onEdit={(p) => { setEditingProduct(p); setIsProductModalOpen(true); }} 
                />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Product Modal (Full CRUD) */}
      <AnimatePresence>
        {isProductModalOpen && (
          <ProductModal 
            product={editingProduct} 
            onClose={() => setIsProductModalOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

/* ── Product Editor Modal (CRUD + Image Upload) ── */
const ProductModal = ({ product, onClose }: { product: Product | null, onClose: () => void }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [imageUploadError, setImageUploadError] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<Product>>(
    product || {
      name: '',
      description: '',
      category: 'Coffee & Drinks',
      price: 0,
      imageUrl: '',
      available: true,
      allergens: '',
      order: 0
    }
  );

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImageUploadError(null); // Clear previous errors
    setIsUploading(true);
    try {
      const storageRef = ref(storage, `pastries/${Date.now()}-${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const url = await getDownloadURL(snapshot.ref);
      setFormData(prev => ({ ...prev, imageUrl: url }));
    } catch (error: any) {
      console.error("Image upload error:", error); // Log for debugging
      setImageUploadError(error.message || 'Failed to upload image.');
      handleFirestoreError(error, OperationType.WRITE, 'storage');
    } finally {
      setIsUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (product?.id) {
        // Update
        await updateDoc(doc(db, 'products', product.id), {
          ...formData,
          updatedAt: serverTimestamp()
        });
      } else {
        // Create
        await addDoc(collection(db, 'products'), {
          ...formData,
          createdAt: serverTimestamp(),
          available: true
        });
      }
      onClose();
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'products');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
        className="absolute inset-0 bg-text-deep/40"
      />
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-card rounded-3xl shadow-lg w-full max-w-2xl relative z-10 overflow-hidden flex flex-col md:flex-row"
      >
        {/* Left: Image Selection */}
        <div className="md:w-1/2 bg-background-soft p-10 flex flex-col items-center justify-center">
          <div className="relative w-full aspect-square bg-white rounded-2xl border-2 border-dashed border-border-warm overflow-hidden flex flex-col items-center justify-center group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
            {isUploading ? (
              <Loader2 className="animate-spin text-primary size-10" />
            ) : formData.imageUrl ? (
              <img src={formData.imageUrl} className="w-full h-full object-cover" />
            ) : (
              <div className="text-center p-6">
                <ImageIcon className="mx-auto size-12 text-text-deep/10 group-hover:text-primary/40 transition-colors mb-4" />
                <p className="text-[10px] font-bold uppercase tracking-widest text-text-deep/30">Upload Pastry Photo</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
          </div>
          {imageUploadError && (
            <p className="text-red-500 text-xs mt-2">{imageUploadError}</p>
          )}
          <p className="text-[10px] text-text-deep/20 mt-4 text-center leading-relaxed">Artisan standard: Use high-quality, desaturated, or natural lighting photography.</p>
        </div>

        {/* Right: Form */}
        <div className="md:w-1/2 p-10">
          <header className="flex justify-between items-center mb-8">
            <h3 className="font-display text-2xl font-bold italic">{product ? 'Edit Selection' : 'Add Selection'}</h3>
            <button onClick={onClose} className="text-text-deep/20 hover:text-text-deep"><X size={20} /></button>
          </header>

          <form onSubmit={handleSave} className="space-y-6">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-deep/40">Product Name</label>
              <input 
                required 
                type="text" 
                className="w-full bg-background-soft border-b border-border-warm py-2 focus:border-primary outline-none transition-colors text-sm"
                value={formData.name}
                onChange={e => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-deep/40">Price (£)</label>
                <input 
                  required 
                  type="number" 
                  step="0.01"
                  className="w-full bg-background-soft border-b border-border-warm py-2 focus:border-primary outline-none transition-colors text-sm"
                  value={formData.price}
                  onChange={e => setFormData({...formData, price: parseFloat(e.target.value)})}
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-text-deep/40">Category</label>
                <select 
                  className="w-full bg-background-soft border-b border-border-warm py-2 focus:border-primary outline-none transition-colors text-sm cursor-pointer"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option>Coffee & Drinks</option>
                  <option>Food & Brunch</option>
                  <option>Cakes & Pastries</option>
                  <option>Specials</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-deep/40">Allergens</label>
              <input 
                type="text" 
                placeholder="e.g. Nuts, Milk, Gluten"
                className="w-full bg-background-soft border-b border-border-warm py-2 focus:border-primary outline-none transition-colors text-sm"
                value={formData.allergens}
                onChange={e => setFormData({...formData, allergens: e.target.value})}
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-text-deep/40">Description</label>
              <textarea 
                className="w-full bg-background-soft border-b border-border-warm py-2 focus:border-primary outline-none transition-colors text-sm resize-none"
                rows={2}
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <Button 
              type="submit" 
              disabled={isSaving || isUploading}
              className="w-full bg-primary hover:bg-primary-dark text-warm-white py-6 rounded-2xl font-bold tracking-[0.2em] uppercase text-xs tinted-shadow mt-4"
            >
              {isSaving ? 'Saving Artisan File...' : product ? 'Update Selection' : 'Create Selection'}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

/* ── Tabs Content ── */
const OrdersTab = ({ orders }: { orders: any[] }) => {
  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'orders');
    }
  };

  return (
    <div className="grid grid-cols-1 gap-8">
      {orders.map(order => (
        <div key={order.id} className="bg-white p-10 rounded-3xl border border-border-warm shadow-sm relative overflow-hidden flex flex-col lg:flex-row gap-10">
          <div className={`absolute top-0 left-0 w-1 h-full ${order.status === 'new' ? 'bg-primary/50' : 'bg-border-warm/30'}`} />
          
          <div className="flex-1">
            <header className="flex items-center gap-6 mb-8">
              <h3 className="font-display text-2xl font-bold italic text-text-deep">#{order.id.slice(-6).toUpperCase()}</h3>
              <div className="h-[1px] w-12 bg-border-warm" />
              <span className={`text-[9px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                {order.status}
              </span>
              <span className="text-[10px] text-text-deep/30 font-sans ml-auto italic">
                {order.createdAt?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              <div className="space-y-6">
                <section>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-text-deep/30 mb-2 font-sans">Customer Presence</p>
                  <p className="font-bold text-lg">{order.customerName}</p>
                  <p className="text-sm text-text-deep/50">{order.customerPhone}</p>
                </section>
                <section className="bg-background-soft p-4 rounded-2xl border border-border-warm/50">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-text-deep/30 mb-1 font-sans">{order.type === 'collect' ? 'Pick-up Window' : 'Arrival Path'}</p>
                  <p className="text-sm font-bold">
                    {order.type === 'collect' ? order.pickupTime : `${order.deliveryAddress.street}, ${order.deliveryAddress.postcode}`}
                  </p>
                </section>
              </div>

              <div>
                <p className="text-[9px] font-bold uppercase tracking-widest text-text-deep/30 mb-4 font-sans">Artisan Selection</p>
                <ul className="space-y-3">
                  {order.items.map((item: any, i: number) => (
                    <li key={i} className="flex justify-between text-sm border-b border-border-warm/30 pb-2">
                      <span className="text-text-deep/60">{item.qty}x <span className="text-text-deep font-bold">{item.name}</span></span>
                      <span className="font-bold">£{(item.price * item.qty).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-6 flex justify-between items-baseline">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-text-deep/30">Total</span>
                  <span className="text-2xl font-display font-bold italic text-primary">£{order.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex lg:flex-col gap-3 min-w-[160px] justify-center">
            {['preparing', 'ready', 'completed', 'cancelled'].map(status => (
              <button 
                key={status}
                onClick={() => updateStatus(order.id, status)}
                className={`px-6 py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border-2 ${order.status === status ? 'bg-primary border-primary text-warm-white shadow-lg scale-[1.02]' : 'bg-transparent border-border-warm/30 text-text-deep/30 hover:border-primary/40 hover:text-text-deep'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

const BookingsTab = ({ bookings }: { bookings: any[] }) => {
  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'bookings', id), { status });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'bookings');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-border-warm shadow-sm overflow-hidden">
      <table className="w-full text-left">
        <thead className="bg-background-soft">
          <tr>
            <th className="p-8 font-bold uppercase text-[9px] tracking-[0.3em] text-text-deep/40 font-sans">Schedule</th>
            <th className="p-8 font-bold uppercase text-[9px] tracking-[0.3em] text-text-deep/40 font-sans">Guest Details</th>
            <th className="p-8 font-bold uppercase text-[9px] tracking-[0.3em] text-text-deep/40 font-sans text-center">Party Size</th>
            <th className="p-8 font-bold uppercase text-[9px] tracking-[0.3em] text-text-deep/40 font-sans">Status</th>
            <th className="p-8 font-bold uppercase text-[9px] tracking-[0.3em] text-text-deep/40 font-sans text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-warm/50">
          {bookings.map(b => (
            <tr key={b.id} className="hover:bg-[#FDFCFB]/50 transition-colors">
              <td className="p-8">
                <p className="font-bold text-text-deep">{b.date}</p>
                <div className="flex items-center gap-2 text-text-deep/40 mt-1">
                  <Clock size={12} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{b.time}</span>
                </div>
              </td>
              <td className="p-8">
                <p className="font-bold text-text-deep">{b.name}</p>
                <p className="text-xs text-text-deep/40 mt-1 font-sans">{b.phone}</p>
              </td>
              <td className="p-8 text-center">
                <span className="bg-[#FDFCFB] px-4 py-1.5 rounded-xl border border-border-warm font-bold text-sm text-primary">
                  {b.guests}
                </span>
              </td>
              <td className="p-8">
                <span className={`px-3 py-1 rounded-full text-[9px] font-bold tracking-widest ${getStatusStyle(b.status)}`}>
                  {b.status.toUpperCase()}
                </span>
              </td>
              <td className="p-8 text-right">
                <div className="flex gap-2 justify-end">
                  <button onClick={() => updateStatus(b.id, 'confirmed')} className="size-10 flex items-center justify-center bg-green-50 text-green-600 rounded-xl hover:bg-green-600 hover:text-white transition-all"><Check size={18} /></button>
                  <button onClick={() => updateStatus(b.id, 'cancelled')} className="size-10 flex items-center justify-center bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all"><X size={18} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const InventoryTab = ({ products, onEdit }: { products: Product[], onEdit: (p: Product) => void }) => {
  const toggleAvailable = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'products', id), { available: !current });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'products');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Destroy this artisan selection permanently?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'products');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-border-warm shadow-sm overflow-hidden">
       <table className="w-full text-left">
        <thead className="bg-background-soft">
          <tr>
            <th className="p-8 font-bold uppercase text-[9px] tracking-[0.3em] text-text-deep/40 font-sans">Artisan Selection</th>
            <th className="p-8 font-bold uppercase text-[9px] tracking-[0.3em] text-text-deep/40 font-sans">Category</th>
            <th className="p-8 font-bold uppercase text-[9px] tracking-[0.3em] text-text-deep/40 font-sans">Price</th>
            <th className="p-8 font-bold uppercase text-[9px] tracking-[0.3em] text-text-deep/40 font-sans">Stock Status</th>
            <th className="p-8 font-bold uppercase text-[9px] tracking-[0.3em] text-text-deep/40 font-sans text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-warm/50">
          {products.map(p => (
            <tr key={p.id} className="hover:bg-[#FDFCFB]/50 transition-colors group">
              <td className="p-8 flex items-center gap-6">
                <div className="size-16 rounded-2xl overflow-hidden shadow-sm shrink-0 border border-border-warm/30">
                  <img src={p.imageUrl} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" />
                </div>
                <div>
                  <p className="font-bold text-text-deep text-lg">{p.name}</p>
                  <p className="text-[10px] text-text-deep/30 font-sans mt-1 uppercase tracking-widest">{p.allergens || 'No Allergens'}</p>
                </div>
              </td>
              <td className="p-8">
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/5 border border-primary/10 px-3 py-1 rounded-full">
                  {p.category}
                </span>
              </td>
              <td className="p-8 font-bold font-display italic text-lg text-text-deep">£{p.price.toFixed(2)}</td>
              <td className="p-8">
                <button 
                  onClick={() => toggleAvailable(p.id!, p.available)}
                  className={`px-4 py-1.5 rounded-full text-[9px] font-bold tracking-widest transition-all ${p.available ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-red-50 text-red-600 border border-red-200'}`}
                >
                  {p.available ? 'IN STOCK' : 'OUT OF STOCK'}
                </button>
              </td>
              <td className="p-8 text-right">
                <div className="flex gap-2 justify-end">
                  <button onClick={() => onEdit(p)} className="size-10 flex items-center justify-center bg-[#FDFCFB] text-text-deep/40 rounded-xl border border-border-warm/50 hover:bg-primary hover:text-white hover:border-primary transition-all"><Edit2 size={16} /></button>
                  <button onClick={() => deleteProduct(p.id!)} className="size-10 flex items-center justify-center bg-[#FDFCFB] text-red-300 rounded-xl border border-border-warm/50 hover:bg-red-600 hover:text-white hover:border-red-600 transition-all"><Trash2 size={16} /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
       </table>
    </div>
  );
};

/* ── Helpers ── */
const SidebarLink = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all font-bold text-xs uppercase tracking-[0.2em] ${active ? 'bg-primary text-warm-white' : 'text-warm-white/30 hover:bg-white/5 hover:text-warm-white'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const StatCard = ({ icon, label, value }: any) => (
  <div className="bg-white p-10 rounded-3xl border border-border-warm shadow-sm flex flex-col gap-6 relative overflow-hidden group">
    <div className="absolute top-0 right-0 p-8 text-text-deep/5 opacity-0 group-hover:opacity-100 transition-opacity">
       {icon}
    </div>
    <div className="size-14 rounded-2xl flex items-center justify-center bg-[#FDFCFB] text-2xl border border-border-warm/50">
      {icon}
    </div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-text-deep/30 mb-2 font-sans">{label}</p>
      <p className="text-4xl font-display font-bold text-text-deep italic">{value}</p>
    </div>
  </div>
);

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'new': case 'pending': return 'bg-primary text-warm-white shadow-lg shadow-primary/20';
    case 'preparing': return 'bg-amber-50 text-amber-600 border border-amber-100';
    case 'ready': case 'confirmed': return 'bg-green-50 text-green-600 border border-green-100';
    case 'completed': return 'bg-[#FDFCFB] text-text-deep/30 border border-border-warm/50';
    case 'cancelled': return 'bg-red-50 text-red-600 border border-red-100';
    default: return 'bg-[#FDFCFB] text-text-deep/30';
  }
};
