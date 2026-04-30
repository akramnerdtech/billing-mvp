import React from 'react';

export const PriceSummary = ({ subtotal, tax, total, onCheckout, submitting, disabled }) => {
  return (
    <div className="bg-[#111827] border-t border-white/10 p-6 flex flex-col mt-auto shrink-0">
      <div className="space-y-3 mb-6">
        <div className="flex justify-between items-center text-sm text-gray-400">
           <span>Subtotal</span>
           <span>₹{subtotal.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="flex justify-between items-center text-sm text-gray-400">
           <span>Tax</span>
           <span>₹{tax.toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
        </div>
        <div className="h-px w-full bg-white/10 my-1" />
        <div className="flex justify-between items-center pt-1">
           <span className="text-gray-200 font-medium text-lg">Total</span>
           <span className="text-white font-bold text-2xl">
             ₹{total.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
           </span>
        </div>
      </div>
      
      <button 
        className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
        disabled={disabled || submitting}
        onClick={onCheckout}
      >
        {submitting && <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin shrink-0" />}
        {submitting ? 'Processing...' : 'Create Order'}
      </button>
    </div>
  );
};
