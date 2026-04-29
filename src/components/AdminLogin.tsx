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
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent/3 blur-[150px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md bg-warm-white/10 p-10 rounded-2xl"
      >
        <div className="text-center mb-10">
          <motion.div
            initial={{ y: -16, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.15, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="size-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary"
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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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

          <div className="pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="group relative w-full bg-primary text-warm-white py-5 rounded-full overflow-hidden transition-all duration-300 tinted-shadow cursor-pointer hover:bg-primary-dark active:scale-[0.98]"
            >
              <span className="relative z-10 font-sans font-bold tracking-[0.2em] uppercase text-xs flex items-center justify-center gap-3">
                {loading ? 'Authenticating...' : 'Establish Connection'}
                {!loading && <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />}
              </span>
            </Button>
          </div>
        </form>

        <p className="mt-10 text-center text-[10px] text-warm-white/15 font-bold uppercase tracking-widest italic leading-relaxed">
          Authorized personnel only. <br />
          Artisan standards enforced.
        </p>
      </motion.div>
    </div>
  );
