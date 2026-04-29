import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, Menu as MenuIcon, X, ArrowRight } from 'lucide-react';

export const Navbar = ({ cartCount, onCartClick }: { cartCount: number, onCartClick: () => void }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Our Menu', href: '#menu' },
    { name: 'Book a Table', href: '#booking' },
    { name: 'Our Story', href: '#about' },
    { name: 'What People Say', href: '#reviews' },
  ];

  /* Stagger variants for mobile menu (taste §4) */
  const menuContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.15 },
    },
  };

  const menuItemVariants = {
    hidden: { opacity: 0, x: 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { type: 'spring' as const, stiffness: 100, damping: 20 },
    },
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-500 px-4 md:px-8 lg:px-16 ${
        isScrolled ? 'py-3' : 'py-6'
      }`}
    >
      <div
        className={`max-w-7xl mx-auto flex justify-between items-center transition-all duration-500 px-6 py-3 rounded-full ${
          isScrolled
            ? 'liquid-glass bg-warm-white/80'
            : 'bg-transparent'
        }`}
      >
        {/* Brand Logo */}
        <a href="/" className="group relative cursor-pointer">
          <motion.span
            className={`font-display text-xl md:text-2xl font-bold italic tracking-tight block transition-colors duration-300 ${
              isScrolled ? 'text-text-deep' : 'text-warm-white'
            }`}
            whileHover={{ scale: 1.03 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          >
            Bembe{' '}
            <span className="text-primary group-hover:text-accent transition-colors duration-300">
              Cafe
            </span>
          </motion.span>
          <div className="absolute -bottom-0.5 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-500" />
        </a>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className={`relative font-sans text-[11px] font-bold tracking-[0.25em] uppercase transition-colors duration-300 cursor-pointer group ${
                isScrolled 
                  ? 'text-text-deep/60 hover:text-text-deep' 
                  : 'text-warm-white/60 hover:text-warm-white'
              }`}
            >
              {link.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-primary group-hover:w-full transition-all duration-300" />
            </a>
          ))}

          <div className={`h-4 w-[1px] mx-1 transition-colors duration-300 ${
            isScrolled ? 'bg-text-deep/10' : 'bg-warm-white/15'
          }`} />

          <button
            onClick={onCartClick}
            className={`relative p-2 transition-colors duration-300 cursor-pointer ${
              isScrolled ? 'text-text-deep/70 hover:text-primary' : 'text-warm-white/70 hover:text-primary'
            }`}
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            >
              <ShoppingCart className="size-5" />
            </motion.div>
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="absolute -top-1 -right-1 bg-accent text-warm-white text-[9px] font-black size-4 flex items-center justify-center rounded-full"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>

        {/* Mobile Toggle */}
        <div className="md:hidden flex items-center gap-4">
          <button 
            onClick={onCartClick} 
            className={`relative p-2 transition-colors duration-300 cursor-pointer ${
              isScrolled ? 'text-text-deep' : 'text-warm-white'
            }`}
          >
            <ShoppingCart className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-accent text-warm-white text-[9px] font-black size-4 flex items-center justify-center rounded-full">
                {cartCount}
              </span>
            )}
          </button>
          <button
            onClick={() => setIsMenuOpen(true)}
            className={`transition-colors duration-300 cursor-pointer ${
              isScrolled ? 'text-text-deep hover:text-primary' : 'text-warm-white hover:text-primary'
            }`}
          >
            <MenuIcon className="size-6" />
          </button>
        </div>
      </div>

      {/* ── Full-screen Mobile Menu — warm dark brown (taste §7: no pure black) ── */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 bg-text-deep z-[60] flex flex-col p-10"
          >
            <div className="flex justify-between items-center mb-16">
              <span className="font-display text-2xl font-bold text-warm-white italic">
                Bembe
              </span>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="size-10 rounded-full border border-warm-white/10 flex items-center justify-center text-warm-white hover:border-primary hover:text-primary transition-colors duration-200 cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            {/* Stagger-reveal nav items (taste §4) */}
            <motion.div
              className="flex flex-col gap-6"
              variants={menuContainerVariants}
              initial="hidden"
              animate="visible"
            >
              {navLinks.map((link) => (
                <motion.a
                  variants={menuItemVariants}
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="text-4xl font-display font-bold text-warm-white/30 hover:text-warm-white transition-colors duration-200 italic flex items-center justify-between group cursor-pointer"
                >
                  {link.name}
                  <ArrowRight className="size-6 opacity-0 group-hover:opacity-100 -translate-x-3 group-hover:translate-x-0 transition-all duration-200 text-primary" />
                </motion.a>
              ))}
            </motion.div>

            <div className="mt-auto pt-10 border-t border-warm-white/5 flex flex-col gap-4">
              <p className="text-warm-white/30 font-sans text-xs tracking-widest uppercase">
                Alexandra Park, Manchester
              </p>
              <div className="flex gap-6">
                <a
                  href="#"
                  className="text-warm-white/40 hover:text-primary text-xs uppercase tracking-widest font-bold cursor-pointer transition-colors duration-200"
                >
                  Join us on Instagram
                </a>
                <a
                  href="#"
                  className="text-warm-white/40 hover:text-primary text-xs uppercase tracking-widest font-bold cursor-pointer transition-colors duration-200"
                >
                  Connect on Facebook
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};
