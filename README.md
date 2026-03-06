# Psychic — Vedic Astrology Platform

Personalized Vedic astrology readings powered by real sidereal calculations.

## Quick Start

```bash
npm install
npx prisma db push
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Architecture

### Astrology Engine (`src/lib/astrology/`)

Self-contained Vedic astrology calculation engine with 4 layers:

| Layer | File(s) | Purpose |
|-------|---------|---------|
| **1. Astronomy** | `julian.ts`, `astronomy.ts` | Julian Day, planetary longitudes (Meeus/VSOP87), Lahiri ayanamsa, ascendant |
| **2. Vedic Derivations** | `chart.ts`, `houses.ts`, `nakshatra.ts`, `dasha.ts` | Sidereal conversion, Whole Sign houses, 27 nakshatras, Vimshottari Dasha |
| **3. Interpretation** | `interpretation.ts` | Rule-based personality, career, relationship, and dasha period themes |
| **4. AI Context** | `ai-context.ts` | Compact structured object for LLM Q&A grounding |

**Entry point:** `index.ts` → `generateChartReading(input)` returns complete `AstrologyEngineResponse`.

### Key Details

- **Zodiac:** Sidereal (Lahiri ayanamsa)
- **Houses:** Whole Sign system
- **Dasha:** Vimshottari (120-year cycle) with Mahadasha + Antardasha
- **Planets:** Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu
- **Accuracy:** ±1-2° (sufficient for sign/nakshatra analysis; upgrade path: Swiss Ephemeris)

### API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/chart/generate` | Generate chart from birth data |
| GET | `/api/chart/[id]` | Retrieve saved chart |
| POST | `/api/chart/[id]/questions` | Ask questions about chart |
| POST | `/api/contact` | Submit contact form |
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Sign in |

### Database

SQLite via Prisma. Models: `User`, `BirthProfile`, `ChartResult`, `QaMessage`, `ContactSubmission`.

### Upgrading

- **Better accuracy:** Replace `astronomy.ts` calculations with Swiss Ephemeris
- **Real LLM Q&A:** Implement the `LLMService` interface in `questions/route.ts` with OpenAI/Gemini
- **Geocoding:** Swap `NominatimGeocodingProvider` for Google Maps via the provider interface
- **Interpretation:** Enhance `interpretation.ts` rules or use LLM rewriting

## Tech Stack

Next.js 14 · TypeScript · Tailwind CSS · Prisma · SQLite

## Environment Variables

Copy `.env.example` to `.env`. See file for all options.
