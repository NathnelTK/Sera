# Quick Migration Steps

## Backend Database Migration

### 1. Navigate to Backend Directory
```bash
cd TalentOS_output
```

### 2. Restore Dependencies
```bash
dotnet restore
```

### 3. Build Solution
```bash
dotnet build
```

### 4. Create Initial Migration
```bash
cd src/TalentOS.API
dotnet ef migrations add InitialCreate --project ../TalentOS.Infrastructure
```

### 5. Apply Migration to Database
```bash
dotnet ef database update --project ../TalentOS.Infrastructure
```

### 6. Run Backend API
```bash
dotnet run
```

Backend will start at: `http://localhost:5269`

## Frontend Setup

### 1. Navigate to Angular Directory
```bash
cd angular-app
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Run Angular Development Server
```bash
ng serve
```

Frontend will start at: `http://localhost:4200`

## Testing Connection

1. Open browser to `http://localhost:5269/scalar/v1` (API docs)
2. Open browser to `http://localhost:4200` (Angular app)
3. Test registration and login flow

## Configuration Files

- **Backend DB Config**: `TalentOS_output/src/TalentOS.API/appsettings.Development.json`
- **Frontend API Config**: `angular-app/src/environments/environment.ts`
- **Connection String**: Already configured for your Supabase database

## Troubleshooting Migration Issues

If migration fails:

1. **Check Database Connection**
   - Verify Supabase is accessible
   - Test connection string in a PostgreSQL client

2. **SSL Certificate Issues**
   - Add `TrustServerCertificate=True` to connection string if needed
   - Or ensure SSL certificates are properly configured

3. **Port Conflicts**
   - Ensure port 5269 is available for backend
   - Ensure port 4200 is available for frontend

4. **Dependencies**
   - Run `dotnet clean` then `dotnet restore`
   - Ensure .NET 10 SDK is installed

## Current Status

✅ PostgreSQL connection configured
✅ ASP.NET Core backend project structure complete
✅ Angular 18 frontend project structure complete
✅ JWT authentication implemented
✅ API endpoints created
✅ Angular services and guards created
✅ Routing configured
✅ Environment configuration set

⏳ Database migration (needs to be run)
⏳ Database seeding (needs to be done)
⏳ Angular page components (need to be created)

## Next Steps After Migration

1. Seed test data via API or directly in database
2. Create Angular page components (home, jobs, login, etc.)
3. Test full user flows
4. Implement document upload functionality
5. Connect real AI services
6. Add comprehensive error handling
7. Deploy to production