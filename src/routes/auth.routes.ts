import { Router } from 'express';
import { register, login } from '../controllers/auth.controller';
import { upload } from '../helpers/cloudinary.helper';
import passport from '../helpers/passport.helper';

const router = Router();

router.post('/register', upload.single('profilePicture'), register);
router.post('/login', login);

export default router;
