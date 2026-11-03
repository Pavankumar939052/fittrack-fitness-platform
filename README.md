# FitTrack – Fitness & Workout Management Platform

FitTrack is a full-stack fitness tracking application that helps users manage workouts, monitor daily progress, set fitness goals, and analyze their fitness performance.

## Features

- User registration and login with JWT authentication
- Secure password hashing
- Workout management (Create, Read, Update, Delete)
- Workout categories: Cardio, Strength, and Yoga
- Daily fitness progress tracking
- Fitness goal creation and progress monitoring
- Weekly and monthly analytics
- Workout category and calorie charts
- Notifications management
- Protected routes and user-specific data

## Technology Stack

### Frontend
- React
- Vite
- JavaScript
- Axios
- React Router
- Recharts
- Lucide React
- CSS

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication
- Bcrypt

### Database
- SQLite (local development)
- PostgreSQL (production support)

## Project Structure

```text
fittrack-fitness-platform/
│
├── backend/
│   ├── app/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   ├── services/
│   │   ├── database.py
│   │   └── main.py
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
├── README.md
└── .gitignore
```

## Installation and Setup

### 1. Clone the Repository

```bash
git clone https://github.com/Pavankumar939052/fittrack-fitness-platform.git
cd fittrack-fitness-platform
```

### 2. Backend Setup

```bash
cd backend
python -m venv venv
```

Activate the virtual environment on Windows:

```powershell
.\venv\Scripts\Activate.ps1
```

Install the required dependencies:

```bash
pip install -r requirements.txt
```

Start the backend server:

```bash
python -m uvicorn app.main:app --reload
```

Backend URL: http://127.0.0.1:8000

API Documentation: http://127.0.0.1:8000/docs

### 3. Frontend Setup

Open a second terminal:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend folder:

```env
VITE_API_URL=http://127.0.0.1:8000
```

Start the frontend development server:

```bash
npm run dev
```

Frontend URL: http://localhost:5173

## API Modules

| Module | Description |
|---|---|
| Authentication | User registration and login |
| Users | User profile management |
| Workouts | Workout creation and management |
| Progress | Daily fitness progress tracking |
| Goals | Fitness goal management |
| Analytics | Weekly and monthly performance analytics |
| Notifications | Notification management |

## Security

- JWT-based authentication
- Secure password hashing
- Protected API endpoints
- User-specific data access
- Environment variables for application configuration

**Important:** Do not upload real `.env` files, passwords, secret keys, or database credentials to GitHub. Use the provided `.env.example` templates.

## Future Improvements

- Advanced fitness analytics
- Personalized workout recommendations
- Automated workout reminders
- Enhanced progress visualization
- Additional fitness tracking features

## Author

**FitTrack – Fitness & Workout Management Platform**

Developed as a full-stack application using React and FastAPI.
