import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save } from 'lucide-react';
import { useSelector } from 'react-redux';
import ProductImageSelector from './ProductImageSelector';

const INITIAL_STATE = {
  productName: '', brand: '', modelNumber: '', productVariant: '', category: 'Smartphones', price: '', primaryImage: '', description: '',
  ecoScore: 50, carbonFootprint: 0, repairabilityScore: 5, lifespanYears: 3,
  maintenanceCostYear: 0, energyRating: 'A',
};

const CATEGORIES = [
  'Smartphones', 'Laptops', 'Tablets', 'TVs', 'Washing Machines', 
  'Refrigerators', 'Air Conditioners', 'Audio', 'Smartwatches', 
  'Cameras', 'Monitors', 'Accessories'
];

const ProductModal = ({ isOpen, onClose, product, onSave }) => {
  const { mode } = useSelector(state => state.theme);
  const isDark = mode === 'dark';
  const [formData, setFormData] = useState(INITIAL_STATE);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setFormData({
        productName: product.productName || product.name || '',
        brand: product.brand || '',
        modelNumber: product.modelNumber || '',
        productVariant: product.productVariant || '',
        category: product.category || 'Smartphones',
        price: product.price || '',
        primaryImage: product.primaryImage || product.image || '',
        description: product.description || '',
        ecoScore: product.ecoScore || 50,
        carbonFootprint: product.carbonFootprint || 0,
        repairabilityScore: product.repairabilityScore || 5,
        lifespanYears: product.lifespanYears || 3,
        maintenanceCostYear: product.maintenanceCostYear || 0,
        energyRating: product.energyRating || 'A',
      });
    } else {
      setFormData(INITIAL_STATE);
    }
  }, [product, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value
    }));
  };

  const handleImageSelect = (url) => {
    setFormData(prev => ({ ...prev, primaryImage: url }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // ensure name exists for legacy backend compat temporarily if needed, though we updated backend schema
    await onSave({ ...formData, name: formData.productName, image: formData.primaryImage });
    setLoading(false);
  };

  const inputClass = `w-full px-3 py-2 rounded-xl border text-sm focus:ring-2 outline-none transition-all ${
    isDark 
      ? 'bg-slate-800 border-slate-700 text-slate-100 focus:border-eco-500 focus:ring-eco-500/20 placeholder-slate-500' 
      : 'bg-slate-50 border-slate-200 text-slate-900 focus:border-eco-500 focus:ring-eco-500/20 placeholder-slate-400'
  }`;

  const labelClass = `block text-xs font-semibold mb-1 uppercase tracking-wider ${isDark ? 'text-slate-400' : 'text-slate-500'}`;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        />
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className={`relative w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col rounded-3xl shadow-2xl border ${
            isDark ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
          }`}
        >
          {/* Header */}
          <div className={`px-6 py-4 border-b flex items-center justify-between ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
            <h2 className={`text-lg font-bold ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
              {product ? 'Edit Product' : 'Add New Product'}
            </h2>
            <button onClick={onClose} className={`p-1.5 rounded-lg transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'}`}>
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto scrollbar-thin flex-1">
            <form id="product-form" onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={labelClass}>Product Name</label>
                  <input required name="productName" value={formData.productName} onChange={handleChange} className={inputClass} placeholder="e.g. Galaxy S24" />
                </div>
                <div>
                  <label className={labelClass}>Brand</label>
                  <input required name="brand" value={formData.brand} onChange={handleChange} className={inputClass} placeholder="e.g. Samsung" />
                </div>
                <div>
                  <label className={labelClass}>Model Number</label>
                  <input required name="modelNumber" value={formData.modelNumber} onChange={handleChange} className={inputClass} placeholder="e.g. SM-S921B" />
                </div>
                <div>
                  <label className={labelClass}>Product Variant</label>
                  <input name="productVariant" value={formData.productVariant} onChange={handleChange} className={inputClass} placeholder="e.g. 256GB Titanium Black" />
                </div>
                <div>
                  <label className={labelClass}>Category</label>
                  <select name="category" value={formData.category} onChange={handleChange} className={inputClass}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Price (₹)</label>
                  <input required type="number" min="0" name="price" value={formData.price} onChange={handleChange} className={inputClass} />
                </div>
                
                <div className="md:col-span-2">
                  <ProductImageSelector 
                    brand={formData.brand} 
                    modelNumber={formData.modelNumber} 
                    onImageSelect={handleImageSelect}
                  />
                  {formData.primaryImage && (
                    <div className="mt-2 text-sm text-emerald-600 dark:text-emerald-400 flex items-center gap-1 font-medium">
                      ✓ Image selected
                    </div>
                  )}
                  {/* Hidden input to ensure primaryImage is required if we want it to be, or just keep it optional */}
                  <input type="hidden" name="primaryImage" value={formData.primaryImage} />
                </div>

                <div className="md:col-span-2">
                  <label className={labelClass}>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleChange} className={`${inputClass} resize-none h-20`} />
                </div>
              </div>

              <div className="pt-4 mt-2 border-t border-dashed border-slate-300 dark:border-slate-700">
                <h3 className={`text-sm font-bold mb-4 ${isDark ? 'text-eco-400' : 'text-eco-600'}`}>Sustainability & Lifecycle Metrics</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Eco Score (0-100)</label>
                    <input required type="number" min="0" max="100" name="ecoScore" value={formData.ecoScore} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Carbon (kg CO2)</label>
                    <input required type="number" min="0" name="carbonFootprint" value={formData.carbonFootprint} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Repairability (0-10)</label>
                    <input required type="number" step="0.1" min="0" max="10" name="repairabilityScore" value={formData.repairabilityScore} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Lifespan (Years)</label>
                    <input required type="number" min="1" name="lifespanYears" value={formData.lifespanYears} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Maintenance (₹/yr)</label>
                    <input required type="number" min="0" name="maintenanceCostYear" value={formData.maintenanceCostYear} onChange={handleChange} className={inputClass} />
                  </div>
                  <div>
                    <label className={labelClass}>Energy Rating</label>
                    <select name="energyRating" value={formData.energyRating} onChange={handleChange} className={inputClass}>
                      <option value="A+++">A+++</option>
                      <option value="A++">A++</option>
                      <option value="A+">A+</option>
                      <option value="A">A</option>
                      <option value="B">B</option>
                      <option value="C">C</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>
          </div>

          {/* Footer */}
          <div className={`px-6 py-4 border-t flex items-center justify-end gap-3 ${isDark ? 'border-slate-800 bg-slate-900/50' : 'border-slate-100 bg-slate-50'}`}>
            <button onClick={onClose} type="button" className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-300' : 'hover:bg-slate-200 text-slate-600'}`}>
              Cancel
            </button>
            <button form="product-form" type="submit" disabled={loading} className="px-5 py-2 rounded-xl bg-eco-600 hover:bg-eco-700 text-white text-sm font-bold shadow-lg transition-colors flex items-center gap-2 disabled:opacity-50">
              {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Save className="w-4 h-4" /> Save Product</>}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ProductModal;
