import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class CarRepository {
    async create(data) {
        return prisma.car.upsert({
            where: { externalId: data.externalId },
            update: data,
            create:data
        });
    }

    async findAll({ skip, take, brand }) {
        return prisma.car.findMany({
            where: brand ? { brand } : {},
            skip,
            take,
            orderBy: { createdAt: 'desc' },
        });
    }
}

export default new CarRepository();