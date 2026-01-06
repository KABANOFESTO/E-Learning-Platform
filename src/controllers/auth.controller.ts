import { registerUser, loginUser } from '../services/auth.service';
import { registerSchema, loginSchema } from '../validators/auth.validator';
import { Request, Response } from 'express';
import passport from '../helpers/passport.helper';

export async function register(req: Request, res: Response) {
	try {
		const { error, value } = registerSchema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });
		let profilePicture = value.profilePicture;
		if (req.file && (req.file as any).path) {
			profilePicture = (req.file as any).path;
		}
		const user = await registerUser({ ...value, profilePicture });
		res.status(201).json({ user });
	} catch (err: any) {
		res.status(400).json({ error: err.message });
	}
}

export async function login(req: Request, res: Response) {
	try {
		const { error, value } = loginSchema.validate(req.body);
		if (error) return res.status(400).json({ error: error.details[0].message });
		const { token, user } = await loginUser(value);
		res.status(200).json({ token, user });
	} catch (err: any) {
		res.status(400).json({ error: err.message });
	}
}
