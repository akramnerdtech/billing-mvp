import React from 'react';
import { Minus, Plus } from 'lucide-react';

export const QuantityStepper = ({ quantity, onUpdateQuantity, min = 1 }) => {
  return (
    <div className="flex items-center border border-white/10 rounded-lg overflow-hidden bg-[#0B1220]">
      <button 
        onClick={() => onUpdateQuantity(-1)}
        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-50"
        disabled={quantity <= min}
      >
        <Minus size={14} />
      </button>
      <span className="w-10 text-center text-sm font-medium text-gray-200 border-x border-white/10 flex items-center justify-center h-8 bg-[#111827]">
        {quantity}
      </span>
      <button 
        onClick={() => onUpdateQuantity(1)}
        className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
      >
        <Plus size={14} />
      </button>
    </div>
  );
};
