# PRD - Tavoli GDR

## 1. Project Overview
**Tavoli GDR** is a web platform designed for the management and booking of tabletop RPG and board game sessions. The platform simplifies the organization of gaming nights by allowing game masters to create events and players to join them easily. Additionally, it features a robust D&D 5e character generation system with AI support and PDF exporting.

## 2. Target Audience
- **Game Masters (Organizers)** looking for a tool to manage player sign-ups.
- **Players** wanting to join sessions or generate characters quickly.
- **Hobbyist Developer** testing AI-assisted character generation and PDF automation.

## 3. Core Features

### 3.1. Session Booking System
- **Event Creation**: Masters can create sessions (GDR or Boardgame) with details like system, time, and participant limits.
- **Participation**: Players join sessions with their name and optional notes.
- **Automated Notifications**: Real-time email alerts via **Brevo API v3** for both organizers and players.
- **Admin Panel**: PIN-protected (`/admin`) interface to manage and delete sessions.

### 3.2. D&D 5e Character Generator
- **AI Generation**: Uses **Google Gemini API** to generate creative character concepts.
- **Validation & Hydration**: Characters are validated against official D&D rules and "hydrated" with real mechanical features (spells, traits, etc.).
- **Manual Wizard**: A multi-step flow for players who prefer manual creation.
- **PDF Export**: Generates professional, ready-to-print character sheets using **pdf-lib**.
- **Data Fixer**: Automatic correction of common data inconsistencies before PDF generation.

## 4. Technical Stack

| Component | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **AI Integration** | Google Gemini API |
| **Email Service** | Brevo (Direct API v3 Integration) |
| **Styling** | Vanilla CSS (CSS Modules) with Glassmorphism Design System |
| **PDF Engine** | pdf-lib |
| **Images** | Sharp (WebP optimization & resizing) |
| **Database** | Local JSON Persistence (`src/data/db.json`) |

## 5. Deployment & Configuration
- **Environment**: Node.js >= 22.0.0.
- **Docker**: Supported via `docker-compose` for standalone deployment.
- **Assets**: Images are stored in `public/uploads/` and processed into WebP.
- **Localization**: UI and D&D terms are fully in **Italian**.

## 6. Project Rules
- **Formatting**: Italian language for all user-facing strings.
- **Data Layer**: CRUD operations are centralized in `src/lib/db.ts`.
- **Security**: Basic local PIN protection for administrative tasks.
