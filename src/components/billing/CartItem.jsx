import React from 'react';
import { Trash2 } from 'lucide-react';
import { QuantityStepper } from './QuantityStepper';

export const CartItem = ({ item, onUpdateQuantity, onRemove }) => {
  return (
    <div className="flex flex-col gap-3 pb-5 border-b border-white/5 last:border-0 last:pb-0">
      <div className="flex justify-between items-start gap-2">
        <h5 className="font-medium text-gray-200 text-sm leading-snug">{item.name}</h5>
        <button 
          onClick={() => onRemove(item.product)}
          className="text-gray-500 hover:text-red-400 transition-colors p-1"
        >
          <Trash2 size={16} />
        </button>
      </div>
      <div className="flex items-center justify-between">
        <QuantityStepper 
           quantity={item.quantity} 
           onUpdateQuantity={(delta) => onUpdateQuantity(item.product, delta)} 
        />
        <span className="text-gray-300 font-medium text-sm">
          ₹{(item.price * item.quantity).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
        </span>
      </div>
    </div>
  );
};
