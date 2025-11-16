# Smart Expense Splitter - Backend Documentation

## Overview
This is the backend API for the Smart Expense Splitter application, built with Node.js, Express, and MongoDB. It handles user authentication, group management, expense tracking, and debt reconciliation.

## Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a `.env` file in the root directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/smart-splitter
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
NODE_ENV=development
```

### 3. MongoDB Setup
- **Local**: Ensure MongoDB is running locally
- **Cloud**: Use MongoDB Atlas and update `MONGO_URI` with your connection string

## Running the Server

### Development Mode
```bash
npm run server:dev
```

### Production Mode
```bash
npm run server
```

### Run Both Frontend and Backend
```bash
npm start
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user (protected)
- `PUT /api/auth/profile` - Update user profile (protected)

### Groups
- `POST /api/groups` - Create a new group (protected)
- `GET /api/groups` - Get all user's groups (protected)
- `GET /api/groups/:groupId` - Get group details (protected)
- `PUT /api/groups/:groupId` - Update group (protected)
- `POST /api/groups/:groupId/members` - Add member to group (protected)

### Expenses
- `POST /api/expenses` - Add expense (protected)
- `GET /api/expenses/:groupId` - Get group expenses (protected)
- `PUT /api/expenses/:expenseId` - Update expense (protected)
- `DELETE /api/expenses/:expenseId` - Delete expense (protected)
- `GET /api/expenses/:groupId/debts` - Calculate debts (protected)

### Settlements
- `POST /api/settlements` - Create settlement (protected)
- `GET /api/settlements/:groupId` - Get group settlements (protected)
- `PUT /api/settlements/:settlementId/complete` - Mark settlement as completed (protected)

## Data Models

### User
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  phone: String,
  profilePicture: String,
  currency: String,
  groups: [ObjectId],
  timestamps: true
}
```

### Group
```javascript
{
  name: String,
  description: String,
  members: [{
    user: ObjectId,
    role: String (admin/member)
  }],
  currency: String,
  totalAmount: Number,
  expenses: [ObjectId],
  settlements: [ObjectId],
  timestamps: true
}
```

### Expense
```javascript
{
  groupId: ObjectId,
  description: String,
  amount: Number,
  paidBy: ObjectId,
  category: String,
  splits: [{
    userId: ObjectId,
    amount: Number
  }],
  receipt: String,
  status: String,
  timestamps: true
}
```

### Settlement
```javascript
{
  groupId: ObjectId,
  from: ObjectId,
  to: ObjectId,
  amount: Number,
  method: String,
  status: String (pending/completed),
  notes: String,
  timestamps: true
}
```

## Features

### Authentication
- User registration with password hashing (bcryptjs)
- JWT-based authentication
- Protected routes with middleware

### Group Management
- Create and manage expense groups
- Add members to groups with different roles
- Track multiple groups per user

### Expense Tracking
- Add expenses with automatic splits
- Categorize expenses
- Update or delete expenses
- Attach receipts

### Debt Reconciliation
- Calculate debts between group members
- Support for simple debt calculation
- Settlement tracking

### Multi-Currency Support
- Support for INR, USD, EUR, GBP
- Per-group currency settings

## Error Handling
All endpoints return consistent error responses:
```json
{
  "message": "Error description"
}
```

## Security Features
- Password hashing with bcryptjs
- JWT token validation
- Protected routes
- CORS enabled
- Environment variable protection

## Future Enhancements
- [ ] File upload for receipts
- [ ] Email notifications
- [ ] Payment gateway integration (PayPal/Venmo)
- [ ] Real-time updates with WebSockets
- [ ] Advanced debt reconciliation algorithm
- [ ] Rate limiting
- [ ] Request validation middleware
- [ ] API documentation with Swagger

## Troubleshooting

### MongoDB Connection Error
- Check if MongoDB is running
- Verify `MONGO_URI` is correct
- Check network connectivity

### JWT Token Error
- Ensure token is sent in `Authorization: Bearer <token>` header
- Check if token has expired

### CORS Error
- Verify frontend is running on `http://localhost:3000`
- Check CORS configuration in `server.js`

## Support
For issues or questions, please create an issue in the repository.
