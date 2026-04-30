import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

const Layout = () => {
  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-100 flex flex-col font-sans">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <Outlet />
        </div>
      </main>
      <footer className="text-center py-6 text-slate-500 text-sm border-t border-white/5">
        &copy; {new Date().getFullYear()} NexusBilling MVP. All rights reserved.
      </footer>
    </div>
  );
};

export default Layout;
