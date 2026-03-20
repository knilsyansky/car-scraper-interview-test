import { Router } from 'express';
import authRoutes from '#routes/auth.routes.js';
import carRoutes from '#routes/car.routes.js';

const router = Router();

router.use('/auth', authRoutes);
router.use('/cars', carRoutes);

export default router;