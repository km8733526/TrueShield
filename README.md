# 🛡️ TrueShield — Senior Safety & Health Solution

A modern, full-featured web application for senior safety and health management, built with React, TypeScript, Tailwind CSS, and Supabase.

## 📁 Project Structure

```
TrueShield/
├── public/
│   ├── favicon.ico
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── chat/
│   │   │   └── CaregiverChat.tsx
│   │   ├── dashboard/
│   │   │   ├── fall-detection/
│   │   │   ├── AddGeofenceZoneDialog.tsx
│   │   │   ├── CaregiverChat.tsx
│   │   │   ├── Dashboard.tsx
│   │   │   ├── EmergencyButton.tsx
│   │   │   ├── FallDetection.tsx
│   │   │   ├── GeofenceZones.tsx
│   │   │   ├── HealthStatus.tsx
│   │   │   ├── LoadingCard.tsx
│   │   │   ├── LocationTracker.tsx
│   │   │   └── MedicationReminders.tsx
│   │   ├── layout/
│   │   │   ├── Footer.tsx
│   │   │   ├── Header.tsx
│   │   │   ├── Layout.tsx
│   │   │   └── Navigation.tsx
│   │   ├── profile/
│   │   │   ├── EmergencyContacts.tsx
│   │   │   ├── ProfileEditForm.tsx
│   │   │   └── UserProfile.tsx
│   │   ├── reminders/
│   │   │   └── ReminderForm.tsx
│   │   ├── ui/                        # shadcn/ui components
│   │   │   ├── accordion.tsx
│   │   │   ├── alert-dialog.tsx
│   │   │   ├── alert.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── card.tsx
│   │   │   ├── chart.tsx
│   │   │   ├── checkbox.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── drawer.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── form.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── loading.tsx
│   │   │   ├── navigation-menu.tsx
│   │   │   ├── pagination.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── progress.tsx
│   │   │   ├── radio-group.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   ├── select.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── sheet.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── skeleton.tsx
│   │   │   ├── slider.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── switch.tsx
│   │   │   ├── table.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── textarea.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toaster.tsx
│   │   │   ├── toggle-group.tsx
│   │   │   ├── toggle.tsx
│   │   │   └── tooltip.tsx
│   │   └── AuthGuard.tsx
│   ├── hooks/
│   │   ├── use-mobile.tsx
│   │   ├── use-theme.ts
│   │   ├── use-toast.ts
│   │   ├── useAuth.tsx
│   │   ├── useEmergencyContacts.ts
│   │   ├── useFallDetection.ts
│   │   ├── useGeofenceZones.ts
│   │   ├── useLocationTracking.ts
│   │   └── useNotifications.ts
│   ├── integrations/
│   │   └── supabase/
│   │       ├── client.ts
│   │       └── types.ts
│   ├── lib/
│   │   └── utils.ts
│   ├── pages/
│   │   ├── Alerts.tsx
│   │   ├── Auth.tsx
│   │   ├── Chat.tsx
│   │   ├── Index.tsx
│   │   ├── NotFound.tsx
│   │   ├── Profile.tsx
│   │   ├── Reminders.tsx
│   │   ├── Settings.tsx
│   │   └── Welcome.tsx
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── supabase/
│   └── functions/
│       └── send-sms/
│           └── index.ts
├── .gitignore
├── bun.lockb
├── components.json
├── eslint.config.js
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.app.json
├── tsconfig.node.json
└── vite.config.ts
```

## ✨ Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 + TypeScript |
| Build Tool | Vite |
| Styling | Tailwind CSS + shadcn/ui |
| Backend / DB | Supabase |
| Edge Functions | Supabase Functions (send-sms) |
| Forms | React Hook Form + Zod |
| Routing | React Router DOM v6 |
| Data Fetching | TanStack Query (React Query) |
| Charts | Recharts |
| Icons | Lucide React |

## 📄 Pages

| Page | Route | Description |
|---|---|---|
| `Welcome.tsx` | `/welcome` | Landing / onboarding screen |
| `Auth.tsx` | `/auth` | Login & signup |
| `Index.tsx` | `/` | Main dashboard |
| `Alerts.tsx` | `/alerts` | Emergency alerts |
| `Chat.tsx` | `/chat` | Caregiver chat |
| `Reminders.tsx` | `/reminders` | Medication reminders |
| `Profile.tsx` | `/profile` | User profile & emergency contacts |
| `Settings.tsx` | `/settings` | App settings |
| `NotFound.tsx` | `*` | 404 page |

## 🪝 Custom Hooks

| Hook | Purpose |
|---|---|
| `useAuth` | Authentication state & methods |
| `useLocationTracking` | Real-time GPS location tracking |
| `useFallDetection` | Fall detection logic |
| `useGeofenceZones` | Geofence zone management |
| `useEmergencyContacts` | Emergency contacts CRUD |
| `useNotifications` | Push notification handling |

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ or Bun
- Supabase project

### Installation

```bash
git clone <your-repo-url>
cd TrueShield
npm install
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Development

```bash
npm run dev
```

App runs at `http://localhost:8080`

### Build

```bash
npm run build        # Production build
npm run build:dev    # Development build
npm run preview      # Preview production build
```

### Lint

```bash
npm run lint
```

## 🎨 Design System

TrueShield uses a custom color palette for accessibility and a clean medical feel:

| Token | Color | Usage |
|---|---|---|
| `trueshield.primary` | `#1E88E5` | Main blue — trust & reliability |
| `trueshield.secondary` | `#4CAF50` | Green — health & wellness |
| `trueshield.accent` | `#FF5722` | Orange/red — alerts & emergencies |
| `trueshield.warning` | `#FFA726` | Orange — warnings |
| `trueshield.error` | `#F44336` | Red — errors |
| `trueshield.success` | `#66BB6A` | Green — success states |

## ⚠️ Notes

- Never commit your `.env` file — it's already in `.gitignore`
- Supabase credentials are required for all backend features (auth, location, alerts, SMS)
- The `send-sms` edge function requires additional setup in your Supabase dashboard
- Dark mode is supported via the `next-themes` package
