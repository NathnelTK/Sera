# TalentOS - Recruitment Platform

A modern recruitment platform built with ASP.NET Core backend, Angular 18 frontend, and PostgreSQL database. Features include job posting, application management, interview scheduling, and AI-powered candidate matching.

## Architecture

This project uses a hybrid architecture:
- **Backend**: ASP.NET Core 10 with CQRS pattern, Entity Framework Core, and Scalar API documentation
- **Frontend**: Angular 18 with standalone components, route guards, and HTTP interceptors
- **Database**: PostgreSQL hosted on Supabase
- **API Documentation**: Scalar for interactive API testing

## Project Structure

```
talentos-99-main/
├── TalentOS_output/           # ASP.NET Core Backend (.NET 10)
│   ├── src/
│   │   ├── TalentOS.Domain/       # Domain entities and interfaces
│   │   ├── TalentOS.Application/  # CQRS handlers and business logic
│   │   ├── TalentOS.Infrastructure/ # EF Core and data access
│   │   └── TalentOS.API/          # Web API controllers with Scalar
│   └── TalentOS.sln
├── angular-app/               # Angular 18 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── services/         # HTTP services (auth, jobs, applications, etc.)
│   │   │   ├── guards/           # Route guards (auth, applicant, recruiter)
│   │   │   ├── interceptors/     # HTTP interceptors for JWT tokens
│   │   │   └── pages/            # Page components (⚠️ NOT YET CREATED)
│   │   └── environments/
│   └── package.json
└── SETUP_GUIDE.md            # Detailed setup instructions
```

## Current Status

### ✅ Completed
- ASP.NET Core backend with CQRS architecture
- Entity Framework Core with PostgreSQL integration
- JWT authentication with refresh tokens
- All API endpoints implemented
- Angular services for API communication
- Route guards for role-based access
- HTTP interceptors for token management
- Scalar API documentation configured
- Database connection to Supabase

### ⚠️ Issues to Fix
- **Angular routing issue**: The Angular app is configured to load page components from `./pages/` directory, but these components don't exist yet. The routing configuration expects components like:
  - `./pages/home/home.component`
  - `./pages/jobs/jobs.component`
  - `./pages/applicant/dashboard/dashboard.component`
  - `./pages/recruiter/dashboard/dashboard.component`
  - And many more...

The Angular app currently only has the infrastructure (services, guards, interceptors) but lacks the actual page components.

### ⏳ Incomplete
- Angular page components need to be created
- Database migration needs to be run
- Database seeding for test data
- File upload functionality for documents
- Real AI service integration

## API Endpoints Documentation

### Scalar API Documentation
The backend uses Scalar for interactive API documentation. Once the backend is running, access the documentation at:
```
http://localhost:5269/scalar/v1
```

### Authentication Endpoints
- `POST /api/auth/register` - Register new user
  - Body: `{ email, password, role }` (role: "Applicant" or "Recruiter")
  - Returns: User object with id, email, role
  - Validation: Password must be at least 8 characters

- `POST /api/auth/login` - Login user
  - Body: `{ email, password }`
  - Returns: User object with JWT tokens (access + refresh)
  - Validation: Email and password required

- `POST /api/auth/refresh` - Refresh JWT token
  - Body: `{ refreshToken }`
  - Returns: New access token

- `POST /api/auth/logout` - Logout user
  - Body: `{ refreshToken }`
  - Returns: Success message

### Jobs Endpoints
- `GET /api/jobs` - Get all jobs (public)
  - Returns: Array of jobs with id, title, company, location, status, created_at
  - Query params: None

- `GET /api/jobs/{id}` - Get specific job details (public)
  - Returns: Full job details including description, requirements, salary range
  - Params: Job ID in URL

- `POST /api/jobs` - Create new job (Recruiter only)
  - Body: `{ title, company, description, requirements, responsibilities, qualifications, location, salary_min, salary_max, status }`
  - Returns: Created job object
  - Auth: Requires Bearer token with Recruiter role

- `PUT /api/jobs/{id}` - Update job (Recruiter only)
  - Body: Same as POST (all fields optional)
  - Returns: Updated job object
  - Auth: Requires Bearer token with Recruiter role

- `DELETE /api/jobs/{id}` - Delete job (Recruiter only)
  - Returns: Success message
  - Auth: Requires Bearer token with Recruiter role

### Applications Endpoints
- `GET /api/applications` - Get applications (authenticated)
  - Query params: `applicantId` (filter by applicant), `jobId` (filter by job)
  - Returns: Array of applications with job and applicant details
  - Auth: Requires Bearer token

- `POST /api/applications` - Submit job application (Applicant only)
  - Body: `{ jobId, coverLetter }`
  - Returns: Created application object
  - Auth: Requires Bearer token with Applicant role
  - Validation: Job must be published, user can only apply once per job

- `GET /api/applications/{id}` - Get specific application details
  - Returns: Full application details with job info, applicant profile, and skills
  - Auth: Requires Bearer token (own application for applicants, any for recruiters)

- `PUT /api/applications/{id}` - Update application status (Recruiter only)
  - Body: `{ status }` (Pending, Reviewed, Shortlisted, Rejected, Accepted)
  - Returns: Updated application object
  - Auth: Requires Bearer token with Recruiter role
  - Notification: Automatically notifies applicant of status change

- `DELETE /api/applications/{id}` - Withdraw application (Applicant only)
  - Returns: Success message
  - Auth: Requires Bearer token with Applicant role
  - Validation: Cannot withdraw after Accepted or Rejected status

### Interviews Endpoints
- `GET /api/interviews` - Get interviews (authenticated)
  - Query params: `applicantId`, `recruiterId`
  - Returns: Array of interviews filtered by user role
  - Auth: Requires Bearer token (filtered by user's role)

- `POST /api/interviews` - Schedule interview (Recruiter only)
  - Body: `{ applicationId, jobId, applicantId, scheduledDate, duration, notes }`
  - Returns: Created interview object
  - Auth: Requires Bearer token with Recruiter role
  - Validation: Date cannot be in the past
  - Notification: Automatically notifies applicant

- `PUT /api/interviews/{id}` - Update interview (Recruiter only)
  - Body: `{ scheduledDate, duration, status, notes }`
  - Returns: Updated interview object
  - Auth: Requires Bearer token with Recruiter role

- `DELETE /api/interviews/{id}` - Cancel interview (Recruiter only)
  - Returns: Success message
  - Auth: Requires Bearer token with Recruiter role

### Documents Endpoints
- `GET /api/documents` - Get user documents (Applicant only)
  - Returns: Array of documents with metadata
  - Auth: Requires Bearer token with Applicant role

- `POST /api/documents` - Upload document (Applicant only)
  - Body: FormData with `file` and `documentType` (CV, Certificate, Other)
  - Returns: Created document object
  - Auth: Requires Bearer token with Applicant role
  - Note: Currently uses placeholder URL implementation

- `DELETE /api/documents/{id}` - Delete document (Applicant only)
  - Returns: Success message
  - Auth: Requires Bearer token with Applicant role

### Notifications Endpoints
- `GET /api/notifications` - Get user notifications (authenticated)
  - Query params: `unreadOnly=true` for unread only
  - Returns: Array of notifications
  - Auth: Requires Bearer token

- `PUT /api/notifications` - Mark notifications as read
  - Body: `{ notificationIds: [], markAsRead: true }`
  - Returns: Success message
  - Auth: Requires Bearer token

### Profile Endpoints
- `GET /api/profile` - Get user profile (authenticated)
  - Returns: User profile with skills (for applicants) or company info (for recruiters)
  - Auth: Requires Bearer token

- `PUT /api/profile` - Update user profile (authenticated)
  - Body (Applicant): `{ name, headline, summary, openToWork, links, skills: [{ name, proficiency }] }`
  - Body (Recruiter): `{ name, company, position, contactInfo }`
  - Returns: Updated profile object
  - Auth: Requires Bearer token

### AI Tools Endpoints
- `POST /api/ai/resume-analyzer` - Analyze resume (authenticated)
  - Body: `{ resumeText }`
  - Returns: Analysis with summary, strengths, weaknesses, suggestions, score
  - Auth: Requires Bearer token
  - Note: Currently uses simulated AI responses

- `POST /api/ai/candidate-matching` - Match candidate to job (authenticated)
  - Body: `{ candidateProfile, jobDescription }`
  - Returns: Matching score, insights, gaps, recommendation
  - Auth: Requires Bearer token
  - Note: Currently uses simulated AI responses

### Health Endpoint
- `GET /api/health` - Health check endpoint
  - Returns: Service status

## Authentication in Scalar

To test authenticated endpoints in Scalar:
1. First call `POST /api/auth/register` to create a user
2. Then call `POST /api/auth/login` to get tokens
3. Copy the `accessToken` from the response
4. Click "Authorize" button in Scalar
5. Enter: `Bearer YOUR_ACCESS_TOKEN`
6. Now you can test protected endpoints

## Database Connection

The PostgreSQL connection is configured in:
- `TalentOS_output/src/TalentOS.API/appsettings.json`

Current connection string:
```
Host=YOUR_SUPABASE_HOST;Port=5432;Database=postgres;Username=YOUR_DB_USERNAME;Password=YOUR_DB_PASSWORD
```

## Setup Instructions

### Backend Setup
1. Navigate to backend directory: `cd TalentOS_output`
2. Restore dependencies: `dotnet restore`
3. Build solution: `dotnet build`
4. Create migration: `cd src/TalentOS.API && dotnet ef migrations add InitialCreate --project ../TalentOS.Infrastructure`
5. Apply migration: `dotnet ef database update --project ../TalentOS.Infrastructure`
6. Run backend: `dotnet run`
7. Access Scalar docs: `http://localhost:5269/scalar/v1`

### Frontend Setup
1. Navigate to Angular directory: `cd angular-app`
2. Install dependencies: `npm install`
3. Run Angular dev server: `ng serve`
4. Access frontend: `http://localhost:4200`

**⚠️ Important**: The Angular frontend will not work properly until the missing page components are created. The routing is configured but the components don't exist yet.

## Angular Routing Issue

The Angular routing configuration in `angular-app/src/app/app.routes.ts` references components that don't exist:

**Expected but missing components:**
- `pages/home/home.component`
- `pages/jobs/jobs.component`
- `pages/job-detail/job-detail.component`
- `pages/login/login.component`
- `pages/register/register.component`
- `pages/applicant/dashboard/dashboard.component`
- `pages/applicant/applications/applications.component`
- `pages/applicant/application-detail/application-detail.component`
- `pages/applicant/profile/profile.component`
- `pages/applicant/documents/documents.component`
- `pages/applicant/interviews/interviews.component`
- `pages/applicant/notifications/notifications.component`
- `pages/applicant/ai-tools/ai-tools.component`
- `pages/recruiter/dashboard/dashboard.component`
- `pages/recruiter/jobs/jobs.component`
- `pages/recruiter/job-create/job-create.component`
- `pages/recruiter/job-applications/job-applications.component`
- `pages/recruiter/interviews/interviews.component`
- `pages/recruiter/profile/profile.component`
- `pages/recruiter/notifications/notifications.component`
- `pages/recruiter/ai-tools/ai-tools.component`

**Solution**: These components need to be created using Angular CLI:
```bash
cd angular-app
ng generate component pages/home
ng generate component pages/jobs
# ... etc for all components
```

## Development Workflow

### Backend Development
1. Modify domain entities in `TalentOS.Domain`
2. Update handlers in `TalentOS.Application`
3. Add/update controllers in `TalentOS.API`
4. Create migration if schema changed
5. Test changes via Scalar at `http://localhost:5269/scalar/v1`

### Frontend Development
1. Create missing page components
2. Implement component logic and templates
3. Use existing services for API calls
4. Test routing and navigation
5. Verify authentication flows

## Security Notes

- Change the default JWT secret in production
- Use environment variables for sensitive configuration
- Restrict CORS policy in production
- Enable HTTPS in production
- Current password hashing uses BCrypt
- SQL injection prevention via EF Core parameterized queries

## Support

For detailed setup instructions, see `SETUP_GUIDE.md` and `MIGRATION_STEPS.md`.

## Next Steps

1. **Fix Angular routing**: Create all missing page components
2. **Run database migration**: Set up the database schema
3. **Seed test data**: Create test users and job postings
4. **Test authentication flow**: Verify login/register functionality
5. **Implement file uploads**: Complete document upload functionality
6. **Integrate real AI services**: Replace simulated AI responses
7. **Add comprehensive error handling**: Improve error messages and handling
8. **Set up production environment**: Configure for production deployment
