import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Elevated background #111827 mapping exactly to spec
export const Card = ({ className, children, ...props }) => {
  return (
    <div 
      className={cn(
        "bg-[#111827] flex flex-col rounded-xl border border-white/5 shadow-lg", 
        className
      )} 
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ className, children, ...props }) => (
  <div className={cn("px-6 py-5 border-b border-white/5", className)} {...props}>
    {children}
  </div>
);

export const CardTitle = ({ className, children, ...props }) => (
  <h3 className={cn("text-lg font-semibold text-white tracking-tight", className)} {...props}>
    {children}
  </h3>
);

export const CardContent = ({ className, children, ...props }) => (
  <div className={cn("p-6 flex-1", className)} {...props}>
    {children}
  </div>
);
