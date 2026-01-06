# E-Learning Platform

A modern Node.js/TypeScript backend for an e-learning platform, featuring user authentication, role management, and file uploads with Prisma ORM and PostgreSQL.

## Features
- User registration & login (JWT-based)
- Role-based access: admin, instructor, learner
- Profile picture upload (Cloudinary)
- Prisma ORM with PostgreSQL
- Comprehensive test coverage (Jest)

## Getting Started

### 1. Clone & Install
```bash
git clone <repo-url>
cd E-Learning-Platform
npm install
```

### 2. Environment Setup
Create a `.env` file in the root (see `.env.example`):
- Set your `DATABASE_URL` for PostgreSQL
- Add Cloudinary and JWT config

### 3. Database
```bash
npx prisma migrate dev --name init
```

### 4. Run the App
```bash
npm run dev
```

### 5. Test & Coverage
```bash
npm run test
npm run test:coverage
```

## API Endpoints
- `POST /api/v1/auth/register` — Register user (form-data: name, email, password, [profilePicture], [role])
- `POST /api/v1/auth/login` — Login (JSON: email, password)

---

**Built with Node.js, Express, TypeScript, Prisma, PostgreSQL, Jest.**
