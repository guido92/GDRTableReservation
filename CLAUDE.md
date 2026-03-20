# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tavoli GDR is an Italian-language web app for booking tabletop RPG and board game sessions. Masters create gaming sessions, players join them. It also includes a D&D 5e character generator with AI-powered creation and PDF sheet output.

## Commands

```bash
npm run dev      # Start dev server at localhost:3000
npm run build    # Production build
npm run start    # Start production server
npm run lint     # ESLint
```

Requires Node.js >= 22.0.0. Docker deployment via `docker-compose up --build` (exposes port 3010).

## Environment Variables

Copy `.env.example` to `.env`. Required:
- `GEMINI_API_KEY` - Google Gemini API key for AI character generation
- `BREVO_API_KEY` - Brevo (Sendinblue) v3 API key (starts with `xkeysib-`). Also read from `SMTP_PASSWORD` as fallback.
- `ADMIN_EMAIL` - Fallback admin email for notifications

## Architecture

**Next.js 16 App Router** with TypeScript strict mode. Path alias `@/*` maps to `./src/*`.

### Data Layer
- **No database** - all data persisted in `src/data/db.json` as a JSON file
- `src/lib/db.ts` provides CRUD: `getSessions()`, `saveSession()`, `updateSession()`, `getSessionById()`
- Auto-cleanup removes sessions older than 7 days and deletes their uploaded images
- `src/lib/db-delete.ts` handles deletion with image cleanup
- Data types defined in `src/types/index.ts` (`Session`, `Player`) and `src/types/dnd.ts` (`CharacterData`)

### API Routes (`src/app/api/`)
- `/api/sessions` - GET all, POST new session
- `/api/sessions/[id]` - PATCH update, DELETE session
- `/api/sessions/[id]/join` - POST player join (sends email notifications async, non-blocking)
- `/api/upload` - Image upload (Sharp resizes to 1200x800 WebP)
- `/api/dnd/ai-generate` - Gemini-powered D&D character generation
- `/api/dnd/generate` - PDF character sheet generation using `pdf-lib` with template at `public/templates/character-sheet-template.pdf`
- `/api/dnd/chat` - Chat-based character building
- `/api/dnd/{backgrounds,classes,feats,items,spells}` - D&D 5e data endpoints

### Email System (`src/lib/emailService.ts`)
Uses Brevo API v3 directly (not SMTP). On player join, sends two emails:
1. Organizer notification (`inviaEmailPrenotazioneTavolo`)
2. Player confirmation (`inviaEmailConfermaGiocatore`)

Emails are fire-and-forget; failures don't block API responses.

### D&D Character Generation
- AI path: Gemini generates character data, validated and hydrated with official features via `src/lib/character-logic.ts`
- Manual path: Step-by-step wizard (`src/components/ManualWizardSteps.tsx`)
- PDF pipeline: Generate -> Validate (`src/lib/pdf-validator.ts`) -> Auto-fix (`src/lib/data-fixer.ts`) -> Regenerate if needed
- All D&D data (classes, races, spells, etc.) in `src/data/*.ts` with Italian translations in `src/data/translations.ts`
- Supports both 2014 and 2024 D&D rules (`is2024` flag)

### Frontend
- CSS Modules with a Glassmorphism design system defined in `src/app/globals.css` (CSS variables for theming)
- Framer Motion for animations, Lucide React for icons
- Client components marked with `'use client'`; server components are default
- Home page uses `force-dynamic` revalidation

### Admin
- Admin panel at `/admin` is PIN-protected (hardcoded PIN "1234")

## Conventions

- UI is entirely in Italian. All user-facing strings, D&D terms, and labels use Italian.
- Session types are `'GDR'` or `'BOARDGAME'` (union type, not enum).
- Uploaded images go to `public/uploads/` and are processed by Sharp into WebP.
- `next.config.ts` uses `output: 'standalone'` for Docker. Allows remote images from any HTTPS host.
- Docker volumes persist `src/data/` and `public/uploads/` across rebuilds.
