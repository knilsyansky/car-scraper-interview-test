# CarSensor Scraper & Catalog (Fullstack Test Task)

Приложение для мониторинга карточек автомобилей с японского сайта CarSensor.net. Включает в себя автоматический скрапер, API с JWT-авторизацией и адаптивный фронтенд.

## Ссылки (Deploy)
- **Frontend (Vercel):** https://car-scraper-interview-test-versel.vercel.app/
- **Backend (Render):** https://car-scraper-roman2knils.amvera.io/
*Примечание: Первая загрузка за какой-то период может длиться до одной минуты*

## Стек технологий
- **Frontend:** Next 16 (App Router), TypeScript, Tailwind CSS, React 19.
- **Backend:** Node, Express, PostgreSQL (Supabase), JWT, Cheerio (scraping), node-cron.
- **Архитектура:** simplified FSD (frontend) / layered (backend).
