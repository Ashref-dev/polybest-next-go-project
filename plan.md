# Project Plan: Heterogeneous API System (Content Website)

This plan outlines the steps to create a distributed system featuring REST, GraphQL, and SOAP APIs, managed by a Traefik gateway, consumed by a React frontend, and orchestrated with Docker Compose.

**Theme:** Content Website (Movies, Series, Anime)

---

## Phase 1: Setup & Core API Development (Go)

- [x] **Task 1.1: Project Structure Setup**
    - Create main project directory.
    - Create subdirectories: `services/series-api`, `services/anime-api`, `services/movies-api`, `frontend`, `gateway`, `docker`.
- [x] **Task 1.2: Initialize Go Modules**
    - `cd services/series-api && go mod init github.com/your-username/series-api` (Replace with your actual module path)
    - `cd ../anime-api && go mod init github.com/your-username/anime-api`
    - `cd ../movies-api && go mod init github.com/your-username/movies-api`
- [ ] **Task 1.3: Implement Series API (REST)**
    - Choose a Go web framework (e.g., Gin, Echo, or standard library `net/http`).
    - Define data models (`structs`) for Series.
    - Implement basic CRUD endpoints (GET `/series`, GET `/series/{id}`, POST `/series`).
    - Use an in-memory map or slice for initial data storage.
    - Add basic logging.
- [ ] **Task 1.4: Implement Anime API (GraphQL)**
    - Choose a Go GraphQL library (e.g., `graphql-go/graphql` or `gqlgen`).
    - Define GraphQL schema (`.graphql` file) for Anime types, queries, and mutations.
    - Implement resolvers for the defined schema.
    - Set up the GraphQL HTTP handler.
    - Use an in-memory map or slice for initial data storage.
    - Add basic logging.
- [ ] **Task 1.5: Implement Movies API (SOAP)**
    - Research and choose a Go SOAP library (e.g., `hooklift/gowsdl` for client generation if consuming, or a library for serving, or implement basic XML handling manually).
    - Define the service operations (e.g., `GetMovieDetails`, `ListMovies`).
    - Implement the SOAP service logic.
    - Define data models (`structs`) for Movies.
    - Set up the SOAP HTTP handler.
    - Use an in-memory map or slice for initial data storage.
    - Add basic logging.

## Phase 2: Dockerization

- [ ] **Task 2.1: Create Dockerfile for Series API**
    - Use a multi-stage build (builder + final image).
    - Copy source code, download dependencies, build the Go binary.
    - Create a minimal final image (e.g., based on `alpine` or `distroless`).
    - Expose the API port.
    - Set the entrypoint/command.
- [ ] **Task 2.2: Create Dockerfile for Anime API**
    - Similar multi-stage build process as the Series API.
    - Ensure GraphQL schema files are included if needed.
- [ ] **Task 2.3: Create Dockerfile for Movies API**
    - Similar multi-stage build process as the other APIs.
- [ ] **Task 2.4: Build & Test Docker Images**
    - Run `docker build` for each service.
    - Run containers individually (`docker run`) to verify they start correctly.

## Phase 3: API Gateway (Traefik)

- [ ] **Task 3.1: Create Traefik Configuration (`gateway/traefik.yml`)**
    - Define entrypoints (e.g., `web` on port 80).
    - Enable the Docker provider.
    - Enable the Traefik dashboard (optional but helpful).
- [ ] **Task 3.2: Create Dynamic Configuration File (`gateway/dynamic_conf.yml`)** (Optional, can also use Docker labels)
    - Define routers and services if not using Docker labels for discovery.
- [ ] **Task 3.3: Prepare Traefik Service for Docker Compose**
    - Define the Traefik service in the upcoming `docker-compose.yml`.
    - Mount configuration files (`traefik.yml`, `dynamic_conf.yml`) as volumes.
    - Mount the Docker socket (`/var/run/docker.sock`) for service discovery.

## Phase 4: Frontend Development (React)

- [ ] **Task 4.1: Set up React Project**
    - Use `create-react-app` or Vite: `cd frontend && npx create-react-app .` or `npm create vite@latest . -- --template react`.
    - Install necessary libraries (e.g., `axios` for REST/SOAP, Apollo Client or `graphql-request` for GraphQL).
- [ ] **Task 4.2: Create Basic UI Components**
    - Components for listing Series, Anime, Movies.
    - Component for showing details.
    - Basic navigation/layout.
- [ ] **Task 4.3: Implement API Calls**
    - Fetch data from `/api/series` (REST).
    - Fetch data from `/api/anime` (GraphQL).
    - Fetch data from `/api/movies` (SOAP - may require specific handling or a backend-for-frontend proxy endpoint if direct browser SOAP calls are difficult).
- [ ] **Task 4.4: Display Data in UI**
    - Integrate fetched data into the React components.
- [ ] **Task 4.5: Create Dockerfile for React App**
    - Use a multi-stage build.
    - Stage 1: Build the React app (`npm run build`).
    - Stage 2: Use an Nginx image to serve the static build files.
    - Configure Nginx to serve the app and potentially proxy API requests (though Traefik handles the main routing).

## Phase 5: Integration & Orchestration (Docker Compose)

- [ ] **Task 5.1: Create `docker-compose.yml`**
    - Define the version (e.g., `version: '3.8'`).
- [ ] **Task 5.2: Define Services**
    - `series-api`: Build from `services/series-api`, expose port (internal), add Docker labels for Traefik routing (e.g., `traefik.http.routers.series.rule=Host(\`localhost\`) && PathPrefix(\`/api/series\`)`).
    - `anime-api`: Build from `services/anime-api`, expose port, add Docker labels for Traefik (e.g., `PathPrefix(\`/api/anime\`)`).
    - `movies-api`: Build from `services/movies-api`, expose port, add Docker labels for Traefik (e.g., `PathPrefix(\`/api/movies\`)`).
    - `frontend`: Build from `frontend`, expose port, add Docker labels for Traefik (e.g., `Host(\`localhost\`) && PathPrefix(\`/\`)`).
    - `gateway`: Use the official `traefik` image, map ports (e.g., `80:80`, `8080:8080` for dashboard), mount volumes (configs, Docker socket).
- [ ] **Task 5.3: Configure Networking**
    - Define a common network for all services to communicate.
- [ ] **Task 5.4: Test the Stack**
    - Run `docker-compose up --build`.
    - Access the frontend (`http://localhost`).
    - Access the Traefik dashboard (`http://localhost:8080`).
    - Verify API calls work through the gateway.

## Phase 6: Refinement & Documentation

- [ ] **Task 6.1: Implement Error Handling**
    - Add proper error responses and status codes in APIs.
    - Handle API errors gracefully in the frontend.
- [ ] **Task 6.2: Add Basic Validation**
    - Implement input validation for API requests (e.g., for POST/PUT).
- [ ] **Task 6.3: Improve Frontend UI/UX**
    - Add styling (CSS, component library).
    - Improve navigation and user experience.
- [ ] **Task 6.4: Write README.md**
    - Include project overview, architecture explanation.
    - Provide clear instructions on how to build and run the system using Docker Compose.
    - Detail API endpoints and usage.
- [ ] **Task 6.5: Code Cleanup**
    - Remove commented-out code.
    - Ensure consistent formatting.
    - Add comments where necessary.

---
