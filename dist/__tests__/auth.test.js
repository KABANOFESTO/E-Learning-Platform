"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const server_1 = __importDefault(require("../server"));
describe('Auth API', () => {
    it('should register a new user', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/api/v1/auth/register')
            .field('name', 'Test User')
            .field('email', 'testuser@example.com')
            .field('password', 'password123');
        expect(res.statusCode).toBe(201);
        expect(res.body.user).toHaveProperty('id');
        expect(res.body.user.role).toBe('learner');
    });
    it('should login a user', async () => {
        const res = await (0, supertest_1.default)(server_1.default)
            .post('/api/v1/auth/login')
            .send({ email: 'testuser@example.com', password: 'password123' });
        expect(res.statusCode).toBe(200);
        expect(res.body).toHaveProperty('token');
        expect(res.body.user).toHaveProperty('id');
    });
});
