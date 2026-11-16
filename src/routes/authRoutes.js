import { Router } from 'express';
import { register, login, me } from '../controllers/authController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';
import { registerRules, loginRules, validate } from '../middleware/validators.js';

const router = Router();
router.post('/register', registerRules, validate, register);
router.post('/login', loginRules, validate, login);
router.get('/me', authMiddleware, me);
export default router;
