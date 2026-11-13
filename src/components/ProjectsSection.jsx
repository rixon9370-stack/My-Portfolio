import React from 'react';
import ProjectPanel from './ProjectPanel';
import { PANELS } from '../data/panels';

export default function ProjectsSection() {
  return (
    <section id="projects" className="relative w-full" aria-label="Selected Projects">
      {PANELS.map((panel) => (
        <ProjectPanel key={panel.slug} panel={panel} />
      ))}
    </section>
  );
}
