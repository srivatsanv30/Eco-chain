import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const { brand, category, minPrice, maxPrice, ecoScore, energyRating, sort, search, page = 1, limit = 12, ...otherQueries } = req.query;
    const query = {};
    if (brand) query.brand = { $regex: brand, $options: 'i' };
    if (category) query.category = { $regex: category, $options: 'i' };
    if (minPrice || maxPrice) query.price = { ...(minPrice && { $gte: Number(minPrice) }), ...(maxPrice && { $lte: Number(maxPrice) }) };
    if (ecoScore) query.ecoScore = { $gte: Number(ecoScore) };
    if (energyRating) query.energyRating = energyRating;
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { brand: { $regex: search, $options: 'i' } }, { description: { $regex: search, $options: 'i' } }];
    
    // Handle dynamic spec filtering (e.g. ?RAM=8GB)
    Object.keys(otherQueries).forEach(key => {
      if (key !== 'page' && key !== 'limit' && key !== 'sort' && key !== 'ids') {
        query[`specs.${key}`] = { $regex: otherQueries[key], $options: 'i' };
      }
    });

    const sortOptions = { price: { price: 1 }, '-price': { price: -1 }, ecoScore: { ecoScore: -1 }, newest: { createdAt: -1 }, repairability: { repairabilityScore: -1 } };
    const sortBy = sortOptions[sort] || { ecoScore: -1 };

    const total = await Product.countDocuments(query);
    const products = await Product.find(query).sort(sortBy).limit(Number(limit)).skip((Number(page) - 1) * Number(limit));

    res.json({ success: true, data: products, totalPages: Math.ceil(total / Number(limit)), currentPage: Number(page), total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, data: product });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ success: false, message: 'Product not found' });
    res.json({ success: true, message: 'Product removed' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const compareProducts = async (req, res) => {
  try {
    const { ids } = req.query;
    if (!ids) return res.status(400).json({ success: false, message: 'Product IDs required' });
    const idArray = ids.split(',');
    const products = await Product.find({ _id: { $in: idArray } });
    res.json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
