import Joi from 'joi';

export const companyRegisterSchema = Joi.object({
	name: Joi.string().min(2).max(100).required(),
	email: Joi.string().email().required(),
	address: Joi.string().min(5).max(255).required(),
	phone: Joi.string().min(7).max(20).required(),
});
