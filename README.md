# Robot Fleet Manager

A full-stack robot fleet management dashboard for monitoring, creating, filtering, and controlling robots across multiple cities.

Robot Fleet Manager helps an operator see the current state of their robot fleet in one place: which robots are active, idle, working, charging, in error, or low on battery. It combines a React dashboard, Firebase authentication, Firestore persistence, Google Maps visualization, and a FastAPI backend.

## Problem It Solves

Managing a robot fleet becomes difficult when robot data is scattered across different tools or hidden behind raw telemetry logs. Operators need a fast way to answer practical questions:

- Which robots are available right now?
- Which robots need attention because of low battery or errors?
- Where are the robots located?
- Can I quickly create, update, or remove robots from my fleet?
- Can each signed-in user manage their own robots securely?

This project solves that by providing a single authenticated dashboard for fleet visibility and basic robot operations.

## Features

- Firebase login and authenticated fleet access
- User-specific robot data stored in Firestore
- Create new robots with city, task, and identity details
- View all robots in a searchable fleet directory
- Filter robots by operational status
- Live dashboard metrics for fleet health
- Google Maps view for robot locations
- Robot detail page with status, battery, location, uptime, and task info
- Update robot status from the detail page
- Delete robots from the fleet
- Frontend telemetry simulation for changing battery/status-style data
- Periodic backend sync to keep robot data fresh
- Responsive dark dashboard UI built for operational monitoring
- Full-stack Vercel deployment support with React frontend and FastAPI backend

## Tech Stack

Frontend:

- React
- React Router
- Redux Toolkit
- React Redux
- Custom React hooks
- Tailwind CSS
- Firebase Auth
- Google Maps React API

Backend:

- FastAPI
- Firebase Admin SDK
- Firestore
- Pydantic
- Uvicorn for local development

Deployment:

- Vercel
- Vercel Python Functions for FastAPI
- Create React App production build

## Architecture

The project follows a clean, modular React structure inspired by the Namaste React style of separating UI, logic, data, and utilities.

```txt
src/
  components/        UI components and screen sections
  hooks/             Data-fetching and business logic hooks
  store/             Redux Toolkit slices and app store
  utils/             API, Firebase, robot, battery, and map helpers

backend/
  Main.py            FastAPI application setup
  routes/            API routes
  services/          Auth, robot, and simulation services
  models/            Pydantic schemas
  core/              Firebase Admin initialization
  data/              City/location data

api/
  index.py           Vercel entrypoint for the FastAPI app
```

What happens under the hood? React keeps the UI declarative, Redux stores fleet state, and custom hooks such as `useRobots`, `useFilteredRobots`, and `useFleetMetrics` keep the data logic away from presentational components. When the robot list changes, React's reconciliation updates only the affected parts of the virtual DOM, such as the changed robot card, fleet count, or map marker.

## Key React Concepts Used

- Functional components only
- `useState` for local UI state, such as modals
- `useEffect` for robot fetching, polling, and telemetry timers
- `useMemo` for efficient robot filtering
- `useRef` to avoid stale robot data inside interval callbacks
- Redux Toolkit reducers for predictable fleet state updates
- Custom hooks for single-responsibility logic
- Component composition for dashboard, directory, map, and detail views

## Backend API

The FastAPI backend exposes robot APIs under:

```txt
/api/robots
```

Main operations:

- `GET /api/robots` - fetch robots for the authenticated user
- `GET /api/robots/{robot_id}` - fetch one robot
- `POST /api/robots` - create a robot
- `PATCH /api/robots/{robot_id}` - update robot status
- `DELETE /api/robots/{robot_id}` - delete a robot

Each request is protected with Firebase authentication. The frontend sends the Firebase ID token in the `Authorization` header.

## Local Setup

Install frontend dependencies:

```bash
npm install
```

Create and activate a Python virtual environment:

```bash
python -m venv .venv
.venv\Scripts\activate
```

Install backend dependencies:

```bash
pip install -r backend/requirements.txt
```

Create a `.env` file using `.env.example` and add your Firebase and Google Maps values.

Start the backend:

```bash
uvicorn backend.Main:app --reload
```

Start the frontend in another terminal:

```bash
npm start
```

Frontend:

```txt
http://localhost:3000
```

Backend:

```txt
http://127.0.0.1:8000
```

## Environment Variables

Frontend:

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
```

Backend:

```txt
FRONTEND_ORIGINS=http://localhost:3000
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
```

For local backend development, you can also use:

```txt
GOOGLE_APPLICATION_CREDENTIALS=path/to/service-account.json
```

## Deployment

This project can deploy both frontend and backend on Vercel.

Vercel serves the React build from `build/`. API requests are handled by `api/index.py`, which exports the existing FastAPI app from `backend/Main.py`.

Vercel settings:

- Framework Preset: `Create React App`
- Build Command: `npm run build`
- Output Directory: `build`

Production environment variables:

```txt
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
REACT_APP_FIREBASE_API_KEY=your_firebase_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
FRONTEND_ORIGINS=https://your-vercel-app.vercel.app
FIREBASE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
```

`REACT_APP_API_URL` is optional in production. If it is not provided, the frontend automatically uses the deployed Vercel domain.

## Build

Create a production build:

```bash
npm run build
```

## Notes

- Add your deployed Vercel domain to Firebase Authentication authorized domains.
- Restrict your Google Maps API key to your deployed domain.
- Keep Firebase Admin credentials only in environment variables.
- Vercel runs FastAPI as serverless functions, so it is good for request/response APIs. Long-running workers, sockets, or persistent in-memory services should use a dedicated backend host.
