import { body, param, validationResult } from 'express-validator';

export const registerRules = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('El nombre debe tener entre 2 y 80 caracteres.'),
  body('email').trim().isEmail().withMessage('Correo electrónico inválido.').normalizeEmail(),
  body('password').isLength({ min: 8, max: 72 }).withMessage('La contraseña debe tener entre 8 y 72 caracteres.')
];

export const loginRules = [
  body('email').trim().isEmail().withMessage('Correo electrónico inválido.').normalizeEmail(),
  body('password').notEmpty().withMessage('La contraseña es obligatoria.')
];

export const productRules = [
  body('name').trim().isLength({ min: 2, max: 120 }).withMessage('El nombre debe tener entre 2 y 120 caracteres.'),
  body('description').optional().isString().isLength({ max: 1000 }),
  body('price').isFloat({ min: 0 }).withMessage('El precio debe ser un número igual o mayor que cero.'),
  body('stock').optional().isInt({ min: 0 }).withMessage('El inventario debe ser un entero no negativo.')
];

export const idRule = [param('id').isMongoId().withMessage('Identificador de producto inválido.')];

export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ message: 'Error de validación.', errors: errors.array() });
  next();
}
