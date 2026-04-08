# Wall Calendar

A realistic interactive wall calendar built with Next.js App Router, React, Tailwind CSS, and Framer Motion.

This project is designed to feel like a physical hanging wall calendar instead of a standard digital calendar UI. It includes a hero image, printed-style month layout, calendar grid, notes section, and page flip animation.

## What Is In This Project

- Physical wall-calendar inspired UI
- Hero image section with month/year overlay
- Spiral binding and hanging-paper presentation
- 3D page flip animation using Framer Motion
- Printed-style monthly calendar grid
- Date range selection
- Notes section with saved text in `localStorage`
- Range task notes tied to selected dates
- India holiday data support
- Mobile and desktop responsive layout

## Tech Stack

- Next.js 15
- React 19
- TypeScript
- Tailwind CSS
- Framer Motion

## Main Files

- [app/page.tsx](/C:/Users/suman/OneDrive/Desktop/folder/app/page.tsx)
  Main page entry that renders the calendar.

- [app/layout.tsx](/C:/Users/suman/OneDrive/Desktop/folder/app/layout.tsx)
  Global layout, metadata, and fonts.

- [app/globals.css](/C:/Users/suman/OneDrive/Desktop/folder/app/globals.css)
  Global styling, paper textures, wall background, and visual effects.

- [app/not-found.tsx](/C:/Users/suman/OneDrive/Desktop/folder/app/not-found.tsx)
  Custom not-found page for the App Router.

- [components/calendar/wall-calendar.tsx](/C:/Users/suman/OneDrive/Desktop/folder/components/calendar/wall-calendar.tsx)
  Main interactive wall calendar component and UI behavior.

- [components/calendar/calendar-utils.ts](/C:/Users/suman/OneDrive/Desktop/folder/components/calendar/calendar-utils.ts)
  Date helpers, calendar day generation, and range logic.

- [components/calendar/holiday-data.ts](/C:/Users/suman/OneDrive/Desktop/folder/components/calendar/holiday-data.ts)
  India holiday data and holiday lookup helpers.

- [components/calendar/month-data.ts](/C:/Users/suman/OneDrive/Desktop/folder/components/calendar/month-data.ts)
  Month theme content such as subtitle, image, and month event metadata.

- [components/calendar/month-controls.tsx](/C:/Users/suman/OneDrive/Desktop/folder/components/calendar/month-controls.tsx)
  Previous and next month controls.

- [components/calendar/spiral-binding.tsx](/C:/Users/suman/OneDrive/Desktop/folder/components/calendar/spiral-binding.tsx)
  Decorative spiral binding for the calendar top.

## Public Assets

- `public/image.png`
  Main hero image used in the calendar.

- `public/favicon.ico`
  Favicon for the app.

## How To Start

1. Install dependencies:

```bash
npm install
```

2. Run the development server:

```bash
npm run dev
```

3. Open the app in your browser:

```text
http://localhost:3000
```

## Other Commands

Type check:

```bash
npx tsc --noEmit
```

Production build:

```bash
npm run build
```

Start production server:

```bash
npm run start
```

## Notes

- Notes and range tasks are stored in browser `localStorage`.
- Holiday coverage is strongest for the included India holiday dataset in `holiday-data.ts`.
- If the dev server behaves strangely after large UI changes, stop it and restart `npm run dev`.
