import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ContactPage from './pages/ContactPage';
import { ScrollToTop } from './components/ScrollToTop';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Core Root */}
        <Route path="/" element={<HomePage />} />
        <Route path="/index.html" element={<Navigate to="/" replace />} />

        {/* Contact Page */}
        <Route path="/contact" element={<ContactPage />} />

        {/* Direct Category Routes */}
        <Route path="/cinematic" element={<CategoryPage explicitCategory="cinematic" />} />
        <Route path="/fashion-jewellery" element={<CategoryPage explicitCategory="fashion-jewellery" />} />
        <Route path="/commercial" element={<CategoryPage explicitCategory="commercial" />} />
        <Route path="/brand-films" element={<CategoryPage explicitCategory="brand-films" />} />
        <Route path="/food-retail" element={<CategoryPage explicitCategory="food-retail" />} />
        <Route path="/app-promos" element={<CategoryPage explicitCategory="app-promos" />} />

        {/* Dynamic Category Route */}
        <Route path="/category/:categorySlug" element={<CategoryPage />} />

        {/* Work Redirection */}
        <Route path="/work" element={<Navigate to="/#projects" replace />} />
        <Route path="/pages/work.html" element={<Navigate to="/#projects" replace />} />
        <Route path="/pages/work" element={<Navigate to="/#projects" replace />} />

        {/* Legacy /pages/ redirects for zero broken links */}
        <Route path="/pages/contact.html" element={<Navigate to="/contact" replace />} />
        <Route path="/pages/contact" element={<Navigate to="/contact" replace />} />
        <Route path="/pages/cinematic.html" element={<Navigate to="/cinematic" replace />} />
        <Route path="/pages/cinematic" element={<Navigate to="/cinematic" replace />} />
        <Route path="/pages/fashion-jewellery.html" element={<Navigate to="/fashion-jewellery" replace />} />
        <Route path="/pages/fashion-jewellery" element={<Navigate to="/fashion-jewellery" replace />} />
        <Route path="/pages/commercial.html" element={<Navigate to="/commercial" replace />} />
        <Route path="/pages/commercial" element={<Navigate to="/commercial" replace />} />
        <Route path="/pages/brand-films.html" element={<Navigate to="/brand-films" replace />} />
        <Route path="/pages/brand-films" element={<Navigate to="/brand-films" replace />} />
        <Route path="/pages/food-retail.html" element={<Navigate to="/food-retail" replace />} />
        <Route path="/pages/food-retail" element={<Navigate to="/food-retail" replace />} />
        <Route path="/pages/app-promos.html" element={<Navigate to="/app-promos" replace />} />
        <Route path="/pages/app-promos" element={<Navigate to="/app-promos" replace />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
