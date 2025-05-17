import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { AnimatePresence } from 'framer-motion';
import Contacts from './pages/Contacts';
import { getIcon } from './utils/iconUtils';
import Home from './pages/Home';
import NotFound from './pages/NotFound';
import ErrorBoundary from './components/ErrorBoundary';

import Reports from './pages/Reports';
// Get icon components
const SunIcon = getIcon('Sun');
const MoonIcon = getIcon('Moon');

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    // Check for saved theme preference or use system preference
    const savedTheme = localStorage.getItem('theme');
    return savedTheme === 'dark' || 
      (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  useEffect(() => {
    // Apply the theme to document
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    // Save theme preference
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <>
      {/* Theme toggle button - fixed position */}
      <button
        aria-label="Toggle dark mode"
        className="fixed z-50 bottom-5 right-5 p-3 rounded-full bg-white dark:bg-surface-800 text-surface-800 dark:text-white shadow-soft hover:shadow-card transition-all duration-300"
        onClick={toggleDarkMode}
      >
        {darkMode ? <SunIcon size={20} /> : <MoonIcon size={20} />}
      </button>

      {/* Main content */}
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/" element={
            <ErrorBoundary>
              <Home />
            </ErrorBoundary>
          } />
          <Route path="/contacts" element={<ErrorBoundary><Contacts /></ErrorBoundary>} />
          <Route path="/reports" element={<ErrorBoundary><Reports /></ErrorBoundary>} />
          <Route path="*" element={<ErrorBoundary><NotFound /></ErrorBoundary>} />
          </Routes>
      </AnimatePresence>

      {/* Toast notifications container */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme={darkMode ? "dark" : "light"}
        toastClassName="!bg-surface-50 !text-surface-800 dark:!bg-surface-800 dark:!text-surface-100 shadow-card"
      />
    </>
  );
}

export default App;