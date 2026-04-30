import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const Table = ({ children, className }) => (
  <div className={cn("w-full overflow-x-auto", className)}>
    <table className="w-full text-sm text-left text-gray-400">
      {children}
    </table>
  </div>
);

export const Thead = ({ children }) => (
  <thead className="text-xs text-gray-500 uppercase bg-white/5 border-b border-white/5 tracking-wider">
    {children}
  </thead>
);

export const Tr = ({ children, className }) => (
  <tr className={cn("border-b border-white/5 last:border-0 hover:bg-white/[0.02] transition-colors", className)}>
    {children}
  </tr>
);

export const Th = ({ children, className }) => (
  <th className={cn("px-6 py-4 font-semibold text-gray-300", className)}>
    {children}
  </th>
);

export const Td = ({ children, className }) => (
  <td className={cn("px-6 py-4 whitespace-nowrap", className)}>
    {children}
  </td>
);
