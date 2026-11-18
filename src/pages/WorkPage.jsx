import React from 'react';
import Navbar from '../components/Navbar';
import ProjectsSection from '../components/ProjectsSection';
import Footer from '../components/Footer';
import { PANELS } from '../data/panels';

export default function WorkPage() {
  return (
    <div>
      <Navbar />
      <ProjectsSection />
      {/* Footer sits above sticky panels via z-index */}
      <div style={{ position: 'relative', zIndex: PANELS.length + 1, background: '#0a0a0c' }}>
        <Footer />
      </div>
    </div>
  );
}
