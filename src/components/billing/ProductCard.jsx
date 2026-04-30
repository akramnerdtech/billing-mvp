import React from 'react';

export const ProductCard = ({ product, onAddToCart }) => {
  const isAvailable = product.quantity > 0;

  return (
    <div className="bg-[#111827] rounded-xl border border-white/10 p-4 flex flex-col gap-4 transition-colors hover:border-white/20">
      <div className="flex justify-between items-start gap-4">
        {product.imageUrl ? (
          <div className="w-16 h-16 rounded-lg bg-[#0B1220] border border-white/5 overflow-hidden shrink-0">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-16 h-16 rounded-lg bg-[#0B1220] border border-white/5 flex items-center justify-center font-bold text-xl text-gray-500 shrink-0">
            {product.name.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="flex flex-col items-end gap-1 overflow-hidden">
          <span className="font-semibold text-gray-200 text-sm truncate w-full text-right">{product.name}</span>
          <span className="bg-blue-500/10 text-blue-400 font-medium px-2 py-0.5 rounded text-xs shrink-0">
            ₹{product.price.toLocaleString('en-IN', {minimumFractionDigits: 2})}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-auto pt-2">
        <p className={`text-xs font-medium ${isAvailable ? 'text-gray-400' : 'text-red-400'}`}>
          {isAvailable ? `${product.quantity} in stock` : 'Out of stock'}
        </p>
      </div>
      
      <button 
        onClick={onAddToCart}
        disabled={!isAvailable}
        className="w-full py-2 bg-white/5 hover:bg-white/10 text-white text-sm font-medium rounded-lg disabled:opacity-50 transition-colors"
      >
        Add to Order
      </button>
    </div>
  );
};
