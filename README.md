# 🚀 Team Task Manager (MERN Stack)

A professional, production-ready Task Management application with Role-Based Access Control (RBAC). Built using the MERN stack and styled with Tailwind CSS.

## 🌟 Features

### Admin Role:
* **Dashboard:** Real-time statistics (Total, Pending, Completed, Overdue tasks).
* **Project Management:** Create new projects and assign team members.
* **Task Management:** Create and assign tasks to specific users with deadlines.
* **User Management:** View all registered team members.

### Member Role:
* **Personal Dashboard:** View summary of assigned work.
* **Task View:** See tasks specifically assigned to them.
* **Status Updates:** Update task status (Pending, In Progress, Completed).

---

## 🛠️ Tech Stack

*   **Frontend:** React.js, Tailwind CSS v4, Axios, React Router Dom.
*   **Backend:** Node.js, Express.js.
*   **Database:** MongoDB (Mongoose).
*   **Auth:** JWT (JSON Web Tokens) & Bcrypt.js.
*   **Deployment:** Railway (Backend/DB) & Vercel (Frontend).

---

## 🚀 Getting Started and for admin use 
use this mail for login

#######________mail- you@gmail.com
#######________pass-  you@123

### 1. Prerequisites
* Node.js installed.
* MongoDB Atlas account or local MongoDB.

### 2. Backend Setup
1. Go to the `backend` folder: `cd backend`
2. Install dependencies: `npm install`
3. Create a `.env` file and add:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_random_secret_key



