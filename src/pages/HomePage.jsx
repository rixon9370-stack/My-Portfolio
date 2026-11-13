import React from 'react';
import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Ticker from '../components/Ticker';
import ProjectsSection from '../components/ProjectsSection';
import AboutSection from '../components/AboutSection';
import ServicesSection from '../components/ServicesSection';
import WorkflowSection from '../components/WorkflowSection';
import CtaSection from '../components/CtaSection';
import Footer from '../components/Footer';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0c] text-white flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <Hero />
        <Ticker />
        <ProjectsSection />
        <div className="bg-[#0a0a0c] relative z-20 px-4 sm:px-6 md:px-8">
          <AboutSection />
          <ServicesSection />
          <WorkflowSection />
          <CtaSection />
        </div>
      </main>
      <Footer />
    </div>
  );
}
