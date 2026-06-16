# Контекст проекта payouts-frontend

## Что это
Фронтенд B2B SaaS для учёта работ и расчёта выплат (multi-tenant).
Я — junior solo frontend, учусь по ходу. Объясняй шаги, не усложняй.

## Стек
Vue 3 + TS + Vite, Composition API + <script setup>, Tailwind CSS,
Vue Router, Pinia (клиентское состояние), TanStack Vue Query (серверное),
axios. Архитектура: Feature-Sliced Design (app/pages/features/entities/shared).

## Бэкенд
Django, задеплоен на Railway: https://happy-forgiveness-production-caca.up.railway.app
Авторизация — JWT (токен в ответе, шлём в заголовке Authorization: Bearer).
Логин: POST /api/auth/login/ { username, password } -> { access_token }
Локально работаю через прокси в vite.config.ts на облачный бэк.

## Текущий этап
Сверстаны формы регистрации и входа с анимацией переключения (sliding panel).
Написана логика логина (useLogin через Vue Query, authStore в Pinia).
Сейчас: подключаю реальный вход к задеплоенному бэку, проверяю авторизацию.

## Как мне помогать
Пишу код в основном с помощью ассистента. К каждому куску — короткий разбор
"что делает / почему так". Подсвечивай типичные ошибки новичка. Не усложняй.