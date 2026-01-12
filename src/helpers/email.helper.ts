import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT) || 587,
	secure: false,
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

export async function sendApprovalEmail(to: string, password: string) {
	return transporter.sendMail({
		from: process.env.SMTP_FROM || 'no-reply@e_learning.com',
		to,
		subject: 'Your Company Account Approved',
		text: `Congratulations! Your company account has been approved.\n\nYour temporary password: ${password}\nPlease log in and change your password.`,
	});
}

export async function sendRejectionEmail(to: string, reason: string) {
	return transporter.sendMail({
		from: process.env.SMTP_FROM || 'no-reply@e_learning.com',
		to,
		subject: 'Your Company Registration Was Rejected',
		text: `We regret to inform you that your company registration was rejected.\nReason: ${reason}`,
	});
}
