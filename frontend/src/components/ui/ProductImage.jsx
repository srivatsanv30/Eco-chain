import { useState } from 'react';

const CATEGORY_CONFIG = {
  Smartphones:        { emoji: '📱', gradient: 'from-blue-600 via-indigo-600 to-violet-700' },
  Laptops:            { emoji: '💻', gradient: 'from-slate-700 via-zinc-700 to-neutral-800' },
  Tablets:            { emoji: '📱', gradient: 'from-cyan-600 via-teal-600 to-emerald-700' },
  TVs:                { emoji: '📺', gradient: 'from-purple-700 via-fuchsia-700 to-pink-700' },
  'Washing Machines': { emoji: '🧺', gradient: 'from-sky-600 via-blue-600 to-indigo-700' },
  Refrigerators:      { emoji: '❄️', gradient: 'from-teal-600 via-cyan-600 to-sky-700' },
  'Air Conditioners': { emoji: '🌬️', gradient: 'from-emerald-600 via-teal-600 to-cyan-700' },
  Audio:              { emoji: '🎧', gradient: 'from-amber-600 via-orange-600 to-red-700' },
  Smartwatches:       { emoji: '⌚', gradient: 'from-rose-600 via-pink-600 to-fuchsia-700' },
  Cameras:            { emoji: '📷', gradient: 'from-gray-700 via-stone-700 to-zinc-800' },
  Accessories:        { emoji: '🔌', gradient: 'from-lime-600 via-green-600 to-emerald-700' },
  Monitors:           { emoji: '🖥️', gradient: 'from-violet-700 via-purple-700 to-indigo-800' },
};

const DEFAULT_CONFIG = { emoji: '📦', gradient: 'from-slate-600 via-gray-600 to-zinc-700' };

const ProductImage = ({ product, className = '' }) => {
  const [failed, setFailed] = useState(false);
  const imageUrl = product?.primaryImage || (product?.images && product.images.length > 0 ? product.images[0].url : null) || product?.image;
  const name = product?.productName || product?.name || 'Product';
  const category = product?.category || '';

  // If image exists and hasn't failed, show the real image
  if (imageUrl && !failed) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className={className}
        onError={() => setFailed(true)}
        loading="lazy"
      />
    );
  }

  // Beautiful gradient fallback with category-specific styling
  const config = CATEGORY_CONFIG[category] || DEFAULT_CONFIG;

  return (
    <div className={`relative flex flex-col items-center justify-center bg-gradient-to-br ${config.gradient} overflow-hidden ${className}`}>
      {/* Decorative circles */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl transform translate-x-8 -translate-y-8" />
      <div className="absolute bottom-0 left-0 w-20 h-20 bg-black/10 rounded-full blur-xl transform -translate-x-6 translate-y-6" />
      
      {/* Content */}
      <span className="text-4xl mb-2 drop-shadow-lg">{config.emoji}</span>
      <span className="text-white/90 text-xs font-bold uppercase tracking-widest text-center px-4 line-clamp-2 drop-shadow">
        {name}
      </span>
    </div>
  );
};

export default ProductImage;

