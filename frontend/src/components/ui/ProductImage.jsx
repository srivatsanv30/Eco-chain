import { useState } from 'react';

const ProductImage = ({ product, className = '' }) => {
  const [failed, setFailed] = useState(false);
  const imageUrl = product?.primaryImage || (product?.images && product.images.length > 0 ? product.images[0].url : null) || product?.image;
  const name = product?.productName || product?.name || 'Product';

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

  // Clear "Image unavailable" state for missing/broken images
  return (
    <div className={`flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-500 rounded border border-dashed border-gray-300 dark:border-gray-700 ${className}`}>
      <svg className="w-8 h-8 mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
      </svg>
      <span className="text-xs font-medium uppercase tracking-wider">Image Unavailable</span>
    </div>
  );
};

export default ProductImage;
