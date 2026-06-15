# Interview Preparation Platform

Enterprise-grade full-stack platform for students to practice programming, attend mock interviews, analyze resumes, track performance, and collaborate in real time.

## Features

### Student
- Dashboard with performance stats, activity history, and leaderboard
- Skill level selection (Beginner / Intermediate / Advanced)
- Dynamic programming assessments with timer and auto evaluation
- Mock interviews (Technical + HR questions)
- Resume analyzer (PDF upload, skill extraction, scoring)
- Performance analytics with charts
- Friends, friend requests, private & group chat
- Profile management with avatar upload
- Dark / light theme

### Admin
- Platform statistics dashboard
- User management (activate/deactivate, delete)
- Programming & interview question CRUD
- Chat moderation & reported messages
- Platform analytics

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, Vite, Tailwind CSS, Axios, React Router, Recharts |
| Backend | Java 17, Spring Boot 3.2, Spring Security, JWT, WebSocket (STOMP) |
| Database | MySQL |
| Deployment | Vercel (frontend), Render (backend), PlanetScale (MySQL) |

## Project Structure

```
Interview preparation Platform/
├── backend/          # Spring Boot REST API + WebSocket
├── frontend/         # React SPA
├── database/         # SQL schema reference
└── README.md
```

## Prerequisites

- Java 17+
- Maven 3.9+
- Node.js 18+
- MySQL 8.0+

## MySQL Setup

### 1. Install MySQL
- **Windows**: Download [MySQL Installer](https://dev.mysql.com/downloads/installer/)
- **macOS**: `brew install mysql`
- **Linux**: `sudo apt install mysql-server`

### 2. MySQL Workbench
1. Install [MySQL Workbench](https://dev.mysql.com/downloads/workbench/)
2. Create connection: Host `localhost`, Port `3306`, User `root`

### 3. Create Database
```sql
CREATE DATABASE interview_prep_db;
```

### 4. Configure Credentials
Edit `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/interview_prep_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
spring.datasource.username=root
spring.datasource.password=YOUR_PASSWORD
```

Or use environment variables:
```bash
set DB_USERNAME=root
set DB_PASSWORD=yourpassword
set DATABASE_URL=jdbc:mysql://localhost:3306/interview_prep_db?createDatabaseIfNotExist=true&useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC
```

## Running Locally

### Backend
```bash
cd backend
mvn spring-boot:run
```
API runs at: http://localhost:8080

### Frontend
```bash
cd frontend
cp .env.example .env
npm install
npm run dev
```
App runs at: http://localhost:5173

## Visual Studio Code Setup

The project includes a ready-to-open workspace and shared tasks for Visual Studio Code.

### Open the Workspace
Double-click `open-in-visual-studio-code.cmd`, or open `InterviewPreparationPlatform.code-workspace` from Visual Studio Code.

When prompted, install the recommended extensions for Java, Spring Boot, Maven, Tailwind CSS, ESLint, Prettier, and PowerShell.

### First-Time Setup
Run **Terminal > Run Task > Install dependencies**.

This uses the bundled Node.js and Maven in `tools/`, so you do not need global Node or Maven installed.

### Run the Full App
Run **Terminal > Run Build Task** and choose **Run app (backend + frontend)**.

- Backend runs at http://localhost:8080
- Frontend runs at http://localhost:5173
- The backend uses the `dev` Spring profile by default, which uses in-memory H2 instead of MySQL.

### Debug Backend + Open Frontend
Open **Run and Debug** and start **Debug Backend + Open Frontend**.

This launches the Spring Boot backend in debug mode, starts the Vite frontend, and opens the app in Edge.

## Demo Accounts

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | admin123 |
| Student | student | student123 |

## API Documentation

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/login` | Login, returns JWT |
| POST | `/api/auth/logout` | Logout |

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users/me` | Current profile |
| GET | `/api/users/dashboard` | Dashboard data |
| PUT | `/api/users/me` | Update profile |
| POST | `/api/users/me/avatar` | Upload profile picture |
| GET | `/api/users/search?q=` | Search users |

### Programming
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/programming/questions?level=BEGINNER` | Get questions by skill |
| POST | `/api/programming/submit` | Submit code for evaluation |
| GET | `/api/programming/results` | User test history |

### Interviews
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/interviews/mock/start` | Start mock interview |
| POST | `/api/interviews/mock/{id}/complete` | Complete mock interview |

### Resume
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/resumes/analyze` | Upload & analyze PDF |
| GET | `/api/resumes` | Resume history |

### Social
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/friends` | Friends & pending requests |
| POST | `/api/friends/request/{userId}` | Send friend request |
| POST | `/api/chat/send` | Send message |
| GET | `/api/chat/private/{friendId}` | Private messages |
| GET/POST | `/api/chat/groups` | Group discussions |

### Admin (ROLE_ADMIN required)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Platform stats |
| GET | `/api/admin/users` | User list |
| CRUD | `/api/admin/programming-questions` | Manage questions |
| GET | `/api/admin/reports` | Reported messages |

### WebSocket
- Endpoint: `ws://localhost:8080/ws` (SockJS)
- Typing indicator: `/app/chat.typing` → `/topic/typing`

## Deployment

### PlanetScale (Database)
1. Create account at [planetscale.com](https://planetscale.com)
2. Create database `interview-prep`
3. Get connection string and set:
   ```
   DATABASE_URL=jdbc:mysql://HOST/interview_prep_db?sslMode=VERIFY_IDENTITY
   DB_USERNAME=...
   DB_PASSWORD=...
   ```

### Render (Backend)
1. Push code to GitHub
2. Create **Web Service** on [render.com](https://render.com)
3. Connect repo, set root to `backend`
4. Use Docker or Native Java
5. Environment variables:
   - `DATABASE_URL`, `DB_USERNAME`, `DB_PASSWORD`
   - `JWT_SECRET` (long random string)
   - `CORS_ORIGINS=https://your-app.vercel.app`
6. Deploy

### Vercel (Frontend)
1. Import GitHub repo on [vercel.com](https://vercel.com)
2. Set root directory: `frontend`
3. Environment variables:
   ```
   VITE_API_URL=https://your-api.onrender.com
   VITE_WS_URL=https://your-api.onrender.com/ws
   ```
4. Deploy

## Environment Variables

### Backend
| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | JDBC URL | localhost MySQL |
| `DB_USERNAME` | DB user | root |
| `DB_PASSWORD` | DB password | root |
| `JWT_SECRET` | JWT signing key | (dev default) |
| `CORS_ORIGINS` | Allowed origins | localhost:5173 |
| `PORT` | Server port | 8080 |

### Frontend
| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API base URL |
| `VITE_WS_URL` | WebSocket endpoint |

## License

MIT
