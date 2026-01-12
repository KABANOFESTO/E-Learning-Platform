import { Router } from 'express';
import { register, approve, reject } from '../controllers/company.controller';
import { authenticateToken, isAdmin } from '../middlewares/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/:id/approve', authenticateToken, isAdmin, approve);
router.post('/:id/reject', authenticateToken, isAdmin, reject);

export default router;
