import { registerCompany, approveCompany, rejectCompany } from '../services/company.service';
import { companyRegisterSchema } from '../validators/company.validator';
import { Request, Response } from 'express';

export async function register(req: Request, res: Response) {
	const { error, value } = companyRegisterSchema.validate(req.body);
	if (error) return res.status(400).json({ error: error.details[0].message });
	try {
		const company = await registerCompany(value);
		res.status(201).json(company);
	} catch (err: any) {
		res.status(400).json({ error: err.message });
	}
}

export async function approve(req: Request, res: Response) {
	try {
		const company = await approveCompany(req.params.id);
		res.status(200).json(company);
	} catch (err: any) {
		res.status(400).json({ error: err.message });
	}
}

export async function reject(req: Request, res: Response) {
	const { reason } = req.body;

	if (!reason) return res.status(400).json({ error: 'Reason is required' });
	try {
		const company = await rejectCompany(req.params.id, reason);
		res.status(200).json(company);
	} catch (err: any) {
		if (err.status === 404) {
			res.status(404).json({ error: err.message });
		} else {
			res.status(400).json({ error: err.message });
		}
	}
}
