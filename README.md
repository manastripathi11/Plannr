# Plannr - Team Task Manager Web Application

A full-stack, production-ready team task manager application built with the MERN stack (MongoDB, Express.js, React.js, Node.js). The UI is designed with modern aesthetics (Tailwind CSS) inspired by ClickUp.

## 🚀 Features
- **JWT Authentication**: Secure user registration, login, and protected routes.
- **Role-Based Access Control**:
  - **Admin**: Create projects, add members, manage tasks.
  - **Member**: View assigned projects, update task statuses.
- **Project Management**: Group tasks into collaborative projects.
- **Task Management**: Full CRUD operations with priority, status, and due dates.
- **Dashboard**: High-level metrics, charts, and recent tasks overview.
- **Kanban Board View**: Intuitive board for tracking task progress.

## 🛠️ Tech Stack
- **Frontend**: React (Vite), Tailwind CSS v4, React Router DOM, Recharts, Lucide React, Axios.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), JSON Web Tokens (JWT), Bcrypt.js.

## 📁 Folder Structure
```
Plannr/
├── client/          # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/  # Reusable UI components
│   │   ├── context/     # React Context for global state (Auth)
│   │   ├── pages/       # Route-level page components
│   │   ├── App.jsx      # Main application router
│   │   └── main.jsx     # Application entry point
│   ├── .env.example
│   └── package.json
├── server/          # Node.js backend
│   ├── config/      # Database and token configurations
│   ├── controllers/ # Route logic handlers
│   ├── middleware/  # Auth and error handling middlewares
│   ├── models/      # Mongoose schemas
│   ├── routes/      # Express API routes
│   ├── .env.example
│   ├── index.js     # Server entry point
│   └── package.json
├── .gitignore
└── README.md
```

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB installed locally or MongoDB Atlas connection URI

### 1. Clone & Install Dependencies
Navigate to both the `client` and `server` directories and install dependencies.
```bash
# In the server folder
cd server
npm install

# In the client folder
cd ../client
npm install
```

### 2. Environment Variables
Create `.env` files in both `client` and `server` folders using the provided `.env.example` templates.

**server/.env**
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
CLIENT_URL=http://localhost:5173
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Run the Application locally
**Start the Backend server (from the /server directory):**
```bash
npm run dev
```

**Start the Frontend client (from the /client directory):**
```bash
npm run dev
```
