export function notFound(req, res) {
  res.status(404).json({ message: `Ruta no encontrada: ${req.method} ${req.originalUrl}` });
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) return next(error);

  if (error.name === 'ValidationError') {
    return res.status(400).json({ message: 'Datos inválidos.', errors: error.message });
  }
  if (error.code === 11000) {
    return res.status(409).json({ message: 'El correo electrónico ya está registrado.' });
  }
  if (error.name === 'CastError') {
    return res.status(400).json({ message: 'Identificador inválido.' });
  }

  console.error(error);
  return res.status(500).json({ message: 'Error interno del servidor.' });
}
