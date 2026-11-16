import Product from '../models/Product.js';

export async function listProducts(req, res, next) {
  try {
    const products = await Product.find({ owner: req.user.id }).sort({ createdAt: -1 });
    return res.json({ count: products.length, products });
  } catch (error) { return next(error); }
}

export async function getProduct(req, res, next) {
  try {
    const product = await Product.findOne({ _id: req.params.id, owner: req.user.id });
    if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
    return res.json({ product });
  } catch (error) { return next(error); }
}

export async function createProduct(req, res, next) {
  try {
    const product = await Product.create({ ...req.body, owner: req.user.id });
    return res.status(201).json({ message: 'Producto creado.', product });
  } catch (error) { return next(error); }
}

export async function updateProduct(req, res, next) {
  try {
    const product = await Product.findOneAndUpdate(
      { _id: req.params.id, owner: req.user.id },
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
    return res.json({ message: 'Producto actualizado.', product });
  } catch (error) { return next(error); }
}

export async function deleteProduct(req, res, next) {
  try {
    const product = await Product.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!product) return res.status(404).json({ message: 'Producto no encontrado.' });
    return res.json({ message: 'Producto eliminado correctamente.' });
  } catch (error) { return next(error); }
}
