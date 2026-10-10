# FitTrack Pro

A full-stack fitness tracking application built with React, Node.js, Express, and MongoDB. The app helps users monitor workouts, track nutrition and hydration, manage goals, and stay motivated with progress analytics, challenges, and achievements.

## Overview

FitTrack Pro is designed for users who want a personal fitness dashboard to:

- Log workouts and review activity history
- Track meals, water intake, and weight changes
- Set and update personal fitness goals
- Explore an exercise library
- View progress analytics and achievements
- Participate in challenges and notifications
- Manage a secure account and profile

## Features

- User authentication with JWT
- Protected routes for authenticated users
- Dashboard with fitness summaries and analytics
- Workout tracking and workout plan management
- Exercise library and selection tools
- Goal tracking and personal progress updates
- Nutrition, hydration, and weight logging
- Progress photo support
- Achievements and challenge system
- Notifications and user profile management

## Tech Stack

### Frontend
- React
- React Router
- Axios
- CSS modules / custom styling
- Lucide React icons

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT authentication
- bcryptjs for password hashing

## Project Structure

```text
fitness-trackapp/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── App.js
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── utils/
│   │   └── index.js
│   ├── package.json
│   └── package-lock.json
├── server/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── seed/
│   ├── services/
│   ├── server.js
│   ├── package.json
│   └── package-lock.json
├── package.json
├── README.md
└── .gitignore
```

## Prerequisites

Before running the project, make sure you have installed:

- Node.js (v18 or newer recommended)
- npm
- MongoDB running locally or a MongoDB connection URI

## Environment Setup

### Server environment
Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/fitness_tracker
JWT_SECRET=your_super_secret_key
```

### Client environment (optional)
Create a `.env` file inside the `client` directory if you want to override the default API URL:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Installation

From the project root:

```bash
cd client
npm install

cd ../server
npm install
```

## Running the App

### Windows one-click startup

After adding your current IP address to the MongoDB Atlas network access list and configuring `server/.env`, double-click `Start FitTrack.bat` in the project root. It opens the backend and frontend in separate command windows; the React development server opens the app at `http://localhost:3000` when ready. Keep both windows open while using the app.

The launcher requires Node.js and npm, and the dependencies installed in both `server` and `client`.

### 1) Start the backend

```bash
cd server
npm run dev
```

The server should run at:

```text
http://localhost:5000
```

### 2) Start the frontend

Open a new terminal:

```bash
cd client
npm start
```

The React app should run at:

```text
http://localhost:3000
```

## Database Seeding

To populate the app with starter data such as exercises, challenges, and workout plans:

```bash
cd server
npm run seed
```

## Main Application Routes

The frontend routes include:

- `/login`
- `/register`
- `/dashboard`
- `/workouts`
- `/goals`
- `/exercise-library`
- `/workout-plans`
- `/nutrition`
- `/hydration`
- `/progress`
- `/achievements`
- `/challenges`
- `/notifications`
- `/profile`
- `/settings`

Most of the pages are protected and require authentication.

## API Overview

The backend exposes REST API endpoints under `/api`, including:

- `/api/auth` for login and registration
- `/api/workouts` for workout management
- `/api/goals` for goals
- `/api/exercises` for the exercise library
- `/api/workout-plans` for workout plans
- `/api/meals` for nutrition logs
- `/api/water` for hydration logs
- `/api/weight` for weight tracking
- `/api/analytics` for dashboard analytics
- `/api/challenges` and `/api/achievements` for user progress
- `/api/notifications` for app notifications

## Development Notes

- The server automatically connects to MongoDB on startup.
- JWT tokens are attached to frontend requests via an Axios interceptor.
- Protected pages redirect users to the login screen when no valid session exists.
- The app uses a modular backend structure with controllers, models, middleware, and routes.

## License

This project is licensed under the ISC License.

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

## Author

Built as a fitness tracking application for tracking personal health and training progress.


### Output Example
The application is intended to produce dashboard output such as:

```text
Fitness Tracker API is running
MongoDB connected successfully
Server running on http://localhost:5000
```

A typical frontend experience includes:

- Dashboard summary cards for workouts, calories, active time, and goals
- Weekly activity chart
- Workout session list
- Hydration and nutrition overview
- Progress tracking cards
- Sidebar navigation for all major fitness features

> The project was analyzed from the implemented source code and architecture rather than from a captured UI screenshot, so the documentation focuses on the actual code structure and expected runtime output.

---

## 6. Conclusion

The Fitness Tracker project is a complete full-stack application built to support healthy lifestyle tracking and performance monitoring. It combines a modern React-based user interface with a secure Express and MongoDB backend to provide a practical and scalable wellness dashboard.

The project demonstrates strong software engineering principles, including modular architecture, authentication, route protection, reusable service logic, and real-world fitness data modeling. It is suitable for demo, academic, or portfolio purposes and can be expanded further with features such as AI-based recommendations, calendar scheduling, wearable integration, and advanced analytics.

Overall, the project successfully implements the concept of a digital fitness assistant that empowers users to manage training, nutrition, hydration, and personal progress in one unified application.

---

## 7. Summary of Project Value

This application provides value by:

- Helping users maintain a healthy routine
- Encouraging consistent workout habits
- Making nutrition and hydration tracking simple
- Providing visual analytics for personal progress
- Supporting motivation through goals, achievements, and challenges

This fitness tracker is not only a user-facing app but also a strong example of full-stack development practice, combining frontend interactivity with backend data handling and secure user flow management.
