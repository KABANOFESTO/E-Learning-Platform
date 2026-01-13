import { prisma } from '../models/user.model';
import { sendApprovalEmail, sendRejectionEmail } from '../helpers/email.helper';
import { randomBytes } from 'crypto';
import bcrypt from 'bcrypt';

export async function registerCompany(data: { name: string; email: string; address: string; phone: string }) {
	return prisma.company.create({ data });
}

export async function approveCompany(companyId: string) {
	const password = randomBytes(8).toString('hex');
	const hashedPassword = await bcrypt.hash(password, 10);
	const company = await prisma.company.update({
		where: { id: companyId },
		data: { status: 'APPROVED', reason: null },
	});
	await sendApprovalEmail(company.email, password);
	return company;
}

export async function rejectCompany(companyId: string, reason: string) {
	// Find the company first
	const company = await prisma.company.findUnique({ where: { id: companyId } });
	if (!company) {
		const error: any = new Error('Company not found');
		error.status = 404;
		throw error;
	}
	// If company exists but is not PENDING, return 400
	if (company.status !== 'PENDING') {
		const error: any = new Error('Only PENDING companies can be rejected');
		error.status = 400;
		throw error;
	}
	const updatedCompany = await prisma.company.update({
		where: { id: companyId },
		data: { status: 'REJECTED', reason },
	});
	await sendRejectionEmail(updatedCompany.email, reason);
	return updatedCompany;
}
