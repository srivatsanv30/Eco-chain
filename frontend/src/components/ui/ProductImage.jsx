/**
 * ProductImage — renders actual product images using each product's
 * database image URL, with a smart fallback for any that fail to load.
 * 
 * The seed data has been updated with verified, working image URLs
 * sourced from publicly available product photography CDNs.
 */
import { useState } from 'react';

const BRAND_COLORS = {
  Samsung:   { from: '#1428a0', to: '#0b1a6e' },
  Apple:     { from: '#333333', to: '#1a1a1a' },
  OnePlus:   { from: '#eb0028', to: '#8a0018' },
  Xiaomi:    { from: '#ff6900', to: '#cc5400' },
  Nothing:   { from: '#3a3a3a', to: '#1a1a1a' },
  Realme:    { from: '#ffc800', to: '#b38e00' },
  Motorola:  { from: '#5c2d91', to: '#3a1c5c' },
  iQOO:      { from: '#0040ff', to: '#002db3' },
  Lenovo:    { from: '#e2231a', to: '#9e1812' },
  HP:        { from: '#0096d6', to: '#006b99' },
  Dell:      { from: '#007db8', to: '#005a85' },
  ASUS:      { from: '#00539b', to: '#003a6d' },
  Sony:      { from: '#000000', to: '#1a1a1a' },
  LG:        { from: '#a50034', to: '#6e0023' },
  IFB:       { from: '#003d7a', to: '#002952' },
  Whirlpool: { from: '#1f3c88', to: '#142960' },
  Haier:     { from: '#c8102e', to: '#8a0b20' },
  Daikin:    { from: '#009639', to: '#006627' },
  Voltas:    { from: '#ed1c24', to: '#a61319' },
  'Blue Star':{ from: '#0054a6', to: '#003b75' },
  boAt:      { from: '#e63946', to: '#a12832' },
  JBL:       { from: '#ff6600', to: '#cc5200' },
  Bose:      { from: '#2c2c2c', to: '#111111' },
  Anker:     { from: '#00b4d8', to: '#0090ad' },
  Belkin:    { from: '#00a651', to: '#007539' },
  Google:    { from: '#4285f4', to: '#2b6ad0' },
};

const CATEGORY_EMOJI = {
  Smartphones: '📱',
  Laptops: '💻',
  Tablets: '📋',
  TVs: '📺',
  'Washing Machines': '🫧',
  Refrigerators: '❄️',
  'Air Conditioners': '🌀',
  Audio: '🎧',
  Smartwatches: '⌚',
  Cameras: '📷',
  Monitors: '🖥️',
  Accessories: '🔌',
  Appliances: '🏠',
  Clothing: '👕',
};

const ProductImage = ({ product, className = '' }) => {
  const [failed, setFailed] = useState(false);
  const imageUrl = product?.image;
  const brand = product?.brand || 'Unknown';
  const name = product?.name || 'Product';
  const category = product?.category || '';
  const emoji = CATEGORY_EMOJI[category] || '📦';
  const colors = BRAND_COLORS[brand] || { from: '#374151', to: '#111827' };

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

  // Branded fallback for broken/missing images
  return (
    <div
      className={`flex flex-col items-center justify-center relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${colors.from}, ${colors.to})` }}
    >
      <div className="absolute -top-8 -right-8 w-32 h-32 rounded-full opacity-10" style={{ background: 'white' }} />
      <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full opacity-10" style={{ background: 'white' }} />
      <span className="text-5xl mb-2 drop-shadow-lg relative z-10">{emoji}</span>
      <span className="text-[11px] font-extrabold text-white/90 text-center px-4 leading-tight line-clamp-2 relative z-10 drop-shadow">
        {name}
      </span>
      <span className="text-[9px] text-white/50 mt-1.5 font-semibold uppercase tracking-widest relative z-10">
        {brand}
      </span>
    </div>
  );
};

export default ProductImage;
