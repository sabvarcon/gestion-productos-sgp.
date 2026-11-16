import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });

    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, password: hashedPassword });
    return res.status(201).json({
      message: 'Usuario registrado correctamente.',
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) { return next(error); }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: 'Credenciales incorrectas.' });
    }

    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { subject: user.id, expiresIn: process.env.JWT_EXPIRES_IN || '2h' }
    );
    return res.json({
      message: 'Inicio de sesión correcto.',
      token,
      user: { id: user.id, name: user.name, email: user.email }
    });
  } catch (error) { return next(error); }
}

export async function me(req, res, next) {
  try {
    const user = await User.findById(req.user.id).select('name email');
    if (!user) return res.status(404).json({ message: 'Usuario no encontrado.' });
    return res.json({ user });
  } catch (error) { return next(error); }
}
