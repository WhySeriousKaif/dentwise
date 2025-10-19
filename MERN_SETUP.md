# Dentwise MERN Stack Setup

This project has been converted from Clerk + Prisma to a MERN stack with Redux for state management.

## Backend Setup

1. **Install backend dependencies:**
   ```bash
   cd server
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the `server` directory:
   ```env
   PORT=8000
   MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/dentwise?retryWrites=true&w=majority
   JWT_SECRET=your-super-secret-jwt-key-here-make-it-long-and-random
   NODE_ENV=development
   CLIENT_URL=http://localhost:3000
   ```

3. **Start the backend server:**
   ```bash
   cd server
   npm run dev
   ```

## Frontend Setup

1. **Update environment variables:**
   Update your `.env.local` file:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:8000/api
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

## Key Changes Made

### Backend (Express.js + MongoDB)
- ✅ Express.js server with MongoDB connection
- ✅ JWT authentication with bcrypt password hashing
- ✅ User and Appointment models
- ✅ Authentication middleware
- ✅ RESTful API endpoints

### Frontend (Next.js + Redux)
- ✅ Redux Toolkit for state management
- ✅ Custom authentication components
- ✅ Protected routes
- ✅ API service layer with axios
- ✅ Removed Clerk dependencies

### Authentication Flow
1. User signs up/in through custom forms
2. JWT token stored in HTTP-only cookies
3. Redux manages authentication state
4. Protected routes check authentication status
5. API calls include credentials automatically

## API Endpoints

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/signin` - User login
- `POST /api/auth/signout` - User logout
- `GET /api/auth/me` - Get current user

### Appointments
- `POST /api/appointments` - Create appointment
- `GET /api/appointments` - Get user appointments
- `GET /api/appointments/stats` - Get appointment statistics
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Delete appointment

## Database Schema

### User Model
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  phone: String,
  profilePic: String,
  role: String (enum: ['patient', 'doctor', 'admin']),
  isActive: Boolean,
  appointments: [ObjectId],
  createdAt: Date,
  updatedAt: Date
}
```

### Appointment Model
```javascript
{
  patient: ObjectId (ref: User),
  doctor: ObjectId (ref: User),
  date: Date,
  time: String,
  duration: Number,
  status: String (enum: ['CONFIRMED', 'COMPLETED', 'CANCELLED']),
  notes: String,
  reason: String,
  createdAt: Date,
  updatedAt: Date
}
```

## Redux Store Structure

```javascript
{
  auth: {
    user: User | null,
    isAuthenticated: boolean,
    loading: boolean,
    error: string | null
  },
  appointments: {
    appointments: Appointment[],
    stats: {
      totalAppointments: number,
      confirmedAppointments: number,
      completedAppointments: number
    },
    loading: boolean,
    error: string | null
  }
}
```

## Next Steps

1. Set up MongoDB Atlas or local MongoDB
2. Update environment variables with your MongoDB connection string
3. Start both backend and frontend servers
4. Test authentication flow
5. Add more features as needed

## Dependencies to Remove

You can now remove these dependencies:
```bash
npm uninstall @clerk/nextjs @prisma/client prisma
```
