import { prisma } from '../models/user.model';
import { Role } from '../models/role.enum';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../config/jwt.config';

export async function registerUser({ name, email, password, profilePicture, role }: { name: string; email: string; password: string; profilePicture?: string; role?: string }) {
	const existingUser = await prisma.user.findUnique({ where: { email } });
	if (existingUser) throw new Error('Email already in use');
	const hashedPassword = await bcrypt.hash(password, 10);
	let userRole: Role = Role.LEARNER;
	if (role && Object.values(Role).includes(role as Role)) {
		userRole = role as Role;
	}
	const user = await prisma.user.create({
		data: {
			name,
			email,
			password: hashedPassword,
			profilePicture: profilePicture || '',
			role: userRole,
		},
	});
	return user;
}

export async function loginUser({ email, password }: { email: string; password: string }) {
	const user = await prisma.user.findUnique({ where: { email } });
	if (!user) throw new Error('Invalid credentials');
	const valid = await bcrypt.compare(password, user.password);
	if (!valid) throw new Error('Invalid credentials');
	const token = jwt.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
	return { token, user };
}
