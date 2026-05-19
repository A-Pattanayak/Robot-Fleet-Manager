# Robot Fleet Manager

Full-stack robot fleet dashboard for monitoring, creating, filtering, and managing robots across multiple cities.

Robot Fleet Manager combines Firebase auth, Firestore-backed fleet data, Google Maps location visualization, FastAPI robot APIs, Redux state management, and live telemetry simulation into a responsive React dashboard.

## Live Demo

Coming soon

## Tech Stack

React Redux Toolkit Tailwind Firebase Firestore FastAPI Google Maps Vercel

## Features

- Firebase sign up, sign in, sign out, and protected dashboard access
- User-specific robot fleet stored in Firestore
- Create robots with name, task, city, and generated telemetry details
- Search robots by name, task, city, status, and location data
- Filter robots by operational status
- Fleet metrics for active, idle, working, charging, error, and low-battery robots
- Google Maps view for robot locations
- Robot detail page with task, status, battery, uptime, city, and location data
- Update robot status from the robot detail page
- Delete robots from the fleet
- Periodic backend sync for fresh Firestore data
- Frontend telemetry simulation for live dashboard movement
- Redux Toolkit slice for robot filter, search, loading, and fleet state
- Custom hooks for robot fetching, filtering, metrics, create, update, and delete flows
- Responsive Tailwind CSS dashboard UI
- Full-stack Vercel setup for React frontend and FastAPI backend

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
