import request from 'supertest';
import app from '../src/app.js';
import './setup.js';

describe('Autenticación', () => {
  test('registra un usuario y no devuelve la contraseña', async () => {
    const response = await request(app).post('/api/auth/register').send({
      name: 'Ana Pérez', email: 'ana@example.com', password: 'ClaveSegura123'
    });
    expect(response.status).toBe(201);
    expect(response.body.user.email).toBe('ana@example.com');
    expect(response.body.user.password).toBeUndefined();
  });

  test('rechaza un correo duplicado', async () => {
    const user = { name: 'Ana Pérez', email: 'ana@example.com', password: 'ClaveSegura123' };
    await request(app).post('/api/auth/register').send(user);
    const response = await request(app).post('/api/auth/register').send(user);
    expect(response.status).toBe(409);
  });

  test('inicia sesión y devuelve un JWT', async () => {
    await request(app).post('/api/auth/register').send({
      name: 'Ana Pérez', email: 'ana@example.com', password: 'ClaveSegura123'
    });
    const response = await request(app).post('/api/auth/login').send({
      email: 'ana@example.com', password: 'ClaveSegura123'
    });
    expect(response.status).toBe(200);
    expect(response.body.token).toBeTruthy();
  });

  test('rechaza credenciales incorrectas', async () => {
    const response = await request(app).post('/api/auth/login').send({
      email: 'nadie@example.com', password: 'incorrecta'
    });
    expect(response.status).toBe(401);
  });
});
