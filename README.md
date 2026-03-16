# SpaceFlow Web UI

Frontend for coworking space reservations and place/space management.

## Run the project

### Option A: Docker (same network as backend)

1. **Start the backend first** (creates `spaceflow-network`):
   ```bash
   cd /path/to/backend && docker compose up -d
   ```

2. **Build and run**
   ```bash
   docker compose up -d --build
   ```
   UI: `http://localhost:8080`

---

### Option B: Development (UI on your machine)

1. **Dependencies and env**
   ```bash
   npm install
   cp .env.example .env
   ```
   Edit `.env`: `VITE_API_URL` should point at your API (e.g. `http://localhost:3000`). `VITE_AUTH_BEARER_TOKEN` is the token stored after login and sent as Bearer on API requests.

2. **Start the dev server**
   ```bash
   npm run dev
   ```
   UI: `http://localhost:8080`

---

## Profiles and auth

Two login flows with different roles:

|              | Normal user           | Admin          |
|--------------|------------------------|----------------|
| Entry        | `/` → Start → modal    | `/admin-login` |
| Email        | `test@test.com`        | `admin@admin.com` |
| Password     | `password2026`         | `admin2026`    |
| Reservations | View, book, edit, delete | Same          |
| Add place/space | No                  | Yes            |
| Telemetry    | Hidden                 | Visible per space |

Normal users only manage reservations. Admins can also create places and spaces and see the telemetry section. The app stores `auth_token` and `spaceflow_admin` in `localStorage`; the API client sends `Authorization: Bearer <token>` on requests.


## Stack

- **React 18** + **TypeScript** — UI and type safety
- **Vite** — Build tool and dev server
- **Tailwind CSS v4** — Styling (via `@tailwindcss/vite`)
- **React Router v7** — Client-side routing
- **TanStack Query (React Query)** — Server state and caching
- **Axios** — HTTP client for the API
- **Lucide React** — Icons 
- **react-hot-toast** — Toasts
- **react-tooltip** — Tooltips
- **ESLint** — Linting
