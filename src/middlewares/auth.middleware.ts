import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.config';

export function authenticateToken(req: Request, res: Response, next: NextFunction) {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];
	if (!token) return res.status(401).json({ error: 'No token provided' });
	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) return res.status(403).json({ error: 'Invalid token' });
		(req as any).user = user;
		next();
	});
}

export function isAdmin(req: Request, res: Response, next: NextFunction) {
	const user = (req as any).user;
	if (user.role !== 'admin') {
		return res.status(403).json({ error: 'Access denied' });
	}
	next();
}
