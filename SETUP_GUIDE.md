# TalentOS Platform - Setup and Migration Guide

This guide provides step-by-step instructions for setting up and running the TalentOS Recruitment Platform with ASP.NET Core backend, Angular 18 frontend, and PostgreSQL database.

## Prerequisites

- **.NET 10 SDK** - Download from [https://dotnet.microsoft.com/download](https://dotnet.microsoft.com/download)
- **Node.js 18+** - Download from [https://nodejs.org](https://nodejs.org)
- **Angular CLI 18+** - Install via `npm install -g @angular/cli@18`
- **PostgreSQL database** - Using Supabase (connection string already configured)
- **Git** - For version control

## Project Structure

```
talentos-99-main/
├── TalentOS_output/           # ASP.NET Core Backend (.NET 10)
│   ├── src/
│   │   ├── TalentOS.Domain/       # Domain entities and interfaces
│   │   ├── TalentOS.Application/  # CQRS handlers and business logic
│   │   ├── TalentOS.Infrastructure/ # EF Core and data access
│   │   └── TalentOS.API/          # Web API controllers
│   └── TalentOS.sln
├── angular-app/               # Angular 18 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── services/         # HTTP services
│   │   │   ├── guards/           # Route guards
│   │   │   ├── interceptors/     # HTTP interceptors
│   │   │   └── pages/            # Page components
│   │   └── environments/
│   └── package.json
└── SETUP_GUIDE.md            # This file
```

## Database Configuration

The PostgreSQL connection string is already configured in:
- `TalentOS_output/src/TalentOS.API/appsettings.Development.json`

Current connection:
```
postgresql://YOUR_DB_USERNAME:YOUR_DB_PASSWORD@YOUR_SUPABASE_HOST:5432/postgres
```

## Backend Setup and Migration

### Step 1: Restore Dependencies

```bash
cd TalentOS_output
dotnet restore
```

### Step 2: Build the Solution

```bash
dotnet build
```

### Step 3: Create EF Core Migration

```bash
cd src/TalentOS.API
dotnet ef migrations add InitialCreate --project ../TalentOS.Infrastructure
```

### Step 4: Apply Migration to Database

```bash
dotnet ef database update --project ../TalentOS.Infrastructure
```

**Note:** If you encounter any SSL certificate issues with Supabase, you may need to add SSL configuration to your connection string or trust the certificate.

### Step 5: Run the Backend API

```bash
cd src/TalentOS.API
dotnet run
```

The API will start at: `http://localhost:5269`

API Documentation (Scalar): `http://localhost:5269/scalar/v1`

## Frontend Setup

### Step 1: Install Dependencies

```bash
cd angular-app
npm install
```

### Step 2: Configure Environment

The Angular environment is already configured to connect to the backend:
- `src/environments/environment.ts` points to `http://localhost:5269/api`

### Step 3: Run the Angular Development Server

```bash
ng serve
```

The Angular app will start at: `http://localhost:4200`

## Database Seeding

The backend includes comprehensive database entities, but you may want to seed initial data. Here's how to add seed data:

### Option 1: Manual Data Entry via API

1. Start the backend API
2. Use the Scalar UI at `http://localhost:5269/scalar/v1`
3. Use the `/api/auth/register` endpoint to create test users:
   - Applicant: `applicant@example.com` / `Applicant123!`
   - Recruiter: `recruiter@example.com` / `Recruiter123!`

### Option 2: Add Seed Data in Code

You can add seed data in the `TalentOSDbContext` `OnModelCreating` method or create a custom seeding service.

## Testing the Integration

### 1. Test Backend API

1. Ensure the backend is running at `http://localhost:5269`
2. Visit `http://localhost:5269/scalar/v1` to access the API documentation
3. Test the `/api/health` endpoint (if available) to verify connectivity

### 2. Test Frontend Connection

1. Ensure both backend (`http://localhost:5269`) and frontend (`http://localhost:4200`) are running
2. Navigate to `http://localhost:4200`
3. Try to register a new user or login
4. Check browser console for any CORS or connection errors

### 3. Test Authentication Flow

1. Register as an Applicant:
   - Email: `test@example.com`
   - Password: `Test123!`
   - Role: `Applicant`
2. Login with the credentials
3. Verify you're redirected to the applicant dashboard
4. Test JWT token storage in localStorage

## Troubleshooting

### Backend Issues

**Migration fails with connection error:**
- Verify your PostgreSQL connection string is correct
- Check if Supabase allows connections from your IP
- Ensure SSL certificates are trusted

**Build errors:**
- Run `dotnet clean` then `dotnet build`
- Ensure all NuGet packages are restored
- Check for version conflicts in package references

**API doesn't start:**
- Check if port 5269 is available
- Verify appsettings.json configuration
- Check logs in the `logs/` folder

### Frontend Issues

**Angular build fails:**
- Run `npm install` to ensure all dependencies are installed
- Check Node.js version (should be 18+)
- Clear Angular cache: `ng cache clean`

**CORS errors:**
- The backend has permissive CORS settings for development
- If still experiencing issues, check `Program.cs` CORS configuration

**API connection errors:**
- Verify backend is running at `http://localhost:5269`
- Check `environment.ts` API URL configuration
- Review browser console for specific error messages

### Database Issues

**Connection timeout:**
- Check Supabase dashboard for connection status
- Verify your network allows external database connections
- Test connection using a PostgreSQL client tool

**Migration errors:**
- Drop existing tables and re-run migrations (for development only)
- Check for conflicting entity configurations
- Review migration SQL for potential issues

## Development Workflow

### Making Backend Changes

1. Modify domain entities in `TalentOS.Domain`
2. Update handlers in `TalentOS.Application`
3. Add/update controllers in `TalentOS.API`
4. Create new migration if schema changed:
   ```bash
   dotnet ef migrations add MigrationName --project ../TalentOS.Infrastructure
   dotnet ef database update --project ../TalentOS.Infrastructure
   ```
5. Test changes via Scalar API documentation

### Making Frontend Changes

1. Modify components in `angular-app/src/app/`
2. Update services for API calls
3. Test changes in browser at `http://localhost:4200`
4. Angular CLI provides hot-reload for most changes

## Production Deployment

### Backend Deployment

1. Update `appsettings.Production.json` with production database connection string
2. Set strong JWT secret in production settings
3. Configure appropriate CORS policy for production domains
4. Build the project: `dotnet build -c Release`
5. Deploy to your hosting service (Azure, AWS, etc.)

### Frontend Deployment

1. Update `environment.prod.ts` with production API URL
2. Build the Angular project: `ng build --configuration production`
3. Deploy the `dist/` folder to your hosting service
4. Configure server-side routing for Angular routes

## Security Considerations

- **JWT Secret**: Change the default JWT secret in production
- **Database Connection**: Use environment variables for sensitive data
- **CORS**: Restrict CORS to specific domains in production
- **HTTPS**: Enable HTTPS in production
- **Password Hashing**: BCrypt is already implemented
- **SQL Injection**: EF Core parameterized queries prevent this

## API Endpoints Overview

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Jobs
- `GET /api/jobs` - Get all jobs
- `GET /api/jobs/{id}` - Get specific job
- `POST /api/jobs` - Create job (Recruiter only)
- `PUT /api/jobs/{id}` - Update job (Recruiter only)
- `DELETE /api/jobs/{id}` - Delete job (Recruiter only)

### Applications
- `GET /api/applications` - Get applications
- `POST /api/applications` - Submit application (Applicant only)
- `PUT /api/applications/{id}` - Update status (Recruiter only)
- `DELETE /api/applications/{id}` - Withdraw application (Applicant only)

### Interviews
- `GET /api/interviews` - Get interviews
- `POST /api/interviews` - Schedule interview (Recruiter only)
- `PUT /api/interviews/{id}` - Update interview (Recruiter only)
- `DELETE /api/interviews/{id}` - Cancel interview (Recruiter only)

### Documents
- `GET /api/documents` - Get documents (Applicant only)
- `POST /api/documents` - Upload document (Applicant only)
- `DELETE /api/documents/{id}` - Delete document (Applicant only)

### Notifications
- `GET /api/notifications` - Get notifications
- `PUT /api/notifications` - Mark as read

### Profile
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile

### AI Tools
- `POST /api/ai/resume-analyzer` - Analyze resume
- `POST /api/ai/candidate-matching` - Match candidate to job

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review API documentation at `/scalar/v1`
3. Check application logs in the `logs/` folder
4. Verify database connection and migration status

## Next Steps

1. Complete the database migration as outlined above
2. Seed initial test data
3. Test the full authentication flow
4. Implement remaining Angular page components
5. Add comprehensive error handling
6. Implement file upload for documents
7. Add real AI service integration
8. Set up production environment
9. Add comprehensive testing
10. Deploy to production

---

**Note:** This system uses real PostgreSQL database connections. Ensure your database is accessible and properly configured before running migrations.