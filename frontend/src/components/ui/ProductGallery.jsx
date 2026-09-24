import { useState } from 'react';
import ProductImage from './ProductImage';

const ProductGallery = ({ product }) => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Compile list of all available images
  const allImages = [];
  if (product?.primaryImage) {
    allImages.push({ url: product.primaryImage, type: 'Primary' });
  }
  
  if (product?.images && product.images.length > 0) {
    product.images.forEach(img => {
      // Avoid duplicate of primary image
      if (img.url !== product.primaryImage) {
        allImages.push(img);
      }
    });
  }

  // Fallback to legacy image field if no modern fields exist
  if (allImages.length === 0 && product?.image) {
    allImages.push({ url: product.image, type: 'Legacy' });
  }

  if (allImages.length === 0) {
    return <ProductImage product={product} className="w-full h-full object-cover" />;
  }

  const activeImage = allImages[activeIndex] || allImages[0];

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="w-full aspect-square rounded-xl overflow-hidden bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <ProductImage 
          product={{ ...product, primaryImage: activeImage.url }} 
          className="w-full h-full object-contain p-4" 
        />
      </div>

      {/* Thumbnails */}
      {allImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
          {allImages.map((img, index) => (
            <button
              key={index}
              onClick={() => setActiveIndex(index)}
              className={`relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                activeIndex === index 
                  ? 'border-emerald-500 shadow-md' 
                  : 'border-transparent hover:border-gray-300 dark:hover:border-gray-600'
              }`}
            >
              <ProductImage 
                product={{ ...product, primaryImage: img.url }} 
                className="w-full h-full object-cover bg-white" 
              />
              {img.type && (
                <span className="absolute bottom-0 inset-x-0 bg-black/50 text-white text-[10px] text-center py-0.5">
                  {img.type}
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductGallery;
