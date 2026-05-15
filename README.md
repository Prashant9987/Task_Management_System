# Team Task Manager - Full Stack Application

A collaborative web application for managing projects and tasks with role-based access control (Admin & Member roles). Built with Node.js, Express, React, MongoDB, and secured with JWT authentication.

## Features

✅ **User Authentication**
- Secure registration and login with JWT tokens
- Password hashing with bcryptjs
- Protected API routes

✅ **Role-Based Access Control**
- **Admin Role:** Create/delete projects, manage team members, assign tasks
- **Member Role:** View assigned projects and tasks, update task status

✅ **Project Management**
- Create and manage projects (Admin only)
- Add/remove team members to projects (Admin only)
- View assigned projects (Members)

✅ **Task Management**
- Create tasks within projects
- Assign tasks to team members
- Update task status (To Do → In Progress → Done)
- Set task priority (Low, Medium, High)
- View assigned tasks

✅ **Professional Dashboard**
- Task statistics overview
- Project list with member count
- Kanban board for task management
- Blue and white color theme

✅ **Database**
- MongoDB Atlas Cloud database
- Mongoose ODM for schema validation
- Proper relationships between Users, Projects, and Tasks

---

## Project Structure

```
project2/
├── backend/
│   ├── models/
│   │   ├── User.js          # User schema with role and password hashing
│   │   ├── Project.js       # Project schema with members array
│   │   └── Task.js          # Task schema with status and priority
│   ├── controllers/
│   │   ├── authController.js    # Register, login, getMe
│   │   ├── projectController.js # CRUD operations for projects
│   │   └── taskController.js    # CRUD operations for tasks
│   ├── routes/
│   │   ├── authRoutes.js        # /api/auth endpoints
│   │   ├── projectRoutes.js     # /api/projects endpoints
│   │   └── taskRoutes.js        # /api/tasks endpoints
│   ├── middleware/
│   │   └── auth.js          # JWT verification & role-based authorization
│   ├── server.js            # Express server setup
│   ├── package.json         # Backend dependencies
│   └── .env.example         # Environment variables template
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js         # Login page
│   │   │   ├── Register.js      # Registration page
│   │   │   ├── Dashboard.js     # Main dashboard with projects
│   │   │   └── ProjectDetail.js # Project kanban board
│   │   ├── components/
│   │   │   └── PrivateRoute.js  # Protected routes wrapper
│   │   ├── context/
│   │   │   └── AuthContext.js   # Auth state management
│   │   ├── api.js               # API endpoints with axios
│   │   ├── App.js               # Main app routing
│   │   ├── index.js             # React DOM render
│   │   └── index.css            # Global styles with Tailwind
│   ├── public/
│   │   └── index.html           # HTML template
│   ├── tailwind.config.js       # Tailwind CSS configuration
│   ├── postcss.config.js        # PostCSS configuration
│   ├── package.json             # Frontend dependencies
│   └── .env.example             # Environment variables template
│
└── README.md                # This file

```

---
## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)

### Projects
- `GET /api/projects` - Get all projects (filtered by role)
- `POST /api/projects` - Create project (admin only)
- `GET /api/projects/:id` - Get project details
- `POST /api/projects/members/add` - Add member to project (admin only)
- `POST /api/projects/members/remove` - Remove member from project (admin only)
- `DELETE /api/projects/:id` - Delete project (admin only)

### Tasks
- `POST /api/tasks` - Create task
- `GET /api/tasks/project/:projectId` - Get project tasks
- `GET /api/tasks/user/assigned` - Get user's assigned tasks
- `PATCH /api/tasks/:id/status` - Update task status
- `PATCH /api/tasks/:id` - Update task details
- `DELETE /api/tasks/:id` - Delete task
- `GET /api/tasks/dashboard/stats` - Get dashboard statistics

---

## Default Test Users

After setting up, you can create test users:

**Admin User:**
- Name: Admin User
- Email: admin@test.com
- Password: password123
- Role: admin

**Member User:**
- Name: John Member
- Email: member@test.com
- Password: password123
- Role: member

---

## Key Features Explained

### 1. Authentication Flow
```
User Registration/Login
     ↓
JWT Token Generated
     ↓
Token Stored in LocalStorage
     ↓
Token Sent in API Requests
     ↓
Verified by Backend Middleware
```

### 2. Role-Based Authorization
- **Admin**: Can create/delete projects, manage members
- **Member**: Can only view assigned projects and tasks

### 3. Database Schema
```
Users
├── name (String)
├── email (String, unique)
├── password (String, hashed)
├── role (String: "admin" | "member")
└── createdAt (Date)

Projects
├── name (String)
├── description (String)
├── createdBy (ObjectId → User)
├── members (Array of ObjectIds → Users)
└── createdAt (Date)

Tasks
├── title (String)
├── description (String)
├── projectId (ObjectId → Project)
├── assignedTo (ObjectId → User)
├── status (String: "To Do" | "In Progress" | "Done")
├── priority (String: "Low" | "Medium" | "High")
├── dueDate (Date)
└── createdAt (Date)
```

### 4. Frontend Component Flow
```
App.js
├── AuthProvider (Context)
├── Routes
│   ├── /login (Login Page)
│   ├── /register (Register Page)
│   └── PrivateRoute
│       ├── /dashboard (Dashboard)
│       └── /project/:id (Project Detail)
```

---

## Styling

- **Framework**: Tailwind CSS
- **Color Scheme**: Blue (#1e40af, #3b82f6) and White (#ffffff)
- **Responsive**: Mobile-first design with grid and flex layouts

---

## How to Use

### As an Admin:
1. Register with role "admin"
2. Login to dashboard
3. Click "+ New Project" to create projects
4. Click on a project to view/manage tasks
5. Add members to projects using member management
6. Assign tasks to team members

### As a Member:
1. Register with role "member" (or admin creates account)
2. Login to dashboard
3. View only assigned projects
4. Click on project to see assigned tasks
5. Update task status by clicking "Move" button
6. Track progress on dashboard

---

## Deployment (Railway)

### Backend Deployment:
1. Push code to GitHub
2. Connect Railway to GitHub repository
3. Select backend folder as root directory
4. Add environment variables:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `PORT=5000`
   - `FRONTEND_URL` (your Railway frontend URL)
5. Deploy

### Frontend Deployment:
1. Push code to GitHub
2. Connect Railway to GitHub repository
3. Select frontend folder as root directory
4. Create environment file with:
   - `REACT_APP_API_URL=` (your Railway backend URL)
5. Deploy

---

## Technologies Used

**Backend:**
- Node.js & Express.js - Web framework
- MongoDB & Mongoose - Database
- bcryptjs - Password hashing
- jsonwebtoken - JWT authentication
- CORS - Cross-origin requests

**Frontend:**
- React 18 - UI library
- React Router v6 - Navigation
- Axios - HTTP client
- Tailwind CSS - Styling
- Context API - State management

---

## Troubleshooting

### Backend won't connect to MongoDB
- Check your IP is whitelisted in MongoDB Atlas
- Verify connection string in .env file
- Ensure username and password are correct

### Frontend can't reach backend
- Ensure backend is running on port 5000
- Check CORS configuration in server.js
- Verify proxy in frontend package.json

### JWT token errors
- Clear localStorage and login again
- Ensure JWT_SECRET is set in backend .env
- Check token expiration (set to 30 days)

### Tasks not showing
- Verify you're viewing a project you're assigned to
- Check task projectId matches project
- Ensure you have permissions to view

---

## Support & Documentation

For more information:
- [MongoDB Documentation](https://docs.mongodb.com)
- [Express.js Documentation](https://expressjs.com)
- [React Documentation](https://react.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [JWT Guide](https://jwt.io/introduction)

---

## License

This project is open source and available for educational purposes.

---

## Author Notes

This is a comprehensive full-stack application demonstrating:
- Secure authentication with JWT
- Role-based access control
- RESTful API design
- React component architecture
- MongoDB data modeling
- Professional UI/UX design

Perfect for learning full-stack development! 🚀
