import jwt from 'jsonwebtoken';

export function authMiddleware(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Se requiere un token Bearer.' });
  }

  try {
    const payload = jwt.verify(header.slice(7), process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    return next();
  } catch {
    return res.status(401).json({ message: 'Token inválido o expirado.' });
  }
}
