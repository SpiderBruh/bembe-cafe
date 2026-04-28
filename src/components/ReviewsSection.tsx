import { motion } from 'motion/react';
import { Star, MessageCircle, Quote } from 'lucide-react';

export const ReviewsSection = () => {
  const reviews = [
    { author: "Nicky Oliver", text: "Bembe Cafe is a delightful gem nestled in the picturesque Alexandra Park... warm smiles and an inviting atmosphere", rating: 5 },
    { author: "AJ", text: "Coffee is so good and always well made... super child friendly place. Staff are always sweet.", rating: 5 },
    { author: "Sarah Jayne Higgins", text: "The Bembe breakfast was sensational... less heavy than your usual big brekkie", rating: 5 },
    { author: "Tarik Zaman", text: "Amazing cakes and an array of different drinks... Atmosphere is vibrant and appealing.", rating: 5 },
    { author: "Abbey Craig", text: "Such a gorgeous little haven by the park. My matcha was beautifully made.", rating: 5 },
    { author: "Daniel Ali", text: "Had breakfast there today. Shakshuka was delicious. High quality coffee. Everything is halal.", rating: 5 },
  ];

  /* Stagger variants (taste §4) */
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100, damping: 20 } },
  };

  return (
    <section id="reviews" className="py-28 md:py-36 bg-background relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        {/* Section header — left-aligned (anti-center bias) */}
        <div className="mb-16">
          <div className="flex items-center gap-1.5 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="size-5 text-yellow-500 fill-yellow-500" />
            ))}
          </div>
          <h2 className="font-display text-3xl md:text-5xl font-bold mb-3 tracking-tight text-text-deep">
            Loved by Our{' '}
            <span className="italic text-primary">Community</span>
          </h2>
          {/* No emoji — SVG stars above instead (taste anti-emoji, ui-ux-pro-max rule) */}
          <p className="text-text-deep/45 text-base font-light">
            4.8 out of 5 based on 43 Local Google Reviews
          </p>
        </div>

        {/* Reviews — 2-col asymmetric (no 3 equal columns — taste §7) */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 gap-0"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-40px" }}
        >
          {reviews.map((rev, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="relative py-8 px-1 md:px-6 border-t border-border-warm first:border-t-0 md:first:border-t md:odd:border-r md:odd:pr-10 md:even:pl-10 group"
            >
              {/* Quote mark — olive green decorative */}
              <Quote className="absolute top-8 right-2 md:right-6 size-8 text-primary/8" />

              <div className="flex gap-1 mb-4">
                {[...Array(rev.rating)].map((_, i) => (
                  <Star key={i} className="size-3.5 text-yellow-500 fill-yellow-500" />
                ))}
              </div>

              <p className="text-text-deep/70 leading-relaxed italic mb-6 relative z-10 text-sm">
                "{rev.text}"
              </p>

              <div className="flex items-center gap-3">
                <div className="size-9 bg-primary/10 rounded-full flex items-center justify-center font-bold text-primary text-sm font-display">
                  {rev.author[0]}
                </div>
                <span className="font-bold text-text-deep text-sm font-sans">{rev.author}</span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA — clean inline link, not boxed button */}
        <div className="mt-14 pt-8 border-t border-border-warm">
          <a
            href="#"
            className="inline-flex items-center gap-2 font-bold text-primary hover:text-primary-dark text-sm cursor-pointer transition-colors duration-200 group"
          >
            <MessageCircle className="size-4" />
            <span>See all reviews on Google</span>
            <span className="w-0 group-hover:w-4 overflow-hidden transition-all duration-300">
              <span className="inline-block translate-x-0 group-hover:translate-x-0">&rarr;</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
};
