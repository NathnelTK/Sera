using Microsoft.EntityFrameworkCore.Migrations;
using BCrypt.Net;

#nullable disable

namespace TalentOS.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class SeedDemoData : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Hash passwords
            var applicantPassword = BCrypt.Net.BCrypt.HashPassword("Applicant123!");
            var recruiterPassword = BCrypt.Net.BCrypt.HashPassword("Recruiter123!");

            // Generate GUIDs
            var applicant1Id = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var applicant2Id = Guid.Parse("22222222-2222-2222-2222-222222222222");
            var applicant3Id = Guid.Parse("33333333-3333-3333-3333-333333333333");
            var applicant4Id = Guid.Parse("44444444-4444-4444-4444-444444444444");
            
            var applicantProfile1Id = Guid.Parse("aaaaaaaa-1111-1111-1111-111111111111");
            var applicantProfile2Id = Guid.Parse("aaaaaaaa-2222-2222-2222-222222222222");
            var applicantProfile3Id = Guid.Parse("aaaaaaaa-3333-3333-3333-333333333333");
            var applicantProfile4Id = Guid.Parse("aaaaaaaa-4444-4444-4444-444444444444");
            
            var recruiter1Id = Guid.Parse("55555555-5555-5555-5555-555555555555");
            var recruiter2Id = Guid.Parse("66666666-6666-6666-6666-666666666666");
            var recruiter3Id = Guid.Parse("77777777-7777-7777-7777-777777777777");
            
            var recruiterProfile1Id = Guid.Parse("bbbbbbbb-1111-1111-1111-111111111111");
            var recruiterProfile2Id = Guid.Parse("bbbbbbbb-2222-2222-2222-222222222222");
            var recruiterProfile3Id = Guid.Parse("bbbbbbbb-3333-3333-3333-333333333333");

            var location1Id = Guid.Parse("aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
            var location2Id = Guid.Parse("bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
            var location3Id = Guid.Parse("cccccccc-cccc-cccc-cccc-cccccccccccc");

            var company1Id = Guid.Parse("dddddddd-dddd-dddd-dddd-dddddddddddd");
            var company2Id = Guid.Parse("eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee");
            var company3Id = Guid.Parse("ffffffff-ffff-ffff-ffff-ffffffffffff");

            var skill1Id = Guid.Parse("00000001-0000-0000-0000-000000000001");
            var skill2Id = Guid.Parse("00000002-0000-0000-0000-000000000002");
            var skill3Id = Guid.Parse("00000003-0000-0000-0000-000000000003");
            var skill4Id = Guid.Parse("00000004-0000-0000-0000-000000000004");
            var skill5Id = Guid.Parse("00000005-0000-0000-0000-000000000005");
            var skill6Id = Guid.Parse("00000006-0000-0000-0000-000000000006");
            var skill7Id = Guid.Parse("00000007-0000-0000-0000-000000000007");
            var skill8Id = Guid.Parse("00000008-0000-0000-0000-000000000008");
            var skill9Id = Guid.Parse("00000009-0000-0000-0000-000000000009");
            var skill10Id = Guid.Parse("00000010-0000-0000-0000-000000000010");
            var skill11Id = Guid.Parse("00000011-0000-0000-0000-000000000011");
            var skill12Id = Guid.Parse("00000012-0000-0000-0000-000000000012");
            var skill13Id = Guid.Parse("00000013-0000-0000-0000-000000000013");
            
            var job1Id = Guid.Parse("cccccccc-1111-1111-1111-111111111111");
            var job2Id = Guid.Parse("cccccccc-2222-2222-2222-222222222222");
            var job3Id = Guid.Parse("cccccccc-3333-3333-3333-333333333333");
            var job4Id = Guid.Parse("cccccccc-4444-4444-4444-444444444444");
            var job5Id = Guid.Parse("cccccccc-5555-5555-5555-555555555555");
            var job6Id = Guid.Parse("cccccccc-6666-6666-6666-666666666666");
            var job7Id = Guid.Parse("cccccccc-7777-7777-7777-777777777777");
            var job8Id = Guid.Parse("cccccccc-8888-8888-8888-888888888888");
            
            var cv1Id = Guid.Parse("dddddddd-1111-1111-1111-111111111111");
            var cv2Id = Guid.Parse("dddddddd-2222-2222-2222-222222222222");
            var cv3Id = Guid.Parse("dddddddd-3333-3333-3333-333333333333");
            var cv4Id = Guid.Parse("dddddddd-4444-4444-4444-444444444444");
            
            var notification1Id = Guid.Parse("eeeeeeee-1111-1111-1111-111111111111");
            var notification2Id = Guid.Parse("eeeeeeee-2222-2222-2222-222222222222");
            var notification3Id = Guid.Parse("eeeeeeee-3333-3333-3333-333333333333");
            var notification4Id = Guid.Parse("eeeeeeee-4444-4444-4444-444444444444");
            var notification5Id = Guid.Parse("eeeeeeee-5555-5555-5555-555555555555");
            var notification6Id = Guid.Parse("eeeeeeee-6666-6666-6666-666666666666");
            var notification7Id = Guid.Parse("eeeeeeee-7777-7777-7777-777777777777");
            
            var applicantSkill1Id = Guid.Parse("ffffffff-1111-1111-1111-111111111111");
            var applicantSkill2Id = Guid.Parse("ffffffff-2222-2222-2222-222222222222");
            var applicantSkill3Id = Guid.Parse("ffffffff-3333-3333-3333-333333333333");
            var applicantSkill4Id = Guid.Parse("ffffffff-4444-4444-4444-444444444444");
            var applicantSkill5Id = Guid.Parse("ffffffff-5555-5555-5555-555555555555");
            var applicantSkill6Id = Guid.Parse("ffffffff-6666-6666-6666-666666666666");
            var applicantSkill7Id = Guid.Parse("ffffffff-7777-7777-7777-777777777777");
            var applicantSkill8Id = Guid.Parse("ffffffff-8888-8888-8888-888888888888");
            var applicantSkill9Id = Guid.Parse("ffffffff-9999-9999-9999-999999999999");
            var applicantSkill10Id = Guid.Parse("ffffffff-aaaa-aaaa-aaaa-aaaaaaaaaaaa");
            var applicantSkill11Id = Guid.Parse("ffffffff-bbbb-bbbb-bbbb-bbbbbbbbbbbb");
            var applicantSkill12Id = Guid.Parse("ffffffff-cccc-cccc-cccc-cccccccccccc");
            var applicantSkill13Id = Guid.Parse("ffffffff-dddd-dddd-dddd-dddddddddddd");

            // Insert Locations
            migrationBuilder.Sql(@"
                INSERT INTO ""Locations"" (""Id"", ""City"", ""Country"", ""State"", ""PostalCode"", ""Latitude"", ""Longitude"", ""CreatedAt"", ""UpdatedAt"")
                VALUES 
                ('" + location1Id + @"', 'San Francisco', 'USA', 'CA', '94102', 37.7749, -122.4194, NOW(), NOW()),
                ('" + location2Id + @"', 'New York', 'USA', 'NY', '10001', 40.7128, -74.0060, NOW(), NOW()),
                ('" + location3Id + @"', 'Austin', 'USA', 'TX', '78701', 30.2672, -97.7431, NOW(), NOW())
                ON CONFLICT DO NOTHING;
            ");

            // Insert Companies
            migrationBuilder.Sql(@"
                INSERT INTO ""Companies"" (""Id"", ""Name"", ""Description"", ""Website"", ""LogoUrl"", ""Industry"", ""Size"", ""FoundedYear"", ""VerificationStatus"", ""HeadquartersLocationId"", ""CreatedAt"", ""UpdatedAt"")
                VALUES 
                ('" + company1Id + @"', 'TalentOS Labs', 'A leading talent acquisition platform', 'https://talentoslabs.com', 'https://example.com/logo1.png', 'Technology', '51-200', '2020', 1, '" + location1Id + @"', NOW(), NOW()),
                ('" + company2Id + @"', 'TechCorp', 'Enterprise technology solutions', 'https://techcorp.com', 'https://example.com/logo2.png', 'Technology', '201-500', '2015', 1, '" + location2Id + @"', NOW(), NOW()),
                ('" + company3Id + @"', 'Innovate.io', 'Innovation-focused startup', 'https://innovate.io', 'https://example.com/logo3.png', 'Technology', '11-50', '2021', 1, '" + location3Id + @"', NOW(), NOW())
                ON CONFLICT DO NOTHING;
            ");

            // Insert Skills
            migrationBuilder.Sql(@"
                INSERT INTO ""Skills"" (""Id"", ""Name"", ""Description"", ""CreatedAt"", ""UpdatedAt"")
                VALUES 
                ('" + skill1Id + @"', 'JavaScript', 'Programming language for web development', NOW(), NOW()),
                ('" + skill2Id + @"', 'TypeScript', 'Typed superset of JavaScript', NOW(), NOW()),
                ('" + skill3Id + @"', 'React', 'JavaScript library for building UIs', NOW(), NOW()),
                ('" + skill4Id + @"', 'Node.js', 'JavaScript runtime for server-side', NOW(), NOW()),
                ('" + skill5Id + @"', 'Figma', 'Design tool for interface design', NOW(), NOW()),
                ('" + skill6Id + @"', 'Python', 'Programming language for data science', NOW(), NOW()),
                ('" + skill7Id + @"', 'Machine Learning', 'AI and ML algorithms', NOW(), NOW()),
                ('" + skill8Id + @"', 'SQL', 'Database query language', NOW(), NOW()),
                ('" + skill9Id + @"', 'User Research', 'User experience research methodologies', NOW(), NOW()),
                ('" + skill10Id + @"', 'Prototyping', 'Creating interactive prototypes', NOW(), NOW()),
                ('" + skill11Id + @"', 'Agile', 'Agile project management methodologies', NOW(), NOW()),
                ('" + skill12Id + @"', 'Product Strategy', 'Strategic product planning', NOW(), NOW()),
                ('" + skill13Id + @"', 'Data Analysis', 'Statistical data analysis', NOW(), NOW())
                ON CONFLICT DO NOTHING;
            ");

            // Insert Users (Applicants)
            migrationBuilder.Sql(@"
                INSERT INTO ""Users"" (""Id"", ""Email"", ""PasswordHash"", ""Roles"", ""IsEmailVerified"", ""IsActive"", ""CreatedAt"", ""UpdatedAt"")
                VALUES 
                ('" + applicant1Id + @"', 'applicant@example.com', '" + applicantPassword + @"', 'Applicant', true, true, NOW(), NOW()),
                ('" + applicant2Id + @"', 'sarah.johnson@example.com', '" + applicantPassword + @"', 'Applicant', true, true, NOW(), NOW()),
                ('" + applicant3Id + @"', 'michael.chen@example.com', '" + applicantPassword + @"', 'Applicant', true, true, NOW(), NOW()),
                ('" + applicant4Id + @"', 'emily.davis@example.com', '" + applicantPassword + @"', 'Applicant', true, true, NOW(), NOW())
                ON CONFLICT (""Email"") DO NOTHING;
            ");

            // Insert Users (Recruiters)
            migrationBuilder.Sql(@"
                INSERT INTO ""Users"" (""Id"", ""Email"", ""PasswordHash"", ""Roles"", ""IsEmailVerified"", ""IsActive"", ""CreatedAt"", ""UpdatedAt"")
                VALUES 
                ('" + recruiter1Id + @"', 'recruiter@example.com', '" + recruiterPassword + @"', 'Recruiter', true, true, NOW(), NOW()),
                ('" + recruiter2Id + @"', 'hr@techcorp.com', '" + recruiterPassword + @"', 'Recruiter', true, true, NOW(), NOW()),
                ('" + recruiter3Id + @"', 'hiring@innovate.io', '" + recruiterPassword + @"', 'Recruiter', true, true, NOW(), NOW())
                ON CONFLICT (""Email"") DO NOTHING;
            ");

            // Insert Applicant Profiles
            migrationBuilder.Sql(@"
                INSERT INTO ""ApplicantProfiles"" (""Id"", ""UserId"", ""FirstName"", ""LastName"", ""Headline"", ""Summary"", ""Phone"", ""LinkedInUrl"", ""GitHubUrl"", ""PortfolioUrl"", ""IsOpenToWork"", ""LocationId"", ""CreatedAt"", ""UpdatedAt"")
                VALUES 
                ('" + applicantProfile1Id + @"', '" + applicant1Id + @"', 'John', 'Doe', 'Senior Software Engineer', 'Experienced software engineer with 5+ years of experience in full-stack development.', '+1-555-0101', 'https://linkedin.com/in/johndoe', 'https://github.com/johndoe', NULL, true, '" + location1Id + @"', NOW(), NOW()),
                ('" + applicantProfile2Id + @"', '" + applicant2Id + @"', 'Sarah', 'Johnson', 'UX Designer', 'Creative UX designer with 4 years of experience in creating user-centered digital experiences.', '+1-555-0102', 'https://linkedin.com/in/sarahjohnson', NULL, 'https://sarahjohnson.design', true, '" + location2Id + @"', NOW(), NOW()),
                ('" + applicantProfile3Id + @"', '" + applicant3Id + @"', 'Michael', 'Chen', 'Data Scientist', 'Data scientist with expertise in machine learning and statistical analysis.', '+1-555-0103', 'https://linkedin.com/in/michaelchen', 'https://github.com/michaelchen', NULL, true, '" + location1Id + @"', NOW(), NOW()),
                ('" + applicantProfile4Id + @"', '" + applicant4Id + @"', 'Emily', 'Davis', 'Product Manager', 'Product manager with 6 years of experience in SaaS products.', '+1-555-0104', 'https://linkedin.com/in/emilydavis', NULL, NULL, true, '" + location2Id + @"', NOW(), NOW())
                ON CONFLICT (""UserId"") DO NOTHING;
            ");

            // Insert Recruiter Profiles
            migrationBuilder.Sql(@"
                INSERT INTO ""RecruiterProfiles"" (""Id"", ""UserId"", ""CompanyId"", ""RecruiterType"", ""FirstName"", ""LastName"", ""Title"", ""Bio"", ""Phone"", ""CreatedAt"", ""UpdatedAt"")
                VALUES 
                ('" + recruiterProfile1Id + @"', '" + recruiter1Id + @"', '" + company1Id + @"', 1, 'Jane', 'Smith', 'Senior Technical Recruiter', 'Experienced technical recruiter specializing in software engineering roles.', '+1-555-0123', NOW(), NOW()),
                ('" + recruiterProfile2Id + @"', '" + recruiter2Id + @"', '" + company2Id + @"', 1, 'Robert', 'Johnson', 'HR Manager', 'HR manager with expertise in talent acquisition.', '+1-555-0456', NOW(), NOW()),
                ('" + recruiterProfile3Id + @"', '" + recruiter3Id + @"', '" + company3Id + @"', 1, 'Lisa', 'Wang', 'Talent Acquisition Lead', 'Talent acquisition lead focused on building diverse teams.', '+1-555-0789', NOW(), NOW())
                ON CONFLICT (""UserId"") DO NOTHING;
            ");

            // Insert Jobs
            migrationBuilder.Sql(@"
                INSERT INTO ""Jobs"" (""Id"", ""RecruiterProfileId"", ""CompanyId"", ""Title"", ""Description"", ""Requirements"", ""Benefits"", ""JobType"", ""WorkMode"", ""ExperienceLevel"", ""MinimumSalary"", ""MaximumSalary"", ""SalaryCurrency"", ""Status"", ""PublishedAt"", ""CreatedAt"", ""UpdatedAt"")
                VALUES 
                ('" + job1Id + @"', '" + recruiterProfile1Id + @"', '" + company1Id + @"', 'Senior Product Designer', 'We are looking for a Senior Product Designer to join our growing team.', '5+ years of product design experience, proficiency in Figma.', 'Competitive salary, remote work, health benefits.', 1, 2, 3, 90000, 130000, 'USD', 2, NOW(), NOW(), NOW()),
                ('" + job2Id + @"', '" + recruiterProfile1Id + @"', '" + company1Id + @"', 'Data Scientist', 'We are seeking a Data Scientist to help us leverage data for better talent matching.', '2+ years of data science experience, proficiency in Python and SQL.', 'Competitive salary, learning budget, flexible hours.', 1, 2, 2, 110000, 160000, 'USD', 2, NOW(), NOW(), NOW()),
                ('" + job3Id + @"', '" + recruiterProfile2Id + @"', '" + company2Id + @"', 'Full-stack Engineer', 'Join our engineering team to build innovative solutions for enterprise clients.', '3+ years of full-stack development, experience with React and Node.js.', 'Competitive salary, stock options, health benefits.', 1, 2, 3, 120000, 170000, 'USD', 2, NOW(), NOW(), NOW()),
                ('" + job4Id + @"', '" + recruiterProfile2Id + @"', '" + company2Id + @"', 'DevOps Engineer', 'We need a skilled DevOps Engineer to manage our cloud infrastructure.', '3+ years of DevOps experience, knowledge of AWS/GCP.', 'Competitive salary, remote work, certification support.', 1, 2, 3, 115000, 155000, 'USD', 2, NOW(), NOW(), NOW()),
                ('" + job5Id + @"', '" + recruiterProfile3Id + @"', '" + company3Id + @"', 'UX Researcher', 'Join our product team to conduct user research and inform product decisions.', '2+ years of UX research experience, proficiency in research methodologies.', 'Competitive salary, research tools budget, flexible schedule.', 1, 2, 2, 85000, 115000, 'USD', 2, NOW(), NOW(), NOW()),
                ('" + job6Id + @"', '" + recruiterProfile3Id + @"', '" + company3Id + @"', 'Frontend Developer', 'We are looking for a Frontend Developer to build beautiful user interfaces.', '2+ years of frontend development, expertise in React and CSS.', 'Competitive salary, modern tech stack, growth opportunities.', 1, 2, 2, 95000, 125000, 'USD', 2, NOW(), NOW(), NOW()),
                ('" + job7Id + @"', '" + recruiterProfile1Id + @"', '" + company1Id + @"', 'Backend Engineer', 'Help us build scalable backend services for our talent acquisition platform.', '3+ years of backend development, experience with Node.js and PostgreSQL.', 'Competitive salary, technical challenges, mentorship.', 1, 2, 3, 105000, 145000, 'USD', 1, NULL, NOW(), NOW()),
                ('" + job8Id + @"', '" + recruiterProfile2Id + @"', '" + company2Id + @"', 'Mobile Developer', 'Build mobile applications that reach millions of users worldwide.', '2+ years of mobile development, experience with React Native.', 'Competitive salary, latest devices, conference budget.', 1, 2, 2, 100000, 140000, 'USD', 2, NOW(), NOW(), NOW());
            ");

            // Insert Applicant Skills with proper skill matching
            migrationBuilder.Sql(@"
                INSERT INTO ""ApplicantSkills"" (""Id"", ""ApplicantProfileId"", ""SkillId"", ""Level"", ""YearsOfExperience"", ""CreatedAt"", ""UpdatedAt"")
                VALUES 
                ('" + applicantSkill1Id + @"', '" + applicantProfile1Id + @"', '" + skill1Id + @"', 3, 5, NOW(), NOW()),
                ('" + applicantSkill2Id + @"', '" + applicantProfile1Id + @"', '" + skill2Id + @"', 3, 5, NOW(), NOW()),
                ('" + applicantSkill3Id + @"', '" + applicantProfile1Id + @"', '" + skill3Id + @"', 3, 5, NOW(), NOW()),
                ('" + applicantSkill4Id + @"', '" + applicantProfile1Id + @"', '" + skill4Id + @"', 2, 5, NOW(), NOW()),
                ('" + applicantSkill5Id + @"', '" + applicantProfile2Id + @"', '" + skill5Id + @"', 3, 4, NOW(), NOW()),
                ('" + applicantSkill6Id + @"', '" + applicantProfile2Id + @"', '" + skill9Id + @"', 2, 4, NOW(), NOW()),
                ('" + applicantSkill7Id + @"', '" + applicantProfile2Id + @"', '" + skill10Id + @"', 3, 4, NOW(), NOW()),
                ('" + applicantSkill8Id + @"', '" + applicantProfile3Id + @"', '" + skill6Id + @"', 3, 3, NOW(), NOW()),
                ('" + applicantSkill9Id + @"', '" + applicantProfile3Id + @"', '" + skill7Id + @"', 3, 3, NOW(), NOW()),
                ('" + applicantSkill10Id + @"', '" + applicantProfile3Id + @"', '" + skill8Id + @"', 3, 3, NOW(), NOW()),
                ('" + applicantSkill11Id + @"', '" + applicantProfile4Id + @"', '" + skill11Id + @"', 3, 6, NOW(), NOW()),
                ('" + applicantSkill12Id + @"', '" + applicantProfile4Id + @"', '" + skill12Id + @"', 3, 6, NOW(), NOW()),
                ('" + applicantSkill13Id + @"', '" + applicantProfile4Id + @"', '" + skill13Id + @"', 2, 6, NOW(), NOW())
                ON CONFLICT DO NOTHING;
            ");

            // Insert sample CVs
            migrationBuilder.Sql(@"
                INSERT INTO ""CVs"" (""Id"", ""ApplicantProfileId"", ""FileName"", ""FileUrl"", ""FileSizeBytes"", ""IsPrimary"", ""CreatedAt"", ""UpdatedAt"")
                VALUES 
                ('" + cv1Id + @"', '" + applicantProfile1Id + @"', 'John_Doe_Resume.pdf', 'https://example.com/resumes/john_doe.pdf', 245000, true, NOW(), NOW()),
                ('" + cv2Id + @"', '" + applicantProfile2Id + @"', 'Sarah_Johnson_Resume.pdf', 'https://example.com/resumes/sarah_johnson.pdf', 198000, true, NOW(), NOW()),
                ('" + cv3Id + @"', '" + applicantProfile3Id + @"', 'Michael_Chen_Resume.pdf', 'https://example.com/resumes/michael_chen.pdf', 212000, true, NOW(), NOW()),
                ('" + cv4Id + @"', '" + applicantProfile4Id + @"', 'Emily_Davis_Resume.pdf', 'https://example.com/resumes/emily_davis.pdf', 189000, true, NOW(), NOW());
            ");

            // Insert sample Notifications
            migrationBuilder.Sql(@"
                INSERT INTO ""Notifications"" (""Id"", ""UserId"", ""NotificationType"", ""Title"", ""Message"", ""IsRead"", ""CreatedAt"", ""UpdatedAt"")
                VALUES 
                ('" + notification1Id + @"', '" + applicant1Id + @"', 1, 'Welcome to TalentOS!', 'Your account has been successfully created. Start building your profile today.', false, NOW(), NOW()),
                ('" + notification2Id + @"', '" + applicant2Id + @"', 1, 'Welcome to TalentOS!', 'Your account has been successfully created. Start building your profile today.', false, NOW(), NOW()),
                ('" + notification3Id + @"', '" + applicant3Id + @"', 1, 'Welcome to TalentOS!', 'Your account has been successfully created. Start building your profile today.', false, NOW(), NOW()),
                ('" + notification4Id + @"', '" + applicant4Id + @"', 1, 'Welcome to TalentOS!', 'Your account has been successfully created. Start building your profile today.', false, NOW(), NOW()),
                ('" + notification5Id + @"', '" + recruiter1Id + @"', 1, 'Welcome to TalentOS!', 'Your recruiter account has been successfully created. Start posting jobs today.', false, NOW(), NOW()),
                ('" + notification6Id + @"', '" + recruiter2Id + @"', 1, 'Welcome to TalentOS!', 'Your recruiter account has been successfully created. Start posting jobs today.', false, NOW(), NOW()),
                ('" + notification7Id + @"', '" + recruiter3Id + @"', 1, 'Welcome to TalentOS!', 'Your recruiter account has been successfully created. Start posting jobs today.', false, NOW(), NOW());
            ");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Remove seed data in reverse order of dependencies
            migrationBuilder.Sql("DELETE FROM \"Notifications\" WHERE \"Id\" IN ('eeeeeeee-1111-1111-1111-111111111111', 'eeeeeeee-2222-2222-2222-222222222222', 'eeeeeeee-3333-3333-3333-333333333333', 'eeeeeeee-4444-4444-4444-444444444444', 'eeeeeeee-5555-5555-5555-555555555555', 'eeeeeeee-6666-6666-6666-666666666666', 'eeeeeeee-7777-7777-7777-777777777777');");
            migrationBuilder.Sql("DELETE FROM \"CVs\" WHERE \"Id\" IN ('dddddddd-1111-1111-1111-111111111111', 'dddddddd-2222-2222-2222-222222222222', 'dddddddd-3333-3333-3333-333333333333', 'dddddddd-4444-4444-4444-444444444444');");
            migrationBuilder.Sql("DELETE FROM \"ApplicantSkills\" WHERE \"Id\" IN ('ffffffff-1111-1111-1111-111111111111', 'ffffffff-2222-2222-2222-222222222222', 'ffffffff-3333-3333-3333-333333333333', 'ffffffff-4444-4444-4444-444444444444', 'ffffffff-5555-5555-5555-555555555555', 'ffffffff-6666-6666-6666-666666666666', 'ffffffff-7777-7777-7777-777777777777', 'ffffffff-8888-8888-8888-888888888888', 'ffffffff-9999-9999-9999-999999999999', 'ffffffff-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ffffffff-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ffffffff-cccc-cccc-cccc-cccccccccccc', 'ffffffff-dddd-dddd-dddd-dddddddddddd');");
            migrationBuilder.Sql("DELETE FROM \"Jobs\" WHERE \"Id\" IN ('cccccccc-1111-1111-1111-111111111111', 'cccccccc-2222-2222-2222-222222222222', 'cccccccc-3333-3333-3333-333333333333', 'cccccccc-4444-4444-4444-444444444444', 'cccccccc-5555-5555-5555-555555555555', 'cccccccc-6666-6666-6666-666666666666', 'cccccccc-7777-7777-7777-777777777777', 'cccccccc-8888-8888-8888-888888888888');");
            migrationBuilder.Sql("DELETE FROM \"RecruiterProfiles\" WHERE \"Id\" IN ('bbbbbbbb-1111-1111-1111-111111111111', 'bbbbbbbb-2222-2222-2222-222222222222', 'bbbbbbbb-3333-3333-3333-333333333333');");
            migrationBuilder.Sql("DELETE FROM \"ApplicantProfiles\" WHERE \"Id\" IN ('aaaaaaaa-1111-1111-1111-111111111111', 'aaaaaaaa-2222-2222-2222-222222222222', 'aaaaaaaa-3333-3333-3333-333333333333', 'aaaaaaaa-4444-4444-4444-444444444444');");
            migrationBuilder.Sql("DELETE FROM \"Users\" WHERE \"Id\" IN ('11111111-1111-1111-1111-111111111111', '22222222-2222-2222-2222-222222222222', '33333333-3333-3333-3333-333333333333', '44444444-4444-4444-4444-444444444444', '55555555-5555-5555-5555-555555555555', '66666666-6666-6666-6666-666666666666', '77777777-7777-7777-7777-777777777777');");
            migrationBuilder.Sql("DELETE FROM \"Skills\" WHERE \"Name\" IN ('JavaScript', 'TypeScript', 'React', 'Node.js', 'Figma', 'Python', 'Machine Learning', 'SQL', 'User Research', 'Prototyping', 'Agile', 'Product Strategy', 'Data Analysis');");
            migrationBuilder.Sql("DELETE FROM \"Companies\" WHERE \"Name\" IN ('TalentOS Labs', 'TechCorp', 'Innovate.io');");
            migrationBuilder.Sql("DELETE FROM \"Locations\" WHERE \"City\" IN ('San Francisco', 'New York', 'Austin') AND \"Country\" = 'USA';");
        }
    }
}
