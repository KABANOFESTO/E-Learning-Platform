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
        expect(res.body).toHaveProperty('id');
        expect(res.body.status).toBe('REJECTED');
        expect(res.body.reason).toBe('Incomplete documentation');
    });

    it('should return 400 for invalid company registration data', async () => {
        const res = await request(app)
            .post('/api/v1/company/register')
            .send({ name: '', email: 'not-an-email', address: '', phone: '' });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should return 400 for duplicate company registration', async () => {
        // Register once
        await request(app)
            .post('/api/v1/company/register')
            .send({
                name: 'Dup Company',
                email: 'dupcompany@example.com',
                address: '123 Dup St',
                phone: '123-456-7890',
            });
        const res = await request(app)
            .post('/api/v1/company/register')
            .send({
                name: 'Dup Company',
                email: 'dupcompany@example.com',
                address: '123 Dup St',
                phone: '123-456-7890',
            });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should return 404 when rejecting a non-existent company', async () => {
        const res = await request(app)
            .post('/api/v1/company/nonexistentid/reject')
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ reason: 'No such company' });
        expect(res.statusCode).toBe(404);
        expect(res.body).toHaveProperty('error');
    });

    it('should return 400 when rejecting a company not in PENDING state', async () => {

        const uniqueSuffix = Date.now();
        const uniqueEmail = `approvedcompany+${uniqueSuffix}@example.com`;
        const uniqueName = `Already Approved ${uniqueSuffix}`;
        const regRes = await request(app)
            .post('/api/v1/company/register')
            .send({
                name: uniqueName,
                email: uniqueEmail,
                address: '789 Approved St',
                phone: '555-555-5555',
            });
        expect(regRes.statusCode).toBe(201);
        expect(regRes.body).toHaveProperty('id');
        const approvedCompanyId = regRes.body.id;
        if (!approvedCompanyId) {
            // Debug output if registration fails
            console.error('Company registration failed:', regRes.body);
        }
        expect(approvedCompanyId).toBeDefined();

        await request(app)
            .post(`/api/v1/company/${approvedCompanyId}/approve`)
            .set('Authorization', `Bearer ${adminToken}`);

        // Ensure the company still exists after approval
        const company = await companyPrisma.company.findUnique({ where: { id: approvedCompanyId } });
        expect(company).not.toBeNull();

        const res = await request(app)
            .post(`/api/v1/company/${approvedCompanyId}/reject`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({ reason: 'Too late' });
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });

    it('should return 400 when rejecting a company with no reason', async () => {
        // Register a company
        const regRes = await request(app)
            .post('/api/v1/company/register')
            .send({
                name: 'No Reason Co',
                email: 'noreason@example.com',
                address: 'No Reason St',
                phone: '000-000-0000',
            });
        const noReasonCompanyId = regRes.body.id;
        const res = await request(app)
            .post(`/api/v1/company/${noReasonCompanyId}/reject`)
            .set('Authorization', `Bearer ${adminToken}`)
            .send({});
        expect(res.statusCode).toBe(400);
        expect(res.body).toHaveProperty('error');
    });
});

afterAll(async () => {
    server.close();
    await prisma.user.deleteMany({ where: { email: { in: ['admin@example.com'] } } });
    await companyPrisma.company.deleteMany({ where: { email: { in: ['testcompany@example.com', 'anothercompany@example.com'] } } });
});
