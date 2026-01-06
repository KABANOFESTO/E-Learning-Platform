import Joi from 'joi';

export const registerSchema = Joi.object({
	name: Joi.string().min(2).max(50).required(),
	email: Joi.string().email().required(),
	password: Joi.string().min(6).max(128).required(),
	profilePicture: Joi.string().uri().allow('').optional(),
	role: Joi.string().valid('admin', 'instructor', 'learner').optional(),
});

export const loginSchema = Joi.object({
	email: Joi.string().email().required(),
	password: Joi.string().required(),
});
