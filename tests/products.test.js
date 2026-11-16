import request from 'supertest';
import app from '../src/app.js';
import './setup.js';

async function getToken(email = 'owner@example.com') {
  await request(app).post('/api/auth/register').send({
    name: 'Propietario', email, password: 'ClaveSegura123'
  });
  const login = await request(app).post('/api/auth/login').send({
    email, password: 'ClaveSegura123'
  });
  return login.body.token;
}

describe('CRUD de productos', () => {
  test('bloquea el acceso sin JWT', async () => {
    const response = await request(app).get('/api/products');
    expect(response.status).toBe(401);
  });

  test('crea, consulta, actualiza y elimina un producto', async () => {
    const token = await getToken();
    const created = await request(app).post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Teclado', description: 'Mecánico', price: 850, stock: 10 });

    expect(created.status).toBe(201);
    const id = created.body.product._id;

    const list = await request(app).get('/api/products').set('Authorization', `Bearer ${token}`);
    expect(list.status).toBe(200);
    expect(list.body.count).toBe(1);

    const updated = await request(app).put(`/api/products/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Teclado actualizado', price: 900, stock: 8 });
    expect(updated.status).toBe(200);
    expect(updated.body.product.price).toBe(900);

    const fetched = await request(app).get(`/api/products/${id}`).set('Authorization', `Bearer ${token}`);
    expect(fetched.status).toBe(200);

    const removed = await request(app).delete(`/api/products/${id}`).set('Authorization', `Bearer ${token}`);
    expect(removed.status).toBe(200);
  });

  test('rechaza un precio negativo', async () => {
    const token = await getToken();
    const response = await request(app).post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Producto', price: -1, stock: 1 });
    expect(response.status).toBe(400);
  });

  test('un usuario no puede consultar productos de otro usuario', async () => {
    const tokenA = await getToken('a@example.com');
    const tokenB = await getToken('b@example.com');
    const created = await request(app).post('/api/products').set('Authorization', `Bearer ${tokenA}`)
      .send({ name: 'Privado', price: 10, stock: 1 });
    const response = await request(app).get(`/api/products/${created.body.product._id}`)
      .set('Authorization', `Bearer ${tokenB}`);
    expect(response.status).toBe(404);
  });
});
