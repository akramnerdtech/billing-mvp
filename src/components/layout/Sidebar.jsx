import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PackageSearch, ReceiptCent, Boxes, Users, Settings, LogOut, X } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const navigation = [
  { name: 'Dashboard', to: '/', icon: LayoutDashboard },
  { name: 'Products', to: '/products', icon: PackageSearch },
  { name: 'Billing', to: '/billing', icon: ReceiptCent },
];

export const Sidebar = ({ isOpen, onClose }) => {
  const [profileOpen, setProfileOpen] = useState(false);

  const SidebarContent = () => (
    <div className="flex flex-col w-64 bg-[#0B1220] border-r border-white/5 h-full">
      <div className="flex items-center justify-between px-6 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600/20 p-1.5 rounded-lg border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]">
            <Boxes className="text-blue-500" size={22} />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">Nexus<span className="text-blue-500">Billing</span></span>
        </div>
        {/* Close button — only shown on mobile */}
        <button
          onClick={onClose}
          className="lg:hidden p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="flex-1 py-8 px-4 space-y-2 relative">
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-6 px-2">Overview</div>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.to}
            onClick={onClose}
            className={({ isActive }) =>
              cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 relative overflow-hidden',
                isActive
                  ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20 shadow-[inset_0_0_10px_rgba(59,130,246,0.1)]'
                  : 'text-gray-400 hover:bg-white/5 hover:text-white border border-transparent'
              )
            }
          >
            {({ isActive }) => (
              <>
                <item.icon
                  size={18}
                  className={cn("transition-all duration-200", isActive ? "text-blue-400 drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]" : "text-gray-500 group-hover:text-gray-300")}
                />
                {item.name}
                {isActive && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.8)] rounded-r" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>

      <div className="p-4 border-t border-white/5 bg-[#111827]">
        <div
          onClick={() => setProfileOpen(true)}
          className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 transition-all cursor-pointer border border-transparent hover:border-white/10"
        >
          <div className="h-10 w-10 rounded-full bg-blue-500/20 flex items-center justify-center text-sm font-bold text-blue-400 border border-blue-500/30 shrink-0">
            JD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">John Doe</p>
            <p className="text-xs text-gray-500 truncate">Senior Admin</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar — always visible */}
      <aside className="hidden lg:flex flex-col w-64 min-h-screen">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar — slide-in drawer */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          {/* Drawer */}
          <aside className="fixed inset-y-0 left-0 z-50 flex flex-col w-64 min-h-screen lg:hidden animate-in slide-in-from-left duration-300">
            <SidebarContent />
          </aside>
        </>
      )}

      <Modal isOpen={profileOpen} onClose={() => setProfileOpen(false)} title="System Operator Profile">
        <div className="space-y-6 mt-2">
          <div className="flex items-center gap-4 bg-white/[0.02] p-4 rounded-xl border border-white/5">
            <div className="h-16 w-16 rounded-full bg-blue-500/20 flex items-center justify-center text-xl font-bold text-blue-400 border border-blue-500/30 shrink-0">
              JD
            </div>
            <div>
              <h3 className="text-white text-lg font-bold">John Doe</h3>
              <span className="inline-flex items-center px-2 py-0.5 mt-1 rounded text-xs font-semibold bg-[#22C55E]/10 text-[#22C55E]">
                Network Administrator
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm py-2 border-b border-white/5">
              <span className="text-gray-400 flex items-center gap-2"><Users size={16} /> Assigned Facility</span>
              <span className="text-white font-medium">Headquarters (Node Alpha)</span>
            </div>
            <div className="flex justify-between text-sm py-2 border-b border-white/5">
              <span className="text-gray-400 flex items-center gap-2"><Settings size={16} /> Clearance Level</span>
              <span className="text-white font-medium">Level 5 Absolute</span>
            </div>
            <div className="flex justify-between text-sm py-2">
              <span className="text-gray-400">Last System Access</span>
              <span className="text-white font-medium">Under 5 minutes ago</span>
            </div>
          </div>

          <Button variant="danger" className="w-full gap-2 mt-4" onClick={() => setProfileOpen(false)}>
            <LogOut size={18} /> Sign Out of Terminal
          </Button>
        </div>
      </Modal>
    </>
  );
};
