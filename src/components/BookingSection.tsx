import { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Users, Clock, MessageSquare, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { createBooking } from '@/lib/db-utils';

export const BookingSection = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successId, setSuccessId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', date: '', time: '', guests: 2, requests: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.phone || !formData.email || !formData.date || !formData.time) {
      alert("Please fill in all required fields.");
      return;
    }
    const selectedDate = new Date(formData.date);
    if (selectedDate.getDay() === 1) {
      alert("We are closed on Mondays. Please select another day.");
      return;
    }
    setIsSubmitting(true);
    try {
      const docRef = await createBooking(formData);
      if (docRef) {
        setSuccessId(docRef.id);
        setFormData({ name: '', phone: '', email: '', date: '', time: '', guests: 2, requests: '' });
      }
    } catch (error) {
      // Error handled in utility
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="booking" className="py-28 md:py-36 bg-background-soft relative">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="bg-card border border-border-warm rounded-[2rem] overflow-hidden tinted-shadow-lg flex flex-col md:flex-row">
            {/* Left Panel — olive green */}
            <div className="md:w-[38%] bg-primary p-10 md:p-12 text-warm-white flex flex-col justify-center relative overflow-hidden">
              {/* Subtle ambient decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[60px] rounded-full pointer-events-none" />

              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-warm-white/50 mb-4 font-sans">Reservations</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-5 italic leading-tight tracking-tight">
                Visit Us at the Park
              </h2>
              <p className="text-warm-white/70 mb-8 leading-relaxed text-sm">
                Book a table to guarantee your spot in our vibrant park-side haven.
                Perfect for brunch catch-ups or family gatherings.
              </p>
              <ul className="space-y-3">
                <li className="flex items-center gap-3 text-sm text-warm-white/80">
                  <CheckCircle className="size-4 text-warm-white/50 shrink-0" /> No Mondays (Closed)
                </li>
                <li className="flex items-center gap-3 text-sm text-warm-white/80">
                  <CheckCircle className="size-4 text-warm-white/50 shrink-0" /> Tables for up to 12
                </li>
                <li className="flex items-center gap-3 text-sm text-warm-white/80">
                  <CheckCircle className="size-4 text-warm-white/50 shrink-0" /> 10 AM - 4 PM Slots
                </li>
              </ul>
            </div>

            {/* Right Panel — Form */}
            <div className="md:w-[62%] p-8 md:p-10">
              {successId ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                  className="text-center py-10"
                >
                  <div className="size-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-5">
                    <CheckCircle className="size-10" />
                  </div>
                  <h3 className="text-2xl font-display font-bold text-text-deep mb-2 italic">Booking Requested</h3>
                  <p className="text-text-deep/50 mb-5 text-sm">
                    Reference: <span className="text-primary font-bold">{successId}</span>
                  </p>
                  <p className="bg-background p-4 rounded-xl text-sm text-text-deep/70 border border-border-warm mb-6">
                    We'll confirm your booking via phone/email within 1 hour.
                  </p>
                  <Button onClick={() => setSuccessId(null)} className="bg-primary text-warm-white rounded-full px-8 cursor-pointer">
                    New Booking
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  {/* Labels above inputs (taste Rule 6) */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="bk-name" className="text-[10px] font-bold uppercase tracking-widest text-text-deep/40 font-sans">Full Name</label>
                      <input id="bk-name" type="text" required className="w-full bg-white border border-border-warm rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} />
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="bk-phone" className="text-[10px] font-bold uppercase tracking-widest text-text-deep/40 font-sans">Phone Number</label>
                      <input id="bk-phone" type="tel" required className="w-full bg-white border border-border-warm rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors" value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })} />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="bk-email" className="text-[10px] font-bold uppercase tracking-widest text-text-deep/40 font-sans">Email Address</label>
                    <input id="bk-email" type="email" required className="w-full bg-white border border-border-warm rounded-xl px-4 py-3 text-sm focus:border-primary outline-none transition-colors" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    <div className="space-y-1.5">
                      <label htmlFor="bk-date" className="text-[10px] font-bold uppercase tracking-widest text-text-deep/40 font-sans">Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-text-deep/25 pointer-events-none" />
                        <input id="bk-date" type="date" required min={new Date().toISOString().split('T')[0]} className="w-full bg-white border border-border-warm rounded-xl pl-10 pr-3 py-3 text-sm focus:border-primary outline-none transition-colors" value={formData.date} onChange={e => setFormData({ ...formData, date: e.target.value })} />
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="bk-time" className="text-[10px] font-bold uppercase tracking-widest text-text-deep/40 font-sans">Time Slot</label>
                      <div className="relative">
                        <Clock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-text-deep/25 pointer-events-none" />
                        <select id="bk-time" required className="w-full bg-white border border-border-warm rounded-xl pl-10 pr-3 py-3 text-sm focus:border-primary outline-none transition-colors cursor-pointer" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })}>
                          <option value="">Select</option>
                          {['10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '13:00', '13:30', '14:00', '14:30', '15:00', '15:30', '16:00'].map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label htmlFor="bk-guests" className="text-[10px] font-bold uppercase tracking-widest text-text-deep/40 font-sans">Guests</label>
                      <div className="relative">
                        <Users className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-text-deep/25 pointer-events-none" />
                        <select id="bk-guests" required className="w-full bg-white border border-border-warm rounded-xl pl-10 pr-3 py-3 text-sm focus:border-primary outline-none transition-colors cursor-pointer" value={formData.guests} onChange={e => setFormData({ ...formData, guests: parseInt(e.target.value) })}>
                          {[...Array(12)].map((_, i) => (
                            <option key={i+1} value={i+1}>{i+1} {i === 0 ? 'Guest' : 'Guests'}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label htmlFor="bk-requests" className="text-[10px] font-bold uppercase tracking-widest text-text-deep/40 font-sans">Special Requests</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-3.5 top-3.5 size-4 text-text-deep/25 pointer-events-none" />
                      <textarea id="bk-requests" className="w-full bg-white border border-border-warm rounded-xl pl-10 pr-3 py-3 text-sm focus:border-primary outline-none min-h-[80px] transition-colors" placeholder="Allergies, highchairs, etc." value={formData.requests} onChange={e => setFormData({ ...formData, requests: e.target.value })} />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-accent hover:bg-accent-dark text-warm-white py-5 rounded-full text-sm font-bold tracking-widest uppercase tinted-shadow cursor-pointer active:scale-[0.98] transition-all duration-200"
                  >
                    {isSubmitting ? 'Processing...' : 'Confirm Request'}
                  </Button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
