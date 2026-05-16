# Petora — Frontend

Petora is a full-featured pet care platform built with **Next.js 16**, **React 19**, **TypeScript**, and **Material UI v5**. It connects pet owners with professional service agents (groomers, trainers, walkers, vets) and provides an online shop for pet products.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (Pages Router) |
| UI Library | React 19 |
| Language | TypeScript 5 |
| Component Library | Material UI (MUI) v5 |
| Styling | SCSS + Emotion (CSS-in-JS) |
| Animation | GSAP 3 |
| Date Utility | Moment.js |
| Package Manager | npm / yarn |

---

## Prerequisites

- **Node.js** v18 or higher
- **npm** v9+ or **yarn** v1.22+

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd petora-next
```

### 2. Install dependencies

```bash
npm install
# or
yarn install
```

### 3. Run the development server

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Build the application for production |
| `npm start` | Start the production server |

---

## Project Structure

```
petora-next/
├── pages/                    # Next.js pages (file-based routing)
│   ├── _app.tsx              # App wrapper — MUI theme provider
│   ├── _document.tsx         # HTML document template
│   ├── 404.tsx               # Custom 404 error page
│   ├── index.tsx             # Home page (/)
│   ├── admin/                # Admin panel pages (8 routes)
│   ├── service/              # Service pages (listing + booking)
│   ├── shop/                 # Shop pages (listing + product detail)
│   ├── community/            # Community forum
│   ├── discovery/            # Pet discovery & education
│   ├── mypage/               # User profile & dashboard
│   ├── cs/                   # Customer support
│   ├── checkout/             # Checkout & payment
│   └── api/                  # API route handlers
├── libs/
│   ├── components/           # All UI components organized by page
│   │   ├── homepage/         # Homepage section components
│   │   ├── servicepage/      # Service listing & booking components
│   │   ├── shoppage/         # Shop section components
│   │   ├── communitypage/    # Forum post components
│   │   ├── mypage/           # User dashboard components
│   │   ├── adminpage/        # Admin panel components
│   │   ├── account/          # Login / Register modal
│   │   ├── layout/           # Layout HOCs
│   │   ├── Top.tsx           # Global navigation bar
│   │   ├── Footer.tsx        # Global footer
│   │   ├── Basket.tsx        # Shopping cart
│   │   └── ContactUs.tsx     # Contact form
│   ├── data/                 # Mock data & TypeScript interfaces
│   └── MaterialTheme/        # MUI theme configuration
├── scss/
│   ├── variables.scss        # Global SCSS variables (font, colors)
│   ├── reset.scss            # CSS reset
│   ├── app.scss              # Global app styles
│   └── pc/                   # Page-specific stylesheets
│       ├── main.scss         # Root stylesheet (imports all others)
│       ├── adminpage/admin.scss
│       ├── homepage/homepage.scss
│       ├── servicepage/servicepage.scss
│       ├── shoppage/shoppage.scss
│       ├── communitypage/communitypage.scss
│       ├── mypage/mypage.scss
│       ├── discoverypage/discoverypage.scss
│       ├── checkout/checkout.scss
│       ├── cs/cspage.scss
│       └── errorpage/errorpage.scss
└── public/
    ├── img/                  # Static images
    │   ├── agents/           # Agent profile photos
    │   ├── certifications/   # Certification badge images
    │   ├── headers/          # Page header backgrounds
    │   ├── icons/            # SVG / PNG icons
    │   ├── logo/             # Brand assets
    │   ├── pets/             # Pet imagery
    │   ├── products/         # Product photos
    │   ├── profile/          # Default user avatar
    │   ├── services/         # Service category images
    │   └── social-media/     # Social platform graphics
    └── video/
        └── advertisement.mp4 # Homepage advertisement video
```

---

## Pages & Routes

| Route | Description |
|---|---|
| `/` | Home — company intro, services overview, top agents, shop highlights |
| `/service` | Service listing — browse and filter all pet services |
| `/service/booking` | Booking page — agent profile, date/time selection, booking dialog |
| `/shop` | Shop — pet products, nutrition, wellness items |
| `/shop/detail` | Product detail — images, description, add to cart |
| `/community` | Community forum — Free Board, News, Q&A tabs |
| `/discovery` | Pet discovery — educational content and pet breed insights |
| `/mypage` | My Page — profile, bookings, orders, favorites, notifications |
| `/cs` | Customer Support — help center and FAQ |
| `/checkout` | Checkout — address, payment method, order confirmation |
| `/admin` | Admin Dashboard — platform overview stats |
| `/admin/users` | User management |
| `/admin/agents` | Service agent management |
| `/admin/products` | Product management |
| `/admin/services` | Service management |
| `/admin/orders` | Order management |
| `/admin/community` | Community moderation |
| `/admin/cs` | FAQ & notice management |
| `/404` | Custom not-found page |

---

## Key Features

### User-Facing

**Home Page**
- Company introduction with stats badges
- Service categories showcase (Grooming, Walking, Training, Boarding, Day Care, Veterinary)
- Top-rated agents carousel
- Pet food & toy highlights
- Video advertisement section
- Social media links

**Services**
- Browse and filter services by category, location, price, rating
- Each service card shows price, duration, location, rating, review count, and total bookings
- Full booking flow: select date, fill pet details, confirm, receive booking reference

**Shop**
- Product listing with category filter and search
- Product detail page with image gallery, description, and quantity selector
- Shopping cart with item count badge in navigation
- Checkout: delivery address, credit card payment, order summary, confirmation screen

**Community Forum**
- Three boards: **Free Board** (discussions), **News** (announcements), **Q&A** (questions & answers)
- Post creation with image upload
- Views, likes, comment counts per post

**My Page**
- **User**: Profile info, billing info, bookings & orders, saved favorites, articles, notifications
- **Service Agent**: All of the above + service management (My Services, Upcoming, Completed, Booking Requests)
- Quick access button to Admin Panel

**Navigation**
- Language switcher (English / Korean) with flag images
- User profile dropdown with My Page, Notifications, Logout
- Animated sticky navbar that transforms on scroll

---

### Admin Panel

Accessible at `/admin`. Uses a dedicated layout (white sidebar, indigo accent) completely separate from the user-facing app.

| Section | Capabilities |
|---|---|
| **Dashboard** | Platform stats cards (users, agents, products, orders, revenue) |
| **Users** | Table with search, filter by status; toggle active / paused / blocked |
| **Agents** | Agent profiles with rating, bookings, certifications; approve/suspend; edit details |
| **Products** | Full CRUD — add/edit/delete with image upload, pricing, discount percent, stock |
| **Services** | Edit service info, assigned agent (name + username), category, location, price range, status |
| **Orders** | Order table with inline status updates; detail drawer showing items and customer info |
| **Community** | Board-tabbed post list; hide/delete posts with confirmation dialog; write new posts |
| **CS** | FAQ management (grouped by category, expandable rows); Notice management with type badges |

---

## Component Architecture

### Layout HOCs

Pages are wrapped with layout higher-order components from `libs/components/layout/`:

```tsx
// User-facing pages with full nav + footer
export default withLayoutMain(HomePage);

// Pages with simplified layout (no footer ContactUs)
export default withLayoutBasic(BookingPage);

// Admin pages — no public nav or footer
export default withAdminLayout(AdminDashboard);
```

### Admin Components

All admin components live in `libs/components/adminpage/` and are scoped under `#admin-wrap` to prevent any style bleed into user-facing pages.

All MUI `Drawer` and `Dialog` components in admin pages use `disablePortal` so that SCSS rules scoped under `#admin-wrap` apply correctly to portal-rendered content.

---

## Styling Guide

Styling uses a **hybrid approach**:

1. **SCSS files** — structural and page-wide styles, scoped under page wrapper IDs
2. **MUI `className`** — component-level styles defined in SCSS and applied via class names

### SCSS Scope Conventions

```scss
#pc-wrap {               /* All user-facing pages */
  .service-card { ... }
}

#admin-wrap {            /* Admin panel — completely isolated */
  .admin-card { ... }
  .admin-agt-* { ... }   /* Agent manager classes   */
  .admin-prd-* { ... }   /* Product manager classes */
  .admin-ord-* { ... }   /* Order manager classes   */
}
```

### MUI Theme

Custom theme configured in `libs/MaterialTheme/index.ts`:

| Token | Value |
|---|---|
| Primary color | `#410075` (deep purple) |
| Font family | `Assistant` (Google Fonts) |
| Input height | 48px (global MUI override) |
| Border radius | Customized per component |

---

## Data Layer

The project currently uses **mock data** for all features. No backend API is required to run the app locally.

| File | Contents |
|---|---|
| `libs/data/adminMockData.ts` | Users, agents, products, services, orders, posts, FAQs, notices with full TypeScript interfaces |
| `libs/data/userProfile.ts` | Mock user personal info and billing info |
| `libs/components/servicepage/Services.tsx` | Mock service listing items |

When connecting to a real backend, create a `.env.local` file:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000
```

---

## Browser Support

| Browser | Support |
|---|---|
| Chrome | Latest |
| Safari | Latest |
| Firefox | Latest |
| Edge | Latest |

> **Note:** The application is currently desktop-first. Mobile responsiveness is partially implemented.

---

## Contributing

1. Create a feature branch from `develop`
2. Follow existing naming conventions — components in PascalCase, SCSS classes in kebab-case
3. Keep admin styles scoped under `#admin-wrap` and user-facing styles under `#pc-wrap`
4. Run `npm run build` before opening a PR to verify no TypeScript or build errors

---

## License

This project is private. All rights reserved © Petora.
