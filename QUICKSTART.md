# Smart Expense Splitter - Quick Start Guide

## What's Been Set Up

### Backend (Node.js + Express + MongoDB)
- ✅ Complete REST API with all CRUD operations
- ✅ MongoDB models for Users, Groups, Expenses, Settlements
- ✅ JWT Authentication & Authorization
- ✅ Password hashing with bcryptjs
- ✅ CORS enabled for frontend communication
- ✅ Error handling middleware
- ✅ Protected routes

### Frontend (React + TypeScript)
- ✅ Complete UI with all features
- ✅ Real-time state management
- ✅ API integration service
- ✅ Responsive design
- ✅ Group management
- ✅ Expense tracking
- ✅ Debt calculation
- ✅ Analytics dashboard

## Getting Started

### Step 1: MongoDB Setup
**Option A: Local MongoDB**
- Download from https://www.mongodb.com/try/download/community
- Install and start MongoDB
- Use default connection: `mongodb://localhost:27017/smart-splitter`

**Option B: MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create a free account
3. Create a cluster
4. Get connection string
5. Update `.env` with your connection string

### Step 2: Start the Application

**Run Backend Only:**
```bash
npm run server:dev
```
Backend will run on `http://localhost:5000`

**Run Frontend Only:**
```bash
npm run dev
```
Frontend will run on `http://localhost:8080`

**Run Both Together:**
```bash
npm start
```

### Step 3: Test the API
1. Open Postman or use `curl`
2. Register a new user:
```bash
POST http://localhost:5000/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "+1234567890"
}
```

3. Login:
```bash
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

4. Create a Group:
```bash
POST http://localhost:5000/api/groups
Authorization: Bearer <token_from_login>
Content-Type: application/json

{
  "name": "Weekend Trip",
  "description": "Our fun trip",
  "members": ["user_id1", "user_id2"],
  "currency": "INR"
}
```

## File Structure

```
project-root/
├── src/                    # Frontend (React)
│   ├── pages/
│   ├── components/
│   ├── services/
│   │   └── api.js         # API integration
│   └── App.tsx
├── server/                 # Backend (Node.js)
│   ├── models/            # MongoDB schemas
│   │   ├── User.js
│   │   ├── Group.js
│   │   ├── Expense.js
│   │   └── Settlement.js
│   ├── controllers/       # Business logic
│   │   ├── authController.js
│   │   ├── groupController.js
│   │   ├── expenseController.js
│   │   └── settlementController.js
│   ├── routes/            # API endpoints
│   │   ├── auth.js
│   │   ├── groups.js
│   │   ├── expenses.js
│   │   └── settlements.js
│   ├── middleware/        # Custom middleware
│   │   └── auth.js
│   └── server.js          # Main server file
├── .env                   # Environment variables
└── package.json          # Dependencies
```

## Key Features

### 1. Authentication
- User registration with secure password hashing
- Login with JWT token
- Profile management

### 2. Group Management
- Create expense groups
- Add multiple members
- Different user roles (admin/member)
- Multi-currency support

### 3. Expense Tracking
- Add expenses with category
- Automatic equal split among members
- Track who paid
- Edit/delete expenses

### 4. Debt Reconciliation
- Automatic debt calculation
- Shows who owes whom
- Settlement tracking
- Multiple payment methods (Cash, Venmo, PayPal, etc.)

### 5. Analytics
- Spending by category
- Monthly summaries
- Group statistics

## API Base URL
- Development: `http://localhost:5000/api`
- Production: Update in `.env`

## Environment Variables
```env
PORT=5000                    # Server port
MONGO_URI=...              # MongoDB connection string
JWT_SECRET=...             # JWT signing secret
NODE_ENV=development       # Environment
```

## Useful Commands

```bash
# Install dependencies
npm install

# Start frontend dev server
npm run dev

# Start backend dev server
npm run server:dev

# Start both together
npm start

# Build frontend
npm run build

# Lint code
npm run lint

# Preview build
npm run preview
```

## Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

### MongoDB Connection Failed
- Check MongoDB is running
- Verify connection string in `.env`
- Check network connectivity

### CORS Errors
- Ensure frontend is on `http://localhost:8080`
- Ensure backend is on `http://localhost:5000`

## Next Steps

1. **Customize**: Update colors, branding, and features
2. **Deploy**: Use Vercel (frontend) and Heroku/Railway (backend)
3. **Database**: Use MongoDB Atlas for production
4. **Security**: Update JWT_SECRET and other sensitive values
5. **Testing**: Add unit and integration tests
6. **Documentation**: Update API docs with Swagger

## Support
For more help, check BACKEND_README.md for detailed API documentation.

---

**Happy splitting!** 🎉
