import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight, Lock } from 'lucide-react';
import { useRef } from 'react';

export const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  /* Magnetic button — useMotionValue (taste §4, NOT useState) */
  const btnRef = useRef<HTMLButtonElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const springX = useSpring(mx, { stiffness: 150, damping: 15 });
  const springY = useSpring(my, { stiffness: 150, damping: 15 });

  const handleBtnMouseMove = (e: React.MouseEvent) => {
    if (!btnRef.current) return;
    const rect = btnRef.current.getBoundingClientRect();
    mx.set((e.clientX - rect.left - rect.width / 2) * 0.12);
    my.set((e.clientY - rect.top - rect.height / 2) * 0.12);
  };
  const handleBtnMouseLeave = () => { mx.set(0); my.set(0); };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onLogin();
    } catch (err: any) {
      setError(err.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] bg-text-deep flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient blurs — desaturated */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/8 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/6 blur-[150px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md liquid-glass bg-warm-white/5 p-10 rounded-2xl"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, type: 'spring', stiffness: 100, damping: 20 }}
            className="size-16 bg-primary/15 backdrop-blur-md border border-primary/15 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary"
          >
            <Lock className="size-8" />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="font-display text-4xl font-bold italic text-warm-white tracking-tight mb-3"
          >
            Bembe <span className="text-primary not-italic">Admin.</span>
          </motion.h1>
          <p className="text-warm-white/30 font-sans text-[10px] font-bold uppercase tracking-[0.25em]">
            Boutique Management Portal
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6 p-4 bg-accent/10 border border-accent/20 text-accent-light rounded-xl text-xs font-bold uppercase tracking-widest"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          {/* Labels above inputs (taste Rule 6) */}
          <div className="space-y-1.5">
            <label htmlFor="admin-email" className="text-[10px] font-bold uppercase tracking-[0.3em] text-warm-white/25 font-sans">
              Identifier
            </label>
            <input
              id="admin-email"
              type="email"
              required
              className="w-full bg-transparent border-b border-warm-white/10 py-3 text-warm-white outline-none focus:border-primary transition-colors text-sm tracking-wide placeholder:text-warm-white/10"
              placeholder="admin@bembe.cafe"
              value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <label htmlFor="admin-password" className="text-[10px] font-bold uppercase tracking-[0.3em] text-warm-white/25 font-sans">
              Credentials
            </label>
            <input
              id="admin-password"
              type="password"
              required
              className="w-full bg-transparent border-b border-warm-white/10 py-3 text-warm-white outline-none focus:border-primary transition-colors text-sm tracking-wide placeholder:text-warm-white/10"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>

          {/* Magnetic submit button */}
          <div className="pt-4" onMouseMove={handleBtnMouseMove} onMouseLeave={handleBtnMouseLeave}>
            <motion.button
              ref={btnRef}
              type="submit"
              disabled={loading}
              style={{ x: springX, y: springY }}
              whileTap={{ scale: 0.98 }}
              className="group relative w-full bg-primary text-warm-white py-5 rounded-full overflow-hidden transition-all duration-300 tinted-shadow cursor-pointer"
            >
              <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out rounded-full" />
              <span className="relative z-10 font-sans font-bold tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-3">
                {loading ? 'Authenticating...' : 'Establish Connection'}
                {!loading && <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </motion.button>
          </div>
        </form>

        <p className="mt-10 text-center text-[10px] text-warm-white/15 font-bold uppercase tracking-widest italic leading-relaxed">
          Authorized personnel only. <br />
          Artisan standards enforced.
        </p>
      </motion.div>
    </div>
  );
};
