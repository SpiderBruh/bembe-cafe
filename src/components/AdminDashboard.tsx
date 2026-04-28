import { useState, useEffect } from 'react';
import { 
  collection, 
  onSnapshot, 
  query, 
  orderBy, 
  updateDoc, 
  doc, 
  deleteDoc,
  where 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '@/lib/firebase';
import { motion, AnimatePresence } from 'motion/react';
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
  TrendingUp,
  CreditCard
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

  // Listen for Orders
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ordersData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
      
      // Calculate daily stats
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
    <div className="min-h-screen bg-background-soft flex">
      {/* Sidebar */}
      <aside className="w-64 bg-text-deep text-warm-white sticky top-0 h-screen flex flex-col p-6 shadow-2xl">
        <div className="mb-12">
          <h2 className="font-display text-2xl font-bold italic text-primary">Bembe Admin</h2>
        </div>

        <nav className="flex-1 space-y-2">
          <SidebarLink active={activeTab === 'overview'} onClick={() => setActiveTab('overview')} icon={<LayoutDashboard />} label="Overview" />
          <SidebarLink active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<ShoppingBag />} label="Orders" />
          <SidebarLink active={activeTab === 'bookings'} onClick={() => setActiveTab('bookings')} icon={<CalendarCheck />} label="Bookings" />
          <SidebarLink active={activeTab === 'inventory'} onClick={() => setActiveTab('inventory')} icon={<CoffeeIcon />} label="Menu Management" />
        </nav>

        <button 
          onClick={() => window.location.href = '/'}
          className="mt-auto flex items-center gap-3 p-3 rounded-xl hover:bg-white/10 text-warm-white/60 transition-all font-bold"
        >
          <LogOut className="size-5" /> Back to Site
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-6xl mx-auto">
          <header className="mb-10 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-display font-bold italic capitalize">{activeTab}</h1>
              <p className="text-text-deep/50">Welcome back to your dashboard.</p>
            </div>
            <div className="flex gap-4">
               {activeTab === 'inventory' && <Button className="bg-primary"><Plus className="mr-2" /> Add Product</Button>}
            </div>
          </header>

          {activeTab === 'overview' && (
            <div className="space-y-10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <StatCard icon={<ShoppingBag className="text-primary" />} label="Orders Today" value={stats.totalOrdersToday} />
                <StatCard icon={<CalendarCheck className="text-accent" />} label="Pending Bookings" value={stats.pendingBookings} />
                <StatCard icon={<CreditCard className="text-green-600" />} label="Revenue Today" value={`£${stats.revenueToday.toFixed(2)}`} />
              </div>

              {/* Recent Orders Overview */}
              <div className="bg-white rounded-3xl border border-border-warm shadow-sm overflow-hidden">
                <div className="p-6 border-b border-border-warm flex justify-between items-center">
                  <h3 className="font-bold text-lg">Live Order Feed</h3>
                  <Button variant="ghost" onClick={() => setActiveTab('orders')}>See All</Button>
                </div>
                <div className="divide-y divide-border-warm">
                  {orders.slice(0, 5).map(order => (
                    <div key={order.id} className="p-6 flex justify-between items-center bg-white hover:bg-background-soft transition-colors">
                      <div className="flex gap-4 items-center">
                        <div className={`size-12 rounded-full flex items-center justify-center font-bold text-sm ${order.status === 'new' ? 'bg-primary text-warm-white' : 'bg-background-soft text-text-deep/40'}`}>
                          {order.status === 'new' ? 'NEW' : '...'}
                        </div>
                        <div>
                          <p className="font-bold">{order.customerName}</p>
                          <p className="text-xs text-text-deep/50">{order.type.toUpperCase()} • {order.items.length} items • £{order.total.toFixed(2)}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${getStatusStyle(order.status)}`}>
                          {order.status.toUpperCase()}
                        </span>
                        <ChevronRight className="size-5 text-text-deep/20" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'orders' && <OrdersTab orders={orders} />}
          {activeTab === 'bookings' && <BookingsTab bookings={bookings} />}
          {activeTab === 'inventory' && <InventoryTab products={products} />}
        </div>
      </main>
    </div>
  );
};

const SidebarLink = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all font-bold ${active ? 'bg-primary text-warm-white' : 'text-warm-white/50 hover:bg-white/5 hover:text-warm-white'}`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const StatCard = ({ icon, label, value }: any) => (
  <div className="bg-white p-8 rounded-3xl border border-border-warm shadow-sm flex items-center gap-6">
    <div className="size-16 rounded-2xl flex items-center justify-center bg-background-soft text-2xl">
      {icon}
    </div>
    <div>
      <p className="text-xs font-bold uppercase tracking-widest text-text-deep/40 mb-1">{label}</p>
      <p className="text-3xl font-display font-bold text-text-deep">{value}</p>
    </div>
  </div>
);

const OrdersTab = ({ orders }: { orders: any[] }) => {
  const updateStatus = async (id: string, status: string) => {
    try {
      await updateDoc(doc(db, 'orders', id), { status });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'orders');
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6">
        {orders.map(order => (
          <div key={order.id} className="bg-white p-8 rounded-3xl border border-border-warm shadow-sm relative overflow-hidden">
            <div className={`absolute top-0 left-0 w-2 h-full ${order.status === 'new' ? 'bg-accent' : 'bg-primary'}`} />
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-4">
                  <h3 className="text-xl font-bold font-display italic">#{order.orderId}</h3>
                  <span className={`px-3 py-1 rounded-full font-bold text-[10px] ${getStatusStyle(order.status)}`}>
                    {order.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-text-deep/40 italic">Ordered {order.createdAt?.toDate().toLocaleTimeString()}</span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs font-bold uppercase text-text-deep/40 mb-2">Customer</p>
                    <p className="font-bold">{order.customerName}</p>
                    <p className="text-sm">{order.customerPhone}</p>
                    <div className="mt-4 p-3 bg-background-soft rounded-lg border border-border-warm">
                       <p className="text-xs font-bold uppercase text-text-deep/40 mb-1">{order.type === 'collect' ? 'Collection Time' : 'Delivery Address'}</p>
                       <p className="text-sm">
                         {order.type === 'collect' ? order.pickupTime : `${order.deliveryAddress.street}, ${order.deliveryAddress.postcode}`}
                       </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase text-text-deep/40 mb-2">Order Items</p>
                    <ul className="space-y-2">
                       {order.items.map((item: any, i: number) => (
                         <li key={i} className="flex justify-between text-sm border-b border-border-warm pb-1 border-dashed">
                           <span>{item.qty}x {item.name}</span>
                           <span className="font-bold">£{(item.price * item.qty).toFixed(2)}</span>
                         </li>
                       ))}
                    </ul>
                    <div className="flex justify-between mt-4 text-lg font-bold">
                      <span>Total</span>
                      <span className="text-accent underline decoration-primary">£{order.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                {order.notes && (
                  <div className="mt-6 p-4 bg-accent/5 rounded-xl border border-accent/20 text-sm italic">
                    Note: "{order.notes}"
                  </div>
                )}
              </div>

              <div className="flex lg:flex-col gap-3 shrink-0">
                <StatusButton label="Preparing" onClick={() => updateStatus(order.id, 'preparing')} active={order.status === 'preparing'} />
                <StatusButton label="Ready" onClick={() => updateStatus(order.id, 'ready')} active={order.status === 'ready'} />
                <StatusButton label="Completed" onClick={() => updateStatus(order.id, 'completed')} active={order.status === 'completed'} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const StatusButton = ({ label, onClick, active }: any) => (
  <button 
    onClick={onClick}
    className={`px-6 py-2 rounded-xl font-bold text-sm transition-all border-2 ${active ? 'bg-primary border-primary text-warm-white' : 'bg-transparent border-border-warm text-text-deep/50 hover:border-primary/50'}`}
  >
    {label}
  </button>
);

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
            <th className="p-6 font-bold uppercase text-[10px] tracking-widest text-text-deep/50 shrink-0">Date/Time</th>
            <th className="p-6 font-bold uppercase text-[10px] tracking-widest text-text-deep/50">Guest</th>
            <th className="p-6 font-bold uppercase text-[10px] tracking-widest text-text-deep/50 shrink-0">Guests</th>
            <th className="p-6 font-bold uppercase text-[10px] tracking-widest text-text-deep/50">Status</th>
            <th className="p-6 font-bold uppercase text-[10px] tracking-widest text-text-deep/50">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-warm">
          {bookings.map(b => (
            <tr key={b.id} className="hover:bg-background-soft/50 group">
              <td className="p-6">
                <p className="font-bold">{b.date}</p>
                <p className="text-xs text-text-deep/50">{b.time}</p>
              </td>
              <td className="p-6">
                <p className="font-bold">{b.name}</p>
                <p className="text-xs text-text-deep/50">{b.phone}</p>
              </td>
              <td className="p-6">
                <span className="bg-card px-3 py-1 rounded-lg border border-border-warm font-bold">{b.guests}</span>
              </td>
              <td className="p-6">
                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${getStatusStyle(b.status)}`}>
                  {b.status.toUpperCase()}
                </span>
              </td>
              <td className="p-6">
                <div className="flex gap-2">
                  <button onClick={() => updateStatus(b.id, 'confirmed')} className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-700 hover:text-white transition-all"><Check className="size-4" /></button>
                  <button onClick={() => updateStatus(b.id, 'cancelled')} className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-700 hover:text-white transition-all"><XSquare className="size-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const InventoryTab = ({ products }: { products: Product[] }) => {
  const toggleAvailable = async (id: string, current: boolean) => {
    try {
      await updateDoc(doc(db, 'products', id), { available: !current });
    } catch (e) {
      handleFirestoreError(e, OperationType.UPDATE, 'products');
    }
  };

  const deleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (e) {
      handleFirestoreError(e, OperationType.DELETE, 'products');
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-border-warm shadow-sm overflow-hidden text-sm">
       <table className="w-full text-left">
        <thead className="bg-background-soft">
          <tr>
            <th className="p-6 font-bold uppercase text-[10px] tracking-widest text-text-deep/50">Details</th>
            <th className="p-6 font-bold uppercase text-[10px] tracking-widest text-text-deep/50">Category</th>
            <th className="p-6 font-bold uppercase text-[10px] tracking-widest text-text-deep/50">Price</th>
            <th className="p-6 font-bold uppercase text-[10px] tracking-widest text-text-deep/50">Status</th>
            <th className="p-6 font-bold uppercase text-[10px] tracking-widest text-text-deep/50">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border-warm">
          {products.map(p => (
            <tr key={p.id}>
              <td className="p-6 flex items-center gap-4">
                <img src={p.imageUrl} className="size-12 rounded-lg object-cover" />
                <p className="font-bold">{p.name}</p>
              </td>
              <td className="p-6">
                <span className="text-[10px] font-bold uppercase text-primary bg-primary/10 px-2 py-1 rounded">
                  {p.category}
                </span>
              </td>
              <td className="p-6 font-bold">£{p.price.toFixed(2)}</td>
              <td className="p-6">
                <button 
                  onClick={() => toggleAvailable(p.id!, p.available)}
                  className={`px-3 py-1 rounded-full text-[10px] font-bold ${p.available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                >
                  {p.available ? 'AVAILABLE' : 'OUT OF STOCK'}
                </button>
              </td>
              <td className="p-6">
                <div className="flex gap-2">
                  <button onClick={() => deleteProduct(p.id!)} className="p-2 text-red-400 hover:text-red-700 transition-colors"><Trash2 className="size-4" /></button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
       </table>
    </div>
  );
};

const getStatusStyle = (status: string) => {
  switch (status) {
    case 'new': case 'pending': return 'bg-accent text-warm-white';
    case 'preparing': return 'bg-yellow-100 text-yellow-700';
    case 'ready': case 'confirmed': return 'bg-green-100 text-green-700';
    case 'completed': return 'bg-background-soft text-text-deep/50';
    case 'cancelled': return 'bg-red-100 text-red-700';
    default: return 'bg-background-soft text-text-deep/50';
  }
};
