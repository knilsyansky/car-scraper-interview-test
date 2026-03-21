import { Router } from "express";
import { prisma } from '../prisma/prisma.js';

const router = Router();

router.get('/', async (req, res) => {
    const { page = 1, limit = 10, brand } = req.query;
    const skip = (page -1) * limit;

    try {
        const [cars, total] = await Promise.all([
            prisma.car.findMany({
                where: brand ? { brand } : {},
                take: Number(limit),
                skip: Number(skip),
                orderBy: { createdAt: 'desc' }
            }),
            prisma.car.count({ where: brand ? { brand } : {} })
        ]);

        res.json({
            data: cars,
            meta: {
                total,
                page: Number(page),
                lastPage: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

router.get('/:id', async (req, res) => {
    const car = await prisma.car.findUnique({ where: { id: req.params.id } });
    if (!car) return res.status(404).json({ message: 'Не найдено' });
    res.json(car);
});

export default router;