import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { auth, db } from './lib/firebase';
import { seedProducts, Product } from './lib/db-utils';

// Public Components
import Hero from './components/ui/hero';
import { Navbar } from './components/Navbar';
import { TrustMarquee } from './components/TrustMarquee';
import { CommunityGallery } from './components/CommunityGallery';
import { AboutStrip } from './components/AboutStrip';
import { OrderSystem } from './components/OrderSystem';
import { ReviewsSection } from './components/ReviewsSection';
import { BookingSection } from './components/BookingSection';
import { Footer } from './components/Footer';
import { StickyCTA } from './components/StickyCTA';

// Admin Components
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';

function SocialWidgets() {
  return (
    <div className="fixed bottom-20 md:bottom-24 right-4 md:right-8 z-40 flex flex-col gap-3 items-end">
      {/* Facebook Messenger */}
      <a
        href="https://www.facebook.com/messages/t/514122318457122"
        target="_blank"
        rel="noopener noreferrer"
        className="group cursor-pointer relative"
        aria-label="Message us on Facebook Messenger"
      >
        <div className="relative p-3 bg-[#0084FF] rounded-full tinted-shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200">
          <svg viewBox="0 0 24 24" fill="white" className="size-5">
            <path d="M12 2C6.477 2 2 6.145 2 11.243c0 2.907 1.45 5.497 3.72 7.193V22l3.405-1.868c.907.252 1.869.388 2.875.388 5.523 0 10-4.145 10-9.243S17.523 2 12 2zm.994 12.468l-2.54-2.71-4.96 2.71 5.454-5.79 2.603 2.71 4.896-2.71-5.453 5.79z" />
          </svg>
        </div>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-text-deep text-warm-white text-[10px] font-bold uppercase tracking-widest rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap font-sans pointer-events-none">
          Messenger
        </div>
      </a>

      {/* WhatsApp */}
      <a
        href="https://wa.me/441612605799?text=Hi%20Bembe!"
        target="_blank"
        rel="noopener noreferrer"
        className="group cursor-pointer relative"
        aria-label="Chat with us on WhatsApp"
      >
        <div className="relative p-3 bg-[#25D366] rounded-full tinted-shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200">
          <svg viewBox="0 0 24 24" fill="white" className="size-5">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          <div className="absolute inset-0 rounded-full bg-[#25D366]/30 animate-ping" style={{ animationDuration: '3s' }} />
        </div>
        <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-text-deep text-warm-white text-[10px] font-bold uppercase tracking-widest rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap font-sans pointer-events-none">
          WhatsApp
        </div>
      </a>
    </div>
  );
}

/* ── Skeleton Shimmer Loader (taste §3 Rule 5) ── */
function LoadingScreen() {
  return (
    <div className="min-h-[100dvh] bg-background flex flex-col items-center justify-center gap-6 px-6">
      <div className="w-48 h-1 rounded-full overflow-hidden bg-border-warm/30">
        <div className="h-full w-1/2 bg-gradient-to-r from-transparent via-primary/60 to-transparent animate-shimmer" />
      </div>
      <h2 className="font-display text-xl italic text-primary/60">Bembe Cafe</h2>
    </div>
  );
}

function MainSite() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    seedProducts();
    const q = query(collection(db, 'products'), orderBy('order', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProducts(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product)));
    });
    return () => unsubscribe();
  }, []);

  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="min-h-[100dvh] bg-background">
      <Navbar cartCount={cartCount} onCartClick={() => setIsCartOpen(true)} />

      {/* ── Conversion-Optimized Section Order ── */}
      {/* 1. Hero — first impression */}
      <Hero />

      {/* 2. Trust Marquee — immediate social proof */}
      <TrustMarquee />

      {/* 3. Gallery — emotional hook ("I want to be there") */}
      <CommunityGallery />

      {/* 4. About — builds connection + context */}
      <AboutStrip />

      {/* 5. Menu — they're primed and ready to browse */}
      <OrderSystem
        products={products}
        cart={cart}
        setCart={setCart}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
      />

      {/* 6. Reviews — social proof reinforces menu decision */}
      <ReviewsSection />

      {/* 7. Booking — CTA at peak intent */}
      <BookingSection />

      {/* 8. Footer */}
      <Footer />

      {/* Floating elements */}
      <StickyCTA />
      <SocialWidgets />
    </div>
  );
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainSite />} />
        <Route path="/admin" element={user ? <AdminDashboard /> : <Navigate to="/admin/login" />} />
        <Route path="/admin/login" element={user ? <Navigate to="/admin" /> : <AdminLogin onLogin={() => {}} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}
