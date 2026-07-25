# Анна Шаверина — сайт карьерного консультанта

Продающий одностраничный сайт (лендинг) карьерного консультанта Анны Шавериной.
Позиционирование: **карьерный консультант с мышлением хедхантера**.

Статический сайт без сборки и зависимостей — открывается как есть, быстро грузится и хорошо индексируется.

## Структура

```
index.html                 — вся страница (семантическая разметка + SEO + JSON-LD)
assets/css/styles.css      — дизайн-система (editorial / warm ivory + clay accent)
assets/js/main.js          — анимации, меню, счётчики, FAQ, форма  ← здесь CONFIG
assets/img/                — фото и иконки
robots.txt · sitemap.xml · site.webmanifest — SEO-инфраструктура
```

## Что нужно заполнить перед публикацией

1. **Контакты** — в `assets/js/main.js`, блок `CONFIG` в самом верху:
   - `tg` — ссылка на Telegram
   - `hh` — профиль/резюме на hh.ru
   - `dzen` — канал в Дзене
   - `email` — рабочая почта
   - `formEndpoint` — URL для приёма заявок (Formspree / Getform и т.п.).
     Пока пусто — форма показывает подтверждение и открывает Telegram.
2. **Домен** — заменить `https://anna-shaverina.ru/` на реальный в:
   `index.html` (canonical, og:*, JSON-LD), `robots.txt`, `sitemap.xml`.
3. **Отзывы и кейсы** — при желании заменить на реальные с согласия клиентов.

## Дизайн и контент

- Копирайтинг — по материалам позиционирования и UTP; тон: экспертный, тёплый,
  конкретный, без инфостиля (методология JTBD / Ильяхов).
- Дизайн-принципы — из скилла *make-interfaces-feel-better* (concentric radius,
  тени вместо жёстких границ, staggered reveal, tabular-nums, scale-on-press).
- Шрифты: Playfair Display (заголовки) + Manrope (текст), Google Fonts.

## Локальный запуск

```bash
python3 -m http.server 5173
```
Открыть http://localhost:5173

## Публикация на GitHub Pages

Settings → Pages → Deploy from branch → `main` / root.
Для кастомного домена добавить файл `CNAME` с доменом и настроить DNS.
