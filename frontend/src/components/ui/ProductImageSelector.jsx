import { useState } from 'react';
import ProductImage from './ProductImage';

// Mock external image search API for demonstration
const mockSearchImages = async (brand, modelNumber) => {
  // In a real app, this would query a product catalog API (e.g. Icecat, Amazon PA API, etc)
  return new Promise(resolve => {
    setTimeout(() => {
      resolve([
        { url: `https://loremflickr.com/600/600/${brand},${modelNumber},front/all`, type: 'Front' },
        { url: `https://loremflickr.com/600/600/${brand},${modelNumber},back/all`, type: 'Back' },
        { url: `https://loremflickr.com/600/600/${brand},${modelNumber},side/all`, type: 'Side' },
      ]);
    }, 1000);
  });
};

const ProductImageSelector = ({ brand, modelNumber, onImageSelect }) => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [selected, setSelected] = useState(null);
  const [customUrl, setCustomUrl] = useState('');

  const handleSearch = async () => {
    if (!brand || !modelNumber) return;
    setLoading(true);
    try {
      const images = await mockSearchImages(brand, modelNumber);
      setResults(images);
    } catch (error) {
      console.error('Failed to fetch images', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (img) => {
    setSelected(img.url);
    onImageSelect(img.url);
  };

  const handleCustomUrlSubmit = (e) => {
    e.preventDefault();
    if (customUrl) {
      setSelected(customUrl);
      onImageSelect(customUrl);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
      <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-white">Product Image Selection</h3>
      
      <div className="flex gap-4 mb-4 items-end">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Brand</label>
          <input 
            type="text" 
            value={brand} 
            readOnly
            className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-lg p-2 text-slate-600 dark:text-slate-400"
          />
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Model Number</label>
          <input 
            type="text" 
            value={modelNumber} 
            readOnly
            className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-lg p-2 text-slate-600 dark:text-slate-400"
          />
        </div>
        <button 
          onClick={handleSearch}
          disabled={!brand || !modelNumber || loading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
        >
          {loading ? 'Searching...' : 'Search Verified Images'}
        </button>
      </div>

      {results.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Select Verified Image</h4>
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
            {results.map((img, i) => (
              <div 
                key={i} 
                onClick={() => handleSelect(img)}
                className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all aspect-square ${
                  selected === img.url ? 'border-emerald-500 shadow-md ring-2 ring-emerald-500/50' : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                }`}
              >
                <div className="w-full h-full bg-white relative">
                  <img src={img.url} alt={`${brand} ${modelNumber}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[10px] text-center py-1 font-medium">
                    {img.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Or provide custom image URL</label>
        <form onSubmit={handleCustomUrlSubmit} className="flex gap-2">
          <input 
            type="url" 
            value={customUrl}
            onChange={(e) => setCustomUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
            className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded-lg p-2 text-slate-900 dark:text-white"
          />
          <button type="submit" className="bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-900 dark:text-white px-4 py-2 rounded-lg font-medium transition-colors">
            Use URL
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductImageSelector;
