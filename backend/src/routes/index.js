import { Router } from 'express';
import authRoutes from '#routes/auth.routes.js';
import carRoutes from '#routes/car.routes.js';
import { authMiddleware } from '#middleware/auth.middleware.js'

const router = Router();

router.use('/auth', authRoutes);
router.use('/cars', authMiddleware, carRoutes);

export default router;