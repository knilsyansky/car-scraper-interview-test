# CarSensor Scraper & Catalog - Тестовый Проект

Приложение каталога японских автомобилей с автоматическим веб-скрейпингом, JWT-авторизацией и несложным адаптивным интерфейсом. Проект демонстрирует практики современной веб-разработки, демонстрационный API и стратегии развёртывания.

**Статус:** ✅ Production Ready  
**Автор:** Roman (Romchik)

---

## 🔗 Live Развёртывание (Production)

| Компонент | URL | Хостинг |
|-----------|-----|---------|
| **Frontend** | https://car-scraper-interview-test-versel.vercel.app/ | Vercel |
| **Backend API** | https://car-scraper-roman2knils.amvera.io/ | Amvera |

> ⚠️ **Примечание:** Первая загрузка после простоя может занять ~60 секунд из-за холодного старта free-tier ( либо неоплаченные сервисы могут лежать )

---

## Содержание

1. [Обзор](#обзор)
2. [Быстрый старт](#быстрый-старт)
3. [Архитектура проекта](#архитектура-проекта)
4. [Стек технологий](#стек-технологий)
5. [Ключевые решения](#ключевые-решения)

---

## Обзор

**Поставленная задача:**  
Создать полнофункциональное приложение для скрейпинга объявлений б\у автомобилей с японского сайта CarSensor.net и представить их через современный веб-интерфейс с аутентификацией пользователя.

**Решение:**
- **Backend:** Node.js + Express REST API с веб-скрейпингом на Playwright, ORM Prisma, PostgreSQL
- **Frontend:** Next.js 16 с TypeScript, React 19, Tailwind CSS, архитектура FSD
- **Скрейпинг:** Автоматизированная почасовая задача через node-cron с слоем перевода Japanese→English
- **Безопасность:** JWT-авторизация с хешированием паролей bcrypt
- **Данные:** PostgreSQL с предотвращением дубликатов через external ID

---

## Быстрый старт

### Требования

- **Node.js** 18+
- **npm** 9+
- **PostgreSQL** 12+ (или аккаунт Supabase)
- **Git**

### Локальная разработка

#### 1. Клонирование и установка зависимостей

```bash
git clone https://github.com/knilsyansky/car-scraper-interview-test.git
cd car-scraper-interview-test

# Установка зависимостей backend
cd backend && npm install

# Установка зависимостей frontend (в новом терминале)
cd frontend && npm install
```

#### 2. Конфигурация переменных окружения

**Backend** (`backend/.env`):
```env
DATABASE_URL=postgresql://user:password@localhost:5432/car_scraper
NODE_ENV=development
PORT=3001
JWT_SECRET=your_jwt_secret_key_here
```

**Frontend** (`frontend/.env.local`):
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

#### 3. Инициализация базы данных

```bash
cd backend

# Генерирование Prisma клиента
npx prisma generate --schema=./src/prisma/schema.prisma

# Запуск миграций
npx prisma migrate dev

# (Опционально) Заполнение начальными данными
npm run seed\ cars
```

#### 4. Запуск development серверов

**Backend** (Терминал 1):
```bash
cd backend
npm run dev
# Сервер на http://localhost:3001
```

**Frontend** (Терминал 2):
```bash
cd frontend
npm run dev
# Приложение на http://localhost:3000
```

#### 5. Доступ к приложению

- UI: http://localhost:3000
- API: http://localhost:3001/api
- **Учётные данные по умолчанию:** 
  - Логин: `admin`
  - Пароль: `admin123`

---

## Архитектура проекта

### Backend архитектура (Layered Pattern)

```
backend/src/
├── routes/              # HTTP endpoints (Controller layer)
│   ├── auth.routes.js   # Endpoints аутентификации
│   ├── car.routes.js    # Endpoints со списком авто
│   └── index.js         # Агрегатор маршрутов
│
├── services/            # Бизнес-логика
│   └── scraper.service.js # Веб-скрейпинг, извлечение данных
│
├── repositories/        # Слой доступа к данным
│   └── car.repository.js # Запросы БД для авто
│
├── middleware/          # Express middleware
│   └── auth.middleware.js # Проверка JWT
│
├── config/              # Конфигурация
│   └── mapping.js       # Перевод японских→английских названий марок
│
├── prisma/              # ORM & база данных
│   ├── prisma.js        # Экземпляр Prisma клиента
│   └── schema.prisma    # Определения моделей данных
│
└── utils/               # Утилиты
    ├── seed.js          # Скрипт заполнения БД
    └── translator.js    # Вспомогательные методы нормализации
```

**Поток данных:**
```
Запрос → Routes → Middleware (проверка JWT) → Services (Бизнес-логика) → 
Repositories (Запрос БД) → Prisma → PostgreSQL
↓
Response (JSON)
```

**Pipeline скрейпинга:**
```
Cron Job (почасово) → Scraper Service → Playwright (headless браузер) → Перевод & Нормализация → 
Дедупликация (через externalId) → Prisma → PostgreSQL
```

### Frontend архитектура (Simplified FSD)

```
frontend/src/
├── app/                 # Страницы Next.js App Router
│   ├── layout.tsx       # Root layout (глобальные стили)
│   ├── page.tsx         # Home/список авто
│   ├── login/
│   │   └── page.tsx     # Форма входа
│   └── cars/
│       └── [id]/
│           └── page.tsx # Страница детально о авто
│
├── entities/            # Бизнес доменные сущности
│   └── car/
│       ├── model/       # Типы, интерфейсы
│       │   └── types.ts
│       ├── utils.ts     # Утилиты для авто
│       └── ui/          # Компоненты авто
│           ├── CarCard.tsx
│           ├── CarDetails.tsx
│           └── index.ts
│
├── features/            # Модули функций
│   └── auth/
│       ├── model/       # Логика аутентификации
│       │   └── login-action.ts (Server actions)
│       └── ui/
│           ├── LoginForm.tsx
│           └── index.ts
│
└── shared/              # Общие утилиты & компоненты
    ├── api/
    │   ├── constants.ts # API endpoints, конфигурация
    │   └── index.ts
    ├── lib/
    │   ├── providers.ts # Context провайдеры
    │   ├── clsx.ts      # classname утилиты
    │   └── index.ts
    └── ui/              # Основные UI компоненты
        ├── Button.tsx
        ├── Input.tsx
        └── index.ts
```

**Поток пользователя:**
```
запрос на /login → LoginForm (клиент) → loginAction (server action) → 
API /auth/login → JWT токен → сохранение в cookie → 
Редирект на /cars → CarListing (клиент) → apiFetch → 
API /cars (с auth токеном) → PostgreSQL → данные авто → отображение CarCard
```

---

## Стек технологий

### Backend

| Технология | Назначение | Версия | Почему выбрана |
|-----------|-----------|---------|-----------|
| **Node.js** | JavaScript runtime | 18+ | Требвоание из ТЗ |
| **Prisma** | ORM | 7.5.0 | Требование из ТЗ |
| **Playwright** | Headless браузер | 1.58.2 | Ради большего контроля |
| **Axios** | HTTP клиент | 1.13.6 | Promise-based |
| **CORS** | Cross-origin поддержка | 2.8.6 | Включение коммуникации фронт-бэк |

### Frontend

| Технология | Назначение | Версия | Почему выбрана |
|-----------|-----------|---------|-----------|
| **Next.js** | React фреймворк | 16.2.0 | Требвоание из ТЗ |
| **React** | UI библиотека | 19.2.4 | Требвоание из ТЗ |
| **TypeScript** | Статическая типизация | 5.0 | Требвоание из ТЗ |
| **Tailwind CSS** | Стилизация | 4.0 | Выбран для быстрого создания стилей\дизайна компонентов |

### Инфраструктура

| Технология | Назначение | Где использована |
|-----------|-----------|-------|
| **Docker** | Контейнеризация | Deploy backend |
| **Vercel** | Frontend хостинг | Frontend hosting, CI/CD |
| **Amvera** | Backend хостинг | Node.js API хостинг |
| **Supabase/Render** | PostgreSQL хостинг | Облачная БД |

---

## Ключевые решения

### 1. **Layered Backend архитектура**

**Решение:** Использование многоуровневой архитектуры (Routes → Services → Repositories)

**Почему:**
- Для простого тестового задания, не требующего продуманной архитектуры
- Проще тестировать (мокировать repositories/services)
- Переиспользование кода между endpoints

---

### 2. **Почасовое Cron (не event-driven)**

**Решение:** Node-cron запланированная задача на самом backend сервере

**Почему:**
- Требование из тз актуализировать данные раз в час
- Подходит для интервью/демо на малый масштаб

---

### 3. **Слой перевода (mapping.js)**

**Решение:** Централизованное JSON маппирование для японского→английского перевода

**Почему:**
- Требование перевода с японского из тз
- Легкий один файл для демо вместо I18N
- Отделяет преобразование данных от логики скрейпинга

**Компромисс:** Статическое маппирование (не real-time translation API)

---

### 4. **JWT + Cookies (не localStorage)**

**Решение:** Хранение JWT в **httpOnly cookies** (не в localStorage)

**Почему:**
- **Безопасность:** httpOnly предотвращает XSS кражу токена
- **CSRF:** Cookies автоматически отправляются с запросами (но нужен CSRF токен в production)
- **SSR:** Доступ к токену на сервере (Next.js server actions)

**Клиент:** Server action получает cookie через API `cookies()`

---

### 5. **Prisma ORM + postgres адаптер**

**Решение:** Использование Prisma с нативным PostgreSQL адаптером

**Почему:**
- Авто миграции & генерация типов
- Лучше чем raw SQL для быстрой разработки
- Встроенный connection pooling

---

### 6. **Next.js Server Composition**

**Решение:** Использование Next.js 16 App Router + Server Components + Server Actions

**Почему:**
- **Server Actions:** `loginAction` выполняется на сервере, использование React 19
- **Type safety:** Полный TypeScript 
- **Vercel оптимизирован:** Встроена поддержка развёртывания

---

### 8. **FSD (Feature-Sliced Design) - Упрощённый**

**Решение:** Организация frontend по (entity/feature) + (model/ui/utils)

**Почему:**
- **Масштабируемость:** Легко добавлять новые функции (auth, cars, reviews, etc.)
- **Переиспользование:** Car компоненты в отдельной папке, переиспользуемые везде
- **Ясность:** Разные слои (UI, бизнес-логика, типы) имеют чёткие дома

---

### 9. **Tailwind CSS** (utility-first)

**Решение:** Использование Tailwind для responsive design

**Почему:**
- Адаптивность из коробки
- Быстрая разработка без отвлечения на раздумья о дизайне

---

### 10. **Стратегия развёртывания**

**Backend:** Dockerfile + Amvera.com
- One-click deploy из Git
- Управление переменными окружения в UI
- PostgreSQL подключение через DATABASE_URL
- Database as code 

**Frontend:** Vercel
- Нативная поддержка Next.js
- Автоматические deploys на Git push
- Переменные окружения через dashboard (NEXT_PUBLIC_API_URL)
- CDN + распределение по edge включено

---

## 📝 Предположения проекта & Ограничения

### Что было реализовано:
✅ Веб-скрейпинг с Playwright (обработка JS-рендеринга)  
✅ JWT аутентификация с жёсткой кодировкой admin учётных данных  
✅ Почасовой автоматический скрейпинг через node-cron  
✅ Слой перевода японского→английского языка  
✅ Предотвращение дубликатов (уникальность externalId)  
✅ Адаптивный мобильный интерфейс (Tailwind CSS)  
✅ Пагинация и фильтрация на фронтенде  
✅ Production развёртывание (Vercel + Amvera)  

### Что можно улучшить:
⚠️ Вынос логики авторизации в сервис
⚠️ Обработка ошибок (retry логика для неудачных скрейпов)  
⚠️ Логирование (Winston/Bunyan для структурированных логов)
⚠️ Тестирование (Jest, Vitest для unit/integration тестов)
⚠️ Резервное копирование БД (Supabase auto-backups, но добавить Point-in-Time-Recovery)
⚠️ Регистрация пользователей (в настоящий момент только жёсткий admin)

---

## 📄 Лицензия

ISC

---

## 👤 Автор

**Roman**   
Интервью Тест Проект - 2026
