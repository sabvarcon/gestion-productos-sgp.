import { Router } from 'express';
import {
  listProducts, getProduct, createProduct, updateProduct, deleteProduct
} from '../controllers/productController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { idRule, productRules, validate } from '../middleware/validators.js';

const router = Router();
router.use(authMiddleware);
router.get('/', listProducts);
router.post('/', productRules, validate, createProduct);
router.get('/:id', idRule, validate, getProduct);
router.put('/:id', idRule, productRules, validate, updateProduct);
router.delete('/:id', idRule, validate, deleteProduct);
export default router;
