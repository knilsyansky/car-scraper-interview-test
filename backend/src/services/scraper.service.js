import { chromium } from "playwright";
import {
	normalizeMileage,
	normalizePrice,
	translateBrand,
} from "#utils/translator.js";
import { prisma } from "../prisma/prisma.js";

const host = "https://www.carsensor.net/usedcar/search.php?SKIND=1";
const cardSelector = ".cassette";
const labelSelector = ".cassetteMain__label + p";
const titleSelector = ".cassetteMain__title";
const priceSelector = ".totalPrice__mainPriceNum";
const mileageSelector = ".specList__detailBox:nth-child(2) .specList__data";
const yearSelector = ".specList__detailBox:nth-child(1) .specList__data";
const imgSelector = ".cassetteMain__mainImg img";

const selectors = {
	cardSelector,
	labelSelector,
	titleSelector,
	priceSelector,
	mileageSelector,
	yearSelector,
	imgSelector,
};

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

			await page.waitForSelector(cardSelector, { timeout: 15000 });

			const rawCars = await page.evaluate(
				({
					cardSelector,
					labelSelector,
					titleSelector,
					priceSelector,
					mileageSelector,
					yearSelector,
					imgSelector,
				}) => {
					const items = document.querySelectorAll(cardSelector);
					return Array.from(items).map((item) => {
						// Вытаскиваем сырые данные через DOM селекторы
						const title =
							item.querySelector(titleSelector)?.innerText || "";
						const label =
							item.querySelector(labelSelector)?.innerText || "";
						const priceText =
							item.querySelector(priceSelector)?.innerText || "";
						const mileageText =
							item.querySelector(mileageSelector)?.innerText ||
							"";
						const yearText =
							item.querySelector(yearSelector)?.innerText || "";
						const img = item.querySelector(imgSelector) || null;
						let imgUrl =
							img?.getAttribute("data-original") ||
							imgElement?.src;
						if (imgUrl && imgUrl.startsWith("//")) {
							imgUrl = "https:" + imgUrl;
						}

						return {
							externalId: item.id || Math.random().toString(),
							title: title,
							label: label,
							rawPrice: priceText,
							rawMileage: mileageText,
							year: parseInt(yearText) || null,
							imageUrl: imgUrl,
						};
					});
				},
				selectors,
			);

			console.log(`${rawCars.length} raw datas`);

			for (const raw of rawCars) {
				const rawBrand = raw.label;
				const brandTrimmedTitle = raw.title
					.split(rawBrand)
					.filter(Boolean);
				const model = brandTrimmedTitle[0]
					.trim()
					.split(/\s+/)
					.splice(0, 2)
					.join(" ");

				const cleanData = {
					externalId: raw.externalId,
					brand: translateBrand(rawBrand),
					model: model || "Model",
					year: raw.year,
					mileage: normalizeMileage(raw.rawMileage),
					price: normalizePrice(raw.rawPrice),
					imageUrl: raw.imageUrl,
					details: { originalTitle: raw.title },
				};

				await prisma.car.upsert({
					where: { externalId: cleanData.externalId },
					update: {
						price: cleanData.price,
						mileage: cleanData.mileage,
						updatedAt: new Date(),
					},
					create: cleanData,
				});
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
