
import request from 'supertest';
import app, { server } from '../server';
import { prisma } from '../models/user.model';

describe('Auth API', () => {
  it('should register a new user', async () => {
    const uniqueEmail = `testuser_${Date.now()}@example.com`;
    const res = await request(app)
      .post('/api/v1/auth/register')
      .field('name', 'Test User')
      .field('email', uniqueEmail)
      .field('password', 'password123');
    expect(res.statusCode).toBe(201);
    expect(res.body.user).toHaveProperty('id');
    expect(res.body.user.role).toBe('learner');
  });

  it('should login a user', async () => {
    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({ email: 'testuser@example.com', password: 'password123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user).toHaveProperty('id');
  });
});

afterAll(async () => {
  server.close();
  await prisma.$disconnect();
});
