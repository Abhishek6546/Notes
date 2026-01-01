# Task Management System

A full-stack MERN (MongoDB, Express, React, Node.js) application for managing tasks with priority-based organization.

## Features

- **User Authentication**: Register and login to manage personal tasks.
- **Task Management**: Create, read, update, and delete tasks.
- **Priority System**: Organize tasks by priority (High, Medium, Low) with color coding.
- **Drag and Drop**: Reorder tasks using drag-and-drop functionality.
- **Responsive Design**: Works on desktop and mobile devices.

## Tech Stack

### Frontend
- **React**: UI library
- **Vite**: Build tool and development server
- **Axios**: HTTP client
- **React Router**: Navigation
- **React Beautiful DnD**: Drag and drop interface
- **Tailwind CSS** (via index.css styles)

### Backend
- **Node.js & Express**: Server runtime and framework
- **MongoDB & Mongoose**: Database and ODM
- **JWT**: Authentication
- **Bcryptjs**: Password hashing

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (Local instance or Atlas URI)

## Installation & Setup

### 1. Backend Setup

Navigate to the `server` directory:
```bash
cd server
```

Install dependencies:
```bash
npm install
```

Create a `.env` file in the `server` directory with the following variables:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/task_manager
JWT_SECRET=your_jwt_secret_key
```

Start the server:
```bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
```
The server will run on `http://localhost:5000`.

### 2. Frontend Setup

Navigate to the `frontend` directory:
```bash
cd frontend
```

Install dependencies:
```bash
npm install
```

Start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:5173`.

## Usage

1. Ensure MongoDB is running.
2. Start the backend server (`npm run dev` in `server`).
3. Start the frontend application (`npm run dev` in `frontend`).
4. Open your browser and navigate to `http://localhost:5173`.
5. Register a new account to start managing your tasks.

## API Endpoints

- `POST /api/auth/register`: Register a new user
- `POST /api/auth/login`: Login user
- `GET /api/auth/me`: Get current user profile
- `GET /api/tasks`: Get all tasks
- `POST /api/tasks`: Create a new task
- `PUT /api/tasks/:id`: Update a task
- `DELETE /api/tasks/:id`: Delete a task
