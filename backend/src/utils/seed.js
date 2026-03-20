import { prisma } from "../prisma/prisma.js";

async function seed() {
	console.log("Mock start");

	const mockCars = [
		{
			externalId: "jp101",
			brand: "Toyota",
			model: "Prius",
			year: 2020,
			mileage: 45000,
			price: 2500000,
			imageUrl: "https://placehold.er",
			details: {
				color: "White",
				transmission: "AT",
			},
		},
		{
			externalId: "jp-102",
			brand: "Nissan",
			model: "Leaf",
			year: 2019,
			mileage: 32000,
			price: 1800000,
			imageUrl: "https://placehold.co",
			details: { color: "Blue", transmission: "Electric" },
		},
		{
			externalId: "jp-103",
			brand: "Honda",
			model: "Civic",
			year: 2021,
			mileage: 15000,
			price: 2900000,
			imageUrl: "https://placehold.co",
			details: { color: "Black", transmission: "CVT" },
		},
	];

	try {
		for (const car of mockCars) {
			await prisma.car.upsert({
				where: { externalId: car.externalId },
				update: car,
				create: car,
			});
		}
		console.log("Mocks gone");
	} catch (error) {
		console.error("Mocks fails: ", error);
	} finally {
		await prisma.$disconnect();
	}
}

seed();