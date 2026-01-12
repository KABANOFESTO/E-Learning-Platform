import app, { server } from '../server';
import request from 'supertest';
import { prisma } from '../models/user.model';
import { prisma as companyPrisma } from '../models/company.model';

describe('Company API', () => {
    let adminToken: string;
    let companyId: number;

    beforeAll(async () => {

        const adminEmail = 'admin@example.com';
        const adminPassword = 'adminpass';
        await prisma.user.create({
            data: {
                name: 'Admin User',
                email: adminEmail,
                password: await require('bcrypt').hash(adminPassword, 10),
                profilePicture: '',
                role: 'admin',
            },
        });

        const res = await request(app)
            .post('/api/v1/auth/login')
            .send({ email: adminEmail, password: adminPassword });
        adminToken = res.body.token;
    });

    it('should register a new company', async () => {
        const res = await request(app)
            .post('/api/v1/company/register')
            .send({
                name: 'Test Company',
                email: 'testcompany@example.com',
                address: '123 Test St',
                phone: '123-456-7890',
            });
        expect(res.statusCode).toBe(201);
        expect(res.body).toHaveProperty('id');
        companyId = res.body.id;
    });

    it('should approve the company', async () => {
        const res = await request(app)
            .post(`/api/v1/company/${companyId}/approve`)
            .set('Authorization', `Bearer ${adminToken}`);
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('APPROVED');
    });

    it('should reject the company', async () => {
        const regRes = await request(app)
            .post('/api/v1/company/register')
            .send({
                name: 'Another Company',
                email: 'anothercompany@example.com',
                address: '456 Another St',
                phone: '0785206973',
            });
        const anotherCompanyId = regRes.body.id;

        const res = await request(app)
            .post(`/api/v1/company/${anotherCompanyId}/reject`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ reason: 'Incomplete documentation' });
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe('REJECTED');
        expect(res.body.reason).toBe('Incomplete documentation');
    });
});

afterAll(async () => {
    server.close();
    await prisma.user.deleteMany({ where: { email: { in: ['admin@example.com'] } } });
    await companyPrisma.company.deleteMany({ where: { email: { in: ['testcompany@example.com', 'anothercompany@example.com'] } } });
});
