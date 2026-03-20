import { chromium } from 'playwright';

async function scrapeCars() {
  // 1. Запуск браузера (headless: true - без окна, false - если хочешь видеть процесс)
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36'
  });
  const page = await context.newPage();

  try {
    console.log('Открываем CarSensor...');
    await page.goto('https://www.carsensor.net', {
      waitUntil: 'domcontentloaded', // Ждем загрузки структуры
      timeout: 60000
    });

    // 2. Ждем появления карточек машин
    await page.waitForSelector('.cassetteItem');

    // 3. Вытаскиваем данные через evaluate (это быстрее всего)
    const cars = await page.evaluate(() => {
      const items = document.querySelectorAll('.cassetteItem');
      return Array.from(items).map(item => {
        // ВАЖНО: Селекторы нужно проверить через Inspect Element на сайте!
        return {
          external_id: item.id || Math.random().toString(), // Пример
          brand_model: item.querySelector('.cassetteItem_header_title')?.innerText.trim(),
          price: item.querySelector('.cassetteItem_price .num')?.innerText,
          year: item.querySelector('.cassetteItem_spec_item:nth-child(1) .num')?.innerText,
          mileage: item.querySelector('.cassetteItem_spec_item:nth-child(2) .num')?.innerText,
          image_url: item.querySelector('img')?.src
        };
      });
    });

    console.log(`Найдено машин: ${cars.length}`);
    return cars;

  } catch (error) {
    console.error('Ошибка скрапинга:', error);
  } finally {
    await browser.close();
  }
}

scrapeCars()

export default { scrapeCars };
