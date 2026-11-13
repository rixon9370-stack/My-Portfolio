import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    timeline: '',
    message: ''
  });
  const [errorMsg, setErrorMsg] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    document.title = "Let's Talk | Rixon Sunny";
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errorMsg) setErrorMsg('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSuccess(false);

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!formData.name.trim() || !formData.email.trim() || !formData.projectType || !formData.message.trim()) {
      setErrorMsg('Please complete all required fields and select a project type.');
      return;
    }

    if (!emailRegex.test(formData.email.trim())) {
      setErrorMsg('Please enter a valid email address.');
      return;
    }

    setIsSubmitting(true);

    try {
      // If Formspree endpoint is configured, send via POST, else simulate immediate success
      const formspreeUrl = 'https://formspree.io/f/YOUR_FORMSPREE_ID';
      if (formspreeUrl && !formspreeUrl.includes('YOUR_FORMSPREE_ID')) {
        const res = await fetch(formspreeUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(formData)
        });
        if (!res.ok) throw new Error('Submission error');
      }

      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        projectType: '',
        timeline: '',
        message: ''
      });
    } catch {
      setErrorMsg('Could not send message right now. Please email directly at rixon9370@gmail.com.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col">
      <Navbar />

      <main className="flex-1 w-full max-w-4xl mx-auto px-6 sm:px-8 pt-32 pb-24">
        {/* Headline */}
        <h1 className="font-display text-4xl sm:text-6xl md:text-7xl font-bold uppercase tracking-tight text-white mb-12 text-left sm:text-center">
          LET'S CREATE SOMETHING THAT SELLS.
        </h1>

        {/* Info Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8 border-y border-white/10 mb-16 text-left sm:text-center">
          <div className="flex flex-col sm:items-center">
            <span className="flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-wider text-white/50 mb-1">
              <Mail className="w-3.5 h-3.5" />
              <span>Email</span>
            </span>
            <a
              href="mailto:rixon9370@gmail.com"
              className="font-body text-sm sm:text-base font-medium text-white hover:underline underline-offset-4"
            >
              rixon9370@gmail.com
            </a>
          </div>

          <div className="flex flex-col sm:items-center">
            <span className="flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-wider text-white/50 mb-1">
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </span>
            <a
              href="https://wa.me/919562384588"
              target="_blank"
              rel="noopener noreferrer"
              className="font-body text-sm sm:text-base font-medium text-white hover:underline underline-offset-4"
            >
              +91 95623 84588
            </a>
          </div>

          <div className="flex flex-col sm:items-center">
            <span className="flex items-center gap-1.5 font-body text-xs font-semibold uppercase tracking-wider text-white/50 mb-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Location</span>
            </span>
            <span className="font-body text-sm sm:text-base font-medium text-white">
              Wayanad, Kerala, India
            </span>
          </div>
        </div>

        {/* Reach Out Form Section */}
        <section className="w-full max-w-2xl mx-auto" aria-labelledby="reachOutHeading">
          <h2 id="reachOutHeading" className="font-display text-3xl sm:text-4xl font-bold uppercase tracking-tight text-white mb-2">
            REACH OUT
          </h2>
          <p className="font-body text-base text-white/70 mb-8">
            Have a project in mind? Tell me about it.
          </p>

          <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
            {/* Name */}
            <div className="flex flex-col gap-2">
              <label htmlFor="formName" className="font-body text-xs font-semibold uppercase tracking-wider text-white/70">
                Name *
              </label>
              <input
                type="text"
                id="formName"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name"
                required
                className="w-full px-4 py-3 bg-[#111115] border border-white/10 rounded focus:border-white focus:outline-none text-white font-body text-sm placeholder:text-white/30 transition-colors"
              />
            </div>

            {/* Email */}
            <div className="flex flex-col gap-2">
              <label htmlFor="formEmail" className="font-body text-xs font-semibold uppercase tracking-wider text-white/70">
                Email *
              </label>
              <input
                type="email"
                id="formEmail"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="name@domain.com"
                required
                className="w-full px-4 py-3 bg-[#111115] border border-white/10 rounded focus:border-white focus:outline-none text-white font-body text-sm placeholder:text-white/30 transition-colors"
              />
            </div>

            {/* Project Type */}
            <div className="flex flex-col gap-2">
              <label htmlFor="formType" className="font-body text-xs font-semibold uppercase tracking-wider text-white/70">
                Project Type *
              </label>
              <select
                id="formType"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 bg-[#111115] border border-white/10 rounded focus:border-white focus:outline-none text-white font-body text-sm transition-colors cursor-pointer"
              >
                <option value="" disabled className="bg-[#111115] text-white/50">
                  Select a project type
                </option>
                <option value="Cinematic Film" className="bg-[#111115] text-white">Cinematic Film</option>
                <option value="Fashion & Jewellery Film" className="bg-[#111115] text-white">Fashion &amp; Jewellery Film</option>
                <option value="Commercial Ad" className="bg-[#111115] text-white">Commercial Ad</option>
                <option value="Brand Film" className="bg-[#111115] text-white">Brand Film</option>
                <option value="Retail & Shopping Ad" className="bg-[#111115] text-white">Retail &amp; Shopping Ad</option>
                <option value="App Promo Video" className="bg-[#111115] text-white">App Promo Video</option>
                <option value="Something else" className="bg-[#111115] text-white">Something else</option>
              </select>
            </div>

            {/* Timeline */}
            <div className="flex flex-col gap-2">
              <label htmlFor="formTimeline" className="font-body text-xs font-semibold uppercase tracking-wider text-white/70">
                Timeline
              </label>
              <input
                type="text"
                id="formTimeline"
                name="timeline"
                value={formData.timeline}
                onChange={handleChange}
                placeholder="e.g. 1-2 weeks, next month"
                className="w-full px-4 py-3 bg-[#111115] border border-white/10 rounded focus:border-white focus:outline-none text-white font-body text-sm placeholder:text-white/30 transition-colors"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-2">
              <label htmlFor="formMessage" className="font-body text-xs font-semibold uppercase tracking-wider text-white/70">
                Message *
              </label>
              <textarea
                id="formMessage"
                name="message"
                rows={4}
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell me about your project, deliverables and requirements..."
                required
                className="w-full px-4 py-3 bg-[#111115] border border-white/10 rounded focus:border-white focus:outline-none text-white font-body text-sm placeholder:text-white/30 transition-colors resize-y"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#0a0a0c] font-body text-sm font-semibold rounded hover:bg-white/90 disabled:opacity-50 transition-all cursor-pointer"
            >
              <span>{isSubmitting ? 'SENDING...' : 'SEND INQUIRY'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Error Banner */}
            {errorMsg && (
              <div
                className="p-4 bg-red-950/40 border border-red-500/30 text-red-200 text-sm font-body rounded"
                role="alert"
              >
                {errorMsg}
              </div>
            )}

            {/* Success Banner */}
            {isSuccess && (
              <div
                className="p-4 bg-emerald-950/40 border border-emerald-500/30 text-emerald-200 text-sm font-body rounded"
                role="status"
              >
                Thank you! Your message has been sent. I will get back to you soon.
              </div>
            )}
          </form>
        </section>
      </main>

      <Footer />
    </div>
  );
}
