import { Router } from 'express';
import { getDashboard } from '../controllers/dashboard.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

router.use(authenticateToken);
router.get('/', getDashboard);

export default router;
