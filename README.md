# AIMSR Role-Based Management System

A comprehensive role-based student management system built with Next.js, MongoDB, and JWT authentication.

## Features

- **Role-Based Access Control**: SUPERADMIN, ADMIN, and STUDENT roles with appropriate permissions
- **Secure Authentication**: JWT-based authentication with bcrypt password hashing
- **User Management**: Create, update, delete users with role-specific permissions
- **Student Management**: Separate student collection with detailed academic information
- **Bulk Student Upload**: Support for CSV/Excel file upload for mass student creation
- **Responsive Dashboard**: Shared dashboard layout with role-specific navigation
- **Seed System**: Initial superadmin creation and sample data seeding

## Architecture

### User Roles & Permissions

#### SUPERADMIN

- Full system access
- Manage administrators
- Manage students
- System settings
- Access all dashboard features

#### ADMIN

- Manage students
- Create student accounts
- View student records
- Limited system settings

#### STUDENT

- View personal dashboard
- Access profile information
- View courses and attendance
- Read-only access to personal data

### Database Collections

1. **users**: Authentication and basic user information

   - `_id`, `email`, `password`, `role`, `firstName`, `lastName`
   - Used for login and role-based access control

2. **students**: Detailed student academic information
   - Links to users collection via `userId`
   - Contains academic details like registration number, batch, etc.

## Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` with your configuration:

   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_super_secret_jwt_key_min_32_chars
   SUPERADMIN_EMAIL=admin@aimsr.edu.in
   SUPERADMIN_PASSWORD=SuperAdmin@123
   SUPERADMIN_FIRSTNAME=Super
   SUPERADMIN_LASTNAME=Administrator
   SEED_SECRET_KEY=your_seed_secret_key
   ```

4. **Database Setup**
   - Create a MongoDB database
   - Update the MONGODB_URI in your .env.local file

## Getting Started

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Seed the SUPERADMIN user**

   ```bash
   curl -X POST http://localhost:3000/api/seed/superadmin \
     -H "Authorization: Bearer your_seed_secret_key"
   ```

3. **Seed sample students (optional)**

   ```bash
   curl -X POST http://localhost:3000/api/seed/students \
     -H "Authorization: Bearer your_seed_secret_key"
   ```

4. **Login**
   - Navigate to http://localhost:3000/login
   - Use the SUPERADMIN credentials from your .env.local file

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user information

### User Management

- `POST /api/users/create` - Create new user (SUPERADMIN/ADMIN)
- `GET /api/users/list` - List users with pagination
- `PUT /api/users/update/[id]` - Update user information
- `DELETE /api/users/delete/[id]` - Delete user

### Student Management

- `POST /api/students/create` - Create new student
- `GET /api/students/list` - List students with pagination and search
- `POST /api/students/bulk-upload` - Bulk upload students from CSV

### Seeding

- `POST /api/seed/superadmin` - Create initial SUPERADMIN user
- `POST /api/seed/students` - Seed sample student data

## Route Structure

```
app/
├── login/                     # Login page
├── unauthorized/              # Unauthorized access page
├── (dashboard)/              # Protected dashboard layout
│   ├── layout.tsx            # Shared dashboard theme
│   ├── superadmin/
│   │   ├── dashboard/        # SUPERADMIN dashboard
│   │   ├── create-admin/     # Create admin users
│   │   ├── create-student/   # Create students
│   │   ├── manage-admins/    # Manage administrators
│   │   ├── manage-students/  # Manage students
│   │   └── settings/         # System settings
│   ├── admin/
│   │   ├── dashboard/        # ADMIN dashboard
│   │   ├── create-student/   # Create students
│   │   ├── manage-students/  # Manage students
│   │   └── settings/         # Admin settings
│   └── student/
│       ├── dashboard/        # STUDENT dashboard
│       ├── profile/          # Student profile
│       ├── courses/          # Course information
│       └── attendance/       # Attendance records
```

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt with salt rounds for password security
- **Role-Based Middleware**: Server-side route protection
- **Input Validation**: Comprehensive input validation on all endpoints
- **CORS Protection**: Configured for secure cross-origin requests

## Development

### File Structure

```
src/
├── app/                      # Next.js app router
├── components/               # Reusable UI components
├── contexts/                 # React contexts
├── lib/                      # Utility libraries
│   ├── auth.ts              # Authentication utilities
│   ├── jwt.ts               # JWT utilities
│   ├── mongodb.ts           # Database connection
│   └── seed-students.ts     # Student seeding utilities
├── models/                   # TypeScript interfaces
└── types/                    # Type definitions
```

### Development Commands

```bash
npm run dev         # Start development server
npm run build       # Build for production
npm run start       # Start production server
npm run lint        # Run ESLint
```

## Production Deployment

1. **Environment Variables**

   - Set strong JWT secrets
   - Use production MongoDB URI
   - Update SUPERADMIN credentials
   - Set NODE_ENV to production

2. **Security Considerations**
   - Change all default passwords
   - Use strong JWT secrets (minimum 32 characters)
   - Enable HTTPS in production
   - Regular security updates

## License

This project is licensed under the MIT License.

## Support

For support and questions, please contact the development team.
