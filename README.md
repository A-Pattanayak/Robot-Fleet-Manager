# AUTOMATA - Robot Fleet Manager

Full-stack robot fleet command center for tracking, creating, updating, and managing robots across multiple cities.

AUTOMATA solves a practical fleet operations problem: when multiple robots are active in different locations, operators need one clear dashboard to monitor battery health, live status, tasks, alerts, and map-based movement without checking each robot manually.

[![Live Demo](https://img.shields.io/badge/LIVE_DEMO-AUTOMATA_FLEET-ef4444?style=for-the-badge&logo=vercel&logoColor=white)](https://automata-fleet.vercel.app/)

---

## Tech Stack

![Frontend](https://img.shields.io/badge/FRONTEND-React-61DAFB?style=for-the-badge&logo=react&logoColor=111827)
![State](https://img.shields.io/badge/STATE-Redux_Toolkit-764ABC?style=for-the-badge&logo=redux&logoColor=white)
![Styling](https://img.shields.io/badge/STYLING-Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Auth](https://img.shields.io/badge/AUTH-Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=111827)
![Database](https://img.shields.io/badge/DATABASE-Firestore-FFA611?style=for-the-badge&logo=firebase&logoColor=111827)
![Backend](https://img.shields.io/badge/BACKEND-FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Maps](https://img.shields.io/badge/MAPS-Google_Maps-4285F4?style=for-the-badge&logo=googlemaps&logoColor=white)
![Deploy](https://img.shields.io/badge/DEPLOY-Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## Features

- Secure sign up, sign in, sign out, and protected dashboard access with Firebase Authentication
- User-specific robot fleets stored in Firebase Firestore
- FastAPI backend for robot creation, fleet fetching, status updates, delete operations, and Firebase token verification
- Dashboard overview with fleet metrics, alerts, battery health, active states, and robot cards
- Search and filter robots by name, task, city, status, and location data
- Google Maps integration for visualizing robot locations across cities
- Robot detail page with status controls, battery data, uptime, task, city, and coordinates
- Custom React hooks for fetching, filtering, metrics, create, update, and delete flows
- Redux Toolkit store for robot state, search, filters, loading state, and authenticated user data
- Periodic backend sync and frontend telemetry simulation for a more realistic monitoring experience

## Architecture

```txt
src/
  components/   UI components, dashboard sections, robot cards, map, and detail views
  hooks/        Custom hooks for robot data, filtering, metrics, create, update, and delete
  store/        Redux Toolkit store and slices for user and robot state
  utils/        Firebase, API helpers, robot utilities, map helpers, and config

backend/
  Main.py       FastAPI app setup
  routes/       Robot API routes
  services/     Firebase auth, robot CRUD, and simulation logic
  models/       Pydantic robot schemas
  core/         Firebase Admin initialization
  data/         City location data

api/
  index.py      Vercel FastAPI entrypoint
```

## Run Locally

```bash
npm install
npm start
```

Create a Python virtual environment and install backend dependencies:

```bash
python -m venv .venv
.venv\Scripts\activate
pip install -r backend/requirements.txt
```

Start the backend:

```bash
uvicorn backend.Main:app --reload
```

Create a `.env` file:

```txt
REACT_APP_API_URL=http://127.0.0.1:8000
REACT_APP_ROBOT_SYNC_INTERVAL_MS=60000
REACT_APP_FRONTEND_TELEMETRY_INTERVAL_MS=5000
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
FRONTEND_ORIGINS=http://localhost:3000
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
```

Build for production:

```bash
npm run build
```

## Deployment Notes

Add your deployed domain to Firebase Authentication's authorized domains and restrict the Google Maps API key to your production domain. Keep Firebase Admin credentials out of Git and store `FIREBASE_SERVICE_ACCOUNT_JSON` only in Vercel environment variables.

The React frontend is served from the Create React App `build` folder, while `/api` requests are handled by the FastAPI app through Vercel Python Functions. Since Vercel Functions are request/response based, long-running workers, sockets, or persistent in-memory robot services should eventually move to a dedicated backend host.
