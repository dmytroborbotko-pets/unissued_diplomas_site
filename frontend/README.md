# Unissued Diplomas - Frontend

React + Vite + Tailwind CSS + React Router application for the Unissued Diplomas memorial website.

## Tech Stack

- **React 19** - UI library
- **Vite** - Build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router v7** - Client-side routing
- **Axios** - HTTP client for Strapi API
- **Framer Motion** - Animation library
- **i18next** - Internationalization (6 languages: EN, UK, DE, IT, JA, ES)

## Responsive Breakpoints

- **Smaller Mobile**: < 480px (default)
- **Larger Mobile**: 481px-768px (`mobile-lg:`)
- **Larger Tablets, Laptops**: 769px-1279px (`tablet:`)
- **Desktop**: > 1280px (`desktop:`)

### Usage Example:
```jsx
<div className="text-sm tablet:text-base desktop:text-lg">
  Responsive text
</div>
```

## Project Structure

```
frontend/
├── src/
│   ├── components/       # Reusable components
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   └── Achievements.jsx
│   ├── services/        # API calls to Strapi
│   │   └── strapi.js
│   ├── contexts/        # React contexts
│   │   └── LanguageContext.jsx
│   ├── i18n/           # i18next configuration
│   │   └── config.js
│   ├── hooks/          # Custom React hooks
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles + Tailwind
├── public/             # Static assets
├── .env.example        # Environment variables example
└── package.json
```

## Setup

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file:
```bash
cp .env.example .env
```

Edit `.env`:
```
VITE_STRAPI_URL=http://localhost:1337
```

### 3. Run Development Server
```bash
npm run dev
```

Visit: http://localhost:5173

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Pages

1. **Home** (`/`) - Main landing page with all sections:
   - Hero with 4 action cards
   - What's the Project About
   - Link to achievements page
   - Parallax quote section
   - Hall of Diplomas (SoundCloud + slider)
   - World map with exhibitions
   - Donation section
   - The Mission & The Team
   - Memorial section
   - Sponsors & Partners
   - FAQ accordion
   - Footer

2. **Achievements** (`/:year-achievements`) - Yearly achievements gallery
   - Example: `/2023-achievements`, `/2024-achievements`

## Language Support

The app supports 6 languages:
- English (en)
- Ukrainian (uk)
- German (de)
- Italian (it)
- Japanese (ja)
- Spanish (es)

Language selection is available in the header dropdown and persists in localStorage.

## Strapi Integration

All content is fetched from Strapi CMS:

```javascript
import { getSponsors, getFAQs, getAchievements } from './services/strapi';

// Fetch sponsors in current language
const sponsors = await getSponsors('en');

// Fetch achievements for specific year
const achievements = await getAchievements(2023, 'uk');
```

## Deployment

### Build for Production
```bash
npm run build
```

The `dist/` folder will contain the production build.

### Deploy to Vercel
1. Push code to GitHub
2. Import project in Vercel
3. Set environment variable: `VITE_STRAPI_URL`
4. Deploy

## Color Scheme

- **Brand Black**: `#0A0A0A` - Main background
- **Brand Red**: `#B91C1C` - Memorial red accent
- **White**: `#FFFFFF` - Text and highlights

Use with Tailwind: `bg-brand-black`, `text-brand-red`, `border-brand-white`

## Next Steps

- [ ] Implement all 13 home page sections
- [ ] Add parallax effects with Framer Motion
- [ ] Integrate SoundCloud embed
- [ ] Create diploma slider component
- [ ] Implement interactive world map
- [ ] Add FAQ accordion with animations
- [ ] Build achievements photo gallery
- [ ] Connect all components to Strapi
- [ ] Add loading states and error handling
- [ ] Optimize images and performance
