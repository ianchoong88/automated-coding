
import React from 'react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:py-12">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 text-white rounded-2xl mb-4 shadow-lg shadow-blue-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 tracking-tight mb-2">Business Card to Contacts Scanner</h1>
        <p className="text-slate-500 text-lg">Extract details, logos, and portrait photos instantly</p>
      </header>
      <main>
        {children}
      </main>
      <footer className="mt-20 text-center text-slate-400 text-sm">
        <p>&copy; {new Date().getFullYear()} CardSnap Pro. All rights reserved.</p>
      </footer>
    </div>
  );
};
