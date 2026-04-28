"use client"
import { useEffect, useRef } from "react"
import { motion, useScroll, useTransform, useMotionValue, useSpring, Variants } from "framer-motion"
import { ArrowRight } from "lucide-react"

/* ── Magnetic Button ── */
const MagneticButton = ({
  children,
  onClick,
  className = "",
}: {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}) => {
  const ref = useRef<HTMLButtonElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const springX = useSpring(x, { stiffness: 150, damping: 15 })
  const springY = useSpring(y, { stiffness: 150, damping: 15 })

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * 0.2)
    y.set((e.clientY - (rect.top + rect.height / 2)) * 0.2)
  }
  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      ref={ref}
      style={{ x: springX, y: springY }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onClick}
      whileTap={{ scale: 0.98 }}
      className={`cursor-pointer ${className}`}
    >
      {children}
    </motion.button>
  )
}

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollY } = useScroll()

  // Motion Parallax
  const textY1 = useTransform(scrollY, [0, 1000], [0, -200])
  const textY2 = useTransform(scrollY, [0, 1000], [0, -100])
  const textY3 = useTransform(scrollY, [0, 1000], [0, -300])
  const opacity = useTransform(scrollY, [0, 500], [1, 0])

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 60, damping: 20 }
    }
  }

  return (
    <div
      ref={containerRef}
      className="relative h-[100vh] w-full overflow-hidden bg-[#0A0A0A] flex flex-col justify-center px-8 md:px-24 py-32"
    >
      {/* ── Background Video ── */}
      <div className="absolute inset-0 z-0">
        <video autoPlay muted loop playsInline className="h-full w-full object-cover opacity-40 grayscale-[0.3]">
          <source src="/vecteezy_freshly-baked-apple-pie-steaming-on-a-rustic-wooden-table-in_71718681.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A] z-10" />
      </div>

      {/* ── Fragmented Text Layout ── */}
      <div className="relative z-20 w-full h-full flex flex-col justify-between max-w-7xl mx-auto">
        
        {/* Top Fragment: Heading 1 */}
        <motion.div 
          style={{ y: textY1 }}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="self-start"
        >
          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-primary mb-4 block">Boutique Experience</span>
          <h1 className="text-7xl md:text-[10rem] font-display font-bold text-warm-white leading-none tracking-tighter">
            Authentic
          </h1>
        </motion.div>

        {/* Center Fragment: Artistic Tagline */}
        <motion.div 
          style={{ y: textY2 }}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="self-center flex flex-col items-center gap-6"
        >
          <div className="h-[1px] w-32 bg-primary/30" />
          <h2 className="text-5xl md:text-8xl font-display italic font-light text-primary tracking-tight">
            Artisan
          </h2>
          <motion.p 
            className="max-w-[280px] text-center text-xs md:text-sm text-warm-white/40 font-sans leading-relaxed tracking-wider uppercase"
          >
            Handcrafted pastries & curated coffee culture in the heart of Alexandra Park.
          </motion.p>
        </motion.div>

        {/* Bottom Fragment: Heading 2 + CTA */}
        <motion.div 
          style={{ y: textY3 }}
          initial="hidden"
          animate="visible"
          variants={itemVariants}
          className="self-end flex flex-col items-end gap-12"
        >
          <h1 className="text-7xl md:text-[10rem] font-display font-bold text-warm-white leading-none tracking-tighter">
            Cafe<span className="text-primary">.</span>
          </h1>
          
          <div className="flex items-center gap-10">
            <button className="group flex flex-col items-end gap-1">
              <span className="text-[9px] font-black uppercase tracking-[0.3em] text-warm-white/30 group-hover:text-primary transition-colors">Manchester 2024</span>
              <div className="h-px w-6 bg-primary/30 group-hover:w-16 transition-all duration-500" />
            </button>

            <MagneticButton
              onClick={() => document.getElementById("menu")?.scrollIntoView({ behavior: "smooth" })}
              className="group relative px-10 py-5 rounded-full bg-primary text-text-deep overflow-hidden"
            >
              <div className="absolute inset-0 bg-accent translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out" />
              <span className="relative z-10 font-sans font-black tracking-widest uppercase text-[10px] flex items-center gap-2">
                Explore <ArrowRight className="size-3" />
              </span>
            </MagneticButton>
          </div>
        </motion.div>

      </div>

      {/* ── Scroll Indicator ── */}
      <motion.div 
        style={{ opacity }}
        className="absolute bottom-8 left-8 flex items-center gap-4 text-warm-white/20"
      >
        <span className="text-[8px] uppercase tracking-[0.5em] [writing-mode:vertical-lr]">Scroll</span>
        <div className="h-12 w-px bg-gradient-to-b from-warm-white/20 to-transparent" />
      </motion.div>
    </div>
  )
}
