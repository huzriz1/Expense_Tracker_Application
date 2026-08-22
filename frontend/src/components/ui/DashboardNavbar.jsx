import React, { useState } from 'react';
import { UserButton } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router-dom';
import { useTheme } from './theme-provider';

const DashboardNavbar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const isActive = (path) => 
    location.pathname === path 
      ? "bg-primary text-primary-foreground font-semibold" 
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground";

  return (
    <nav className="border-b border-border bg-card text-card-foreground sticky top-0 z-50 transition-colors">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          
          <div className="flex items-center gap-6">
            <Link to="/" className="text-lg font-bold tracking-tight text-primary flex items-center gap-2">
              Paisa Bachat
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              <Link to="/dashboard" className={`px-3 py-1.5 rounded-md text-sm transition-all ${isActive('/dashboard')}`}>Dashboard</Link>
              <Link to="/analytics" className={`px-3 py-2 rounded-md text-sm transition-all ${isActive('/analytics')}`}>Analytics</Link>
              <Link to="/budgets" className={`px-3 py-2 rounded-md text-sm transition-all ${isActive('/budgets')}`}>Budgets</Link>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              type="button"
              className="px-3 py-1.5 rounded-md border border-border bg-background text-sm font-medium hover:bg-accent transition-all cursor-pointer"
            >
              {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
            </button>

            <UserButton afterSignOutUrl="/login" />

            <button onClick={() => setIsOpen(!isOpen)} className="p-2 text-muted-foreground md:hidden" aria-expanded={isOpen} aria-controls="mobile-menu">
              {!isOpen ? (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" /></svg>
              ) : (
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M6 18L18 6M6 6l12 12" /></svg>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div id="mobile-menu" className="md:hidden bg-card border-t border-border">
          <div className="px-4 pt-2 pb-4 space-y-1">
            <Link to="/dashboard" className={`block px-3 py-2 rounded-md text-sm ${isActive('/dashboard')}`}>Dashboard</Link>
            <Link to="/analytics" className={`block px-3 py-2 rounded-md text-sm ${isActive('/analytics')}`}>Analytics</Link>
            <Link to="/budgets" className={`block px-3 py-2 rounded-md text-sm ${isActive('/budgets')}`}>Budgets</Link>
          </div>
        </div>
      )}

    </nav>
  );
};

export default DashboardNavbar;
