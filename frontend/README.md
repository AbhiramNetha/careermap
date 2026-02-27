# CareerMap India 🗺️

A comprehensive career guidance web application built for Indian engineering students. Features a career quiz, personalized recommendations, career comparison tools, detailed roadmaps, and branch-specific guidance.

---

## 🛠️ Tech Stack

| Layer     | Technology                                      |
|-----------|-------------------------------------------------|
| Frontend  | React 19, Vite, React Router, Recharts, Axios   |
| Backend   | Node.js, Express 5, Mongoose                    |
| Database  | MongoDB 7                                       |
| Container | Docker + Docker Compose                         |

---

## 📁 Project Structure

```
proj111/
├── docker-compose.yml     ← orchestrates all 3 services
├── .gitignore
├── frontend/
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── src/
│   └── package.json
└── backend/
    ├── Dockerfile
    ├── .dockerignore
    ├── server.js
    └── package.json
```

---

## 🐳 Running with Docker (Recommended)

> **Prerequisites:** [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.  
> No Node.js or MongoDB installation needed on the host machine.

### 1. Clone / open the project

```bash
cd path/to/proj111
```

### 2. Start everything with one command

```bash
docker compose up --build
```

This will:
- Pull **MongoDB 7** image and start it
- Build and start the **backend** (auto-seeds data on first run)
- Build and start the **frontend** (Vite dev server with HMR)

### 3. Open the app

| Service  | URL                          |
|----------|------------------------------|
| Frontend | http://localhost:5173        |
| Backend  | http://localhost:5000        |
| Health   | http://localhost:5000/api/health |
| MongoDB  | mongodb://localhost:27017    |

### 4. Stop everything

```bash
docker compose down
```

To also **delete the MongoDB data volume**:

```bash
docker compose down -v
```

---

## 🔄 Development Workflow with Docker

Hot-reload is enabled for both services — edit code and changes reflect instantly without restarting containers.

```bash
# Start in background (detached)
docker compose up --build -d

# Watch logs for a specific service
docker compose logs -f backend
docker compose logs -f frontend

# Restart a single service after Dockerfile changes
docker compose up --build backend

# Open a shell inside a container (for debugging)
docker compose exec backend sh
docker compose exec frontend sh
```

---

## 🖥️ Running Without Docker (Manual Setup)

> **Prerequisites:** Node.js v18+, MongoDB running locally on port 27017.

### Backend

```bash
cd backend
npm install
# Verify backend/.env has:
#   PORT=5000
#   MONGO_URI=mongodb://localhost:27017/careermap
#   NODE_ENV=development
npm run dev
```

### Frontend

```bash
cd frontend
npm install
# Verify frontend/.env has:
#   VITE_API_URL=http://localhost:5000/api
npm run dev
```

Open **http://localhost:5173**

---

## ⚙️ Environment Variables

### `backend/.env`

| Variable    | Default                                    | Description             |
|-------------|--------------------------------------------|-------------------------|
| `PORT`      | `5000`                                     | Express server port     |
| `MONGO_URI` | `mongodb://localhost:27017/careermap`      | MongoDB connection URI  |
| `NODE_ENV`  | `development`                              | Environment mode        |

> ⚠️ When running via Docker, `MONGO_URI` is automatically overridden to `mongodb://mongo:27017/careermap` by `docker-compose.yml`. Your `.env` file is only used for local (non-Docker) runs.

### `frontend/.env`

| Variable        | Default                        | Description         |
|-----------------|--------------------------------|---------------------|
| `VITE_API_URL`  | `http://localhost:5000/api`    | Backend API base URL|

---

## 📜 Available Scripts

### Backend (`/backend`)

| Command       | Description                    |
|---------------|--------------------------------|
| `npm run dev` | Start the backend server       |
| `npm start`   | Same as `npm run dev`          |

### Frontend (`/frontend`)

| Command           | Description                          |
|-------------------|--------------------------------------|
| `npm run dev`     | Start the Vite dev server            |
| `npm run build`   | Build for production                 |
| `npm run preview` | Preview production build locally     |
| `npm run lint`    | Run ESLint checks                    |

---

## ⚠️ Troubleshooting

| Problem | Fix |
|---|---|
| `port is already allocated` | Stop other services using ports 5000, 5173, or 27017 — or change the host port in `docker-compose.yml` |
| Frontend shows blank page | Wait ~10s for backend to finish seeding, then refresh |
| Mongo won't start | Ensure Docker Desktop has enough memory allocated (≥ 2 GB) |
| Hot-reload not working | Ensure you're editing files in the `frontend/src` or `backend/` directories — Docker bind-mounts those |
| Changes not reflected | Run `docker compose up --build` to rebuild the image |
