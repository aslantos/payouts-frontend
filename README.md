# payouts-frontend

Фронтенд B2B SaaS-платформы для учёта выполненных работ и пакетного расчёта выплат.

## Технологии

- **Vue 3** (Composition API, `<script setup>`) + **TypeScript**
- **Vite** — сборка и dev-сервер
- **Tailwind CSS** — стили
- **Vue Router** — маршрутизация
- **Pinia** — клиентское состояние
- **TanStack Vue Query** — серверное состояние (запросы, кэш)
- **axios** — HTTP-клиент

## Запуск проекта

```bash
# установить зависимости
npm install

# запустить dev-сервер (http://localhost:5173)
npm run dev

# собрать production-сборку
npm run build
```

## Структура проекта

Проект построен по методологии **Feature-Sliced Design (FSD)**.
Импорты идут только «вниз»: `pages → features → entities → shared`.

```
src/
├── app/        # инициализация: роутер, провайдеры, глобальные стили
├── pages/      # экраны приложения (композиция готовых блоков)
├── features/   # действия пользователя (одобрить, рассчитать, войти)
├── entities/   # бизнес-сущности (work-log, tariff, payout, user)
└── shared/     # переиспользуемое: api-клиент, ui-компоненты, утилиты
```
