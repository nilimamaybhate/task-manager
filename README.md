# Task Manager App

A simple full-stack Task Manager application built using the MERN stack.

## Features

* User Registration
* User Login
* JWT Authentication
* Protected Routes
* Create Tasks
* View Tasks
* Edit Tasks
* Mark Tasks as Completed
* Delete Tasks
* Search Tasks
* Filter Tasks (All, Completed, Pending)
* Logout Functionality

## Tech Stack

### Frontend

* React
* React Router
* Axios
* Tailwind CSS

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT Authentication
* bcryptjs

## Project Structure

task-manager/

├── frontend/

│ ├── src/

│ ├── pages/

│ ├── components/

│ └── api/

│

└── backend/

├── controllers/

├── models/

├── routes/

├── middleware/

└── server.js

## Installation

### Clone the Repository

```bash
git clone <repository-url>
cd task-manager
```

### Frontend Setup

```bash
npm install
npm run dev
```

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

## Environment Variables

Create a `.env` file inside the backend folder:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
```

## API Endpoints

### Authentication

#### Register User

```http
POST /api/auth/register
```

#### Login User

```http
POST /api/auth/login
```

### Tasks

#### Get All Tasks

```http
GET /api/tasks
```

#### Create Task

```http
POST /api/tasks
```

#### Update Task Status

```http
PUT /api/tasks/:id
```

#### Edit Task

```http
PUT /api/tasks/edit/:id
```

#### Delete Task

```http
DELETE /api/tasks/:id
```

## Learning Outcomes

This project helped me learn:

* React Fundamentals
* React Hooks
* React Router
* State Management
* REST APIs
* Authentication using JWT
* MongoDB Database Operations
* Backend Development with Express
* Frontend and Backend Integration

## Future Improvements

* Dark Mode
* Due Dates for Tasks
* Task Categories
* User Profile Page
* Drag and Drop Tasks
* Responsive Mobile Design

## Author

Nilima 

Built as a learning project to practice full-stack web development using the MERN stack.
