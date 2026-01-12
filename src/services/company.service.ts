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
	const company = await prisma.company.update({
		where: { id: companyId },
		data: { status: 'REJECTED', reason },
	});
	await sendRejectionEmail(company.email, reason);
	return company;
}
