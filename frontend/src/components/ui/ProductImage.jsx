import { useState } from 'react';
import { resolveProductImageUrl, getProductImage } from '../../utils/imageUtils';

const ProductImage = ({ product, className = '' }) => {
  const [errorCount, setErrorCount] = useState(0);
  const name = product?.productName || product?.name || 'Product';
  const category = product?.category || '';

  const primaryUrl = resolveProductImageUrl(product);
  const categoryFallbackUrl = getProductImage(category);

  // SVG fallback if remote network fails
  const svgFallback = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="100%" height="100%" fill="%231e293b"/><circle cx="200" cy="200" r="100" fill="%230f172a"/><text x="50%" y="48%" fill="%2310b981" font-size="18" font-family="sans-serif" font-weight="bold" text-anchor="middle">${encodeURIComponent(category || 'Eco Product')}</text><text x="50%" y="56%" fill="%2394a3b8" font-size="13" font-family="sans-serif" text-anchor="middle">${encodeURIComponent(name.slice(0, 24))}</text></svg>`;

  let currentSrc = primaryUrl;
  if (errorCount === 1) {
    currentSrc = categoryFallbackUrl !== primaryUrl ? categoryFallbackUrl : svgFallback;
  } else if (errorCount >= 2) {
    currentSrc = svgFallback;
  }

  return (
    <img
      src={currentSrc}
      alt={name}
      className={className}
      onError={() => setErrorCount(prev => prev + 1)}
      loading="lazy"
    />
  );
};

export default ProductImage;
