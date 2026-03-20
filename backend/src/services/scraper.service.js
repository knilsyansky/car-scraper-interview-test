import { chromium } from "playwright";
import {
	normalizeMileage,
	normalizePrice,
	translateBrand,
} from "#utils/translator.js";

const host = "https://www.carsensor.net";
const cardSelector = ".cassette";
const titleSelector = ".cassetteMain__title";
const priceSelector = ".totalPrice__mainPriceNum";
const mileageSelector =
	".cassetteItem_spec_item:nth-child(2) .specList__emphasisData";
const yearSelector =
	".cassetteItem_spec_item:nth-child(1) .specList__emphasisData";
const imgSelector = ".cassetteMain__mainImg";

class ScraperService {
	async run() {
		console.log("scraper start");

		const browser = await chromium.launch({ headers: true });

		try {
			const page = await browser.newPage();

			await page.goto(host, {
				waitUntil: "domcontentloaded",
				timeout: 60000,
			});

			await page.waitForSelector(cardSelector, { timeout: 10000 });

			const rawCars = await page.evaluate(() => {
				const items = document.querySelectorAll(cardSelector);
				return Array.from(items).map((item) => {
					// Вытаскиваем сырые данные через DOM селекторы
					const title =
						item.querySelector(titleSelector)?.innerText || "";
					const priceText =
						item.querySelector(priceSelector)?.innerText || "";
					const mileageText =
						item.querySelector(mileageSelector)?.innerText || "";
					const yearText =
						item.querySelector(yearSelector)?.innerText || "";
					const img = item.querySelector(imgSelector)?.src || "";

					return {
						externalId: item.id || Math.random().toString(),
						title: title,
						rawPrice: priceText,
						rawMileage: mileageText,
						year: parseInt(yearText) || null,
						imageUrl: img,
					};
				});
			});

			console.log(`${rawCars.length} raw datas`);

			for (const raw of rawCars) {
				const parts = raw.fullTitle.split(/\s+/);
				const rawBrand = parts[0];
				const model = parts[1];

				const cleanData = {
					externalId: raw.externalId,
					brand: translateBrand(rawBrand),
					model: model || "Model",
					year: raw.year,
					mileage: normalizeMileage(raw.rawMileage),
					price: normalizePrice(raw.rawPrice),
					imageUrl: raw.imageUrl,
					details: { originalTitle: raw.fullTitle },
				};

                console.log('to be ')

				// await prisma.car.upsert({
				// 	where: { externalId: cleanData.externalId },
				// 	update: {
				// 		price: cleanData.price,
				// 		mileage: cleanData.mileage,
				// 		updatedAt: new Date(),
				// 	},
				// 	create: cleanData,
				// });
			}

			console.log("scraping done, data in db");
		} catch (error) {
			console.error("error in scraping: ", error);
		} finally {
			await browser.close();
		}
	}
}

export default new ScraperService();
