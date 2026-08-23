import { pool } from './db'
import bcrypt from 'bcrypt'

export async function seedDatabase() {
  try {
    // Hash passwords
    const applicantPassword = await bcrypt.hash('Applicant123!', 10)
    const recruiterPassword = await bcrypt.hash('Recruiter123!', 10)

    // Insert applicants
    const applicantUsers = await pool.query(
      `INSERT INTO public.users (email, password_hash, role) 
       VALUES 
       ($1, $2, $3),
       ($4, $5, $6),
       ($7, $8, $9),
       ($10, $11, $12)
       ON CONFLICT (email) DO NOTHING 
       RETURNING id, email`,
      [
        'applicant@example.com', applicantPassword, 'Applicant',
        'sarah.johnson@example.com', applicantPassword, 'Applicant',
        'michael.chen@example.com', applicantPassword, 'Applicant',
        'emily.davis@example.com', applicantPassword, 'Applicant'
      ]
    )

    // Insert recruiters
    const recruiterUsers = await pool.query(
      `INSERT INTO public.users (email, password_hash, role) 
       VALUES 
       ($1, $2, $3),
       ($4, $5, $6),
       ($7, $8, $9)
       ON CONFLICT (email) DO NOTHING 
       RETURNING id, email`,
      [
        'recruiter@example.com', recruiterPassword, 'Recruiter',
        'hr@techcorp.com', recruiterPassword, 'Recruiter',
        'hiring@innovate.io', recruiterPassword, 'Recruiter'
      ]
    )

    const applicantIds = applicantUsers.rows
    const recruiterIds = recruiterUsers.rows

    if (applicantIds.length === 0 || recruiterIds.length === 0) {
      console.log('Users already exist, skipping seed data')
      return
    }

    // Insert applicant profiles
    const applicantProfiles = await pool.query(
      `INSERT INTO public.applicant_profiles (user_id, name, headline, summary, open_to_work, links) 
       VALUES 
       ($1, $2, $3, $4, $5, $6),
       ($7, $8, $9, $10, $11, $12),
       ($13, $14, $15, $16, $17, $18),
       ($19, $20, $21, $22, $23, $24)
       RETURNING id, user_id`,
      [
        applicantIds[0].id, 'John Doe', 'Senior Software Engineer', 
        'Experienced software engineer with 5+ years of experience in full-stack development. Passionate about building scalable applications and mentoring junior developers.',
        true, JSON.stringify([{ type: 'linkedin', url: 'https://linkedin.com/in/johndoe' }, { type: 'github', url: 'https://github.com/johndoe' }]),
        
        applicantIds[1].id, 'Sarah Johnson', 'UX Designer', 
        'Creative UX designer with 4 years of experience in creating user-centered digital experiences. Skilled in design thinking and prototyping.',
        true, JSON.stringify([{ type: 'linkedin', url: 'https://linkedin.com/in/sarahjohnson' }, { type: 'portfolio', url: 'https://sarahjohnson.design' }]),
        
        applicantIds[2].id, 'Michael Chen', 'Data Scientist', 
        'Data scientist with expertise in machine learning and statistical analysis. 3 years of experience turning data into actionable insights.',
        true, JSON.stringify([{ type: 'linkedin', url: 'https://linkedin.com/in/michaelchen' }, { type: 'github', url: 'https://github.com/michaelchen' }]),
        
        applicantIds[3].id, 'Emily Davis', 'Product Manager', 
        'Product manager with 6 years of experience in SaaS products. Strong background in agile methodologies and cross-functional team leadership.',
        true, JSON.stringify([{ type: 'linkedin', url: 'https://linkedin.com/in/emilydavis' }])
      ]
    )

    const profileIds = applicantProfiles.rows

    // Insert skills for each applicant
    await pool.query(
      `INSERT INTO public.skills (applicant_profile_id, name, proficiency) 
       VALUES 
       ($1, $2, $3), ($4, $5, $6), ($7, $8, $9), ($10, $11, $12),
       ($13, $14, $15), ($16, $17, $18), ($19, $20, $21), ($22, $23, $24),
       ($25, $26, $27), ($28, $29, $30), ($31, $32, $33), ($34, $35, $36),
       ($37, $38, $39), ($40, $41, $42), ($43, $44, $45), ($46, $47, $48)`,
      [
        // John Doe's skills
        profileIds[0].id, 'JavaScript', 'Advanced',
        profileIds[0].id, 'TypeScript', 'Advanced',
        profileIds[0].id, 'React', 'Advanced',
        profileIds[0].id, 'Node.js', 'Intermediate',
        
        // Sarah Johnson's skills
        profileIds[1].id, 'Figma', 'Advanced',
        profileIds[1].id, 'UI Design', 'Advanced',
        profileIds[1].id, 'User Research', 'Intermediate',
        profileIds[1].id, 'Prototyping', 'Advanced',
        
        // Michael Chen's skills
        profileIds[2].id, 'Python', 'Advanced',
        profileIds[2].id, 'Machine Learning', 'Advanced',
        profileIds[2].id, 'SQL', 'Advanced',
        profileIds[2].id, 'Data Visualization', 'Intermediate',
        
        // Emily Davis's skills
        profileIds[3].id, 'Agile', 'Advanced',
        profileIds[3].id, 'Product Strategy', 'Advanced',
        profileIds[3].id, 'Stakeholder Management', 'Advanced',
        profileIds[3].id, 'Data Analysis', 'Intermediate'
      ]
    )

    // Insert recruiter profiles
    await pool.query(
      `INSERT INTO public.recruiter_profiles (user_id, name, company, position, contact_info) 
       VALUES 
       ($1, $2, $3, $4, $5),
       ($6, $7, $8, $9, $10),
       ($11, $12, $13, $14, $15)`,
      [
        recruiterIds[0].id, 'Jane Smith', 'TalentOS Labs', 'Senior Technical Recruiter',
        JSON.stringify({ email: 'jane.smith@talentoslabs.com', phone: '+1-555-0123' }),
        
        recruiterIds[1].id, 'Robert Johnson', 'TechCorp', 'HR Manager',
        JSON.stringify({ email: 'robert.johnson@techcorp.com', phone: '+1-555-0456' }),
        
        recruiterIds[2].id, 'Lisa Wang', 'Innovate.io', 'Talent Acquisition Lead',
        JSON.stringify({ email: 'lisa.wang@innovate.io', phone: '+1-555-0789' })
      ]
    )

    // Insert jobs
    const jobs = await pool.query(
      `INSERT INTO public.jobs (recruiter_id, title, company, description, requirements, responsibilities, qualifications, location, salary_min, salary_max, status) 
       VALUES 
       ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11),
       ($12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22),
       ($23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33),
       ($34, $35, $36, $37, $38, $39, $40, $41, $42, $43, $44),
       ($45, $46, $47, $48, $49, $50, $51, $52, $53, $54, $55),
       ($56, $57, $58, $59, $60, $61, $62, $63, $64, $65, $66),
       ($67, $68, $69, $70, $71, $72, $73, $74, $75, $76, $77),
       ($78, $79, $80, $81, $82, $83, $84, $85, $86, $87, $88)
       RETURNING id`,
      [
        recruiterIds[0].id, 'Senior Product Designer', 'TalentOS Labs', 
        'We are looking for a Senior Product Designer to join our growing team and help shape the future of our talent acquisition platform.',
        '5+ years of product design experience, proficiency in Figma, strong portfolio showcasing UX/UI work.',
        'Lead design initiatives, create user-centered designs, collaborate with cross-functional teams, mentor junior designers.',
        'Bachelor\'s degree in Design or related field, experience with design systems, strong communication skills.',
        'Remote', 90000, 130000, 'Published',
        
        recruiterIds[0].id, 'Data Scientist', 'TalentOS Labs', 
        'We are seeking a Data Scientist to help us leverage data for better talent matching and insights.',
        '2+ years of data science experience, proficiency in Python and SQL, experience with machine learning.',
        'Analyze user behavior data, build predictive models, create data visualizations, collaborate with product team.',
        'Master\'s degree in Data Science, Statistics, or related field, strong analytical skills.',
        'Remote', 110000, 160000, 'Published',
        
        recruiterIds[1].id, 'Full-stack Engineer', 'TechCorp', 
        'Join our engineering team to build innovative solutions for enterprise clients.',
        '3+ years of full-stack development, experience with React and Node.js, knowledge of cloud services.',
        'Develop and maintain web applications, participate in code reviews, collaborate with product team.',
        'Bachelor\'s degree in Computer Science or equivalent experience, strong problem-solving skills.',
        'San Francisco, CA', 120000, 170000, 'Published',
        
        recruiterIds[1].id, 'DevOps Engineer', 'TechCorp', 
        'We need a skilled DevOps Engineer to manage our cloud infrastructure and CI/CD pipelines.',
        '3+ years of DevOps experience, knowledge of AWS/GCP, experience with Kubernetes and Docker.',
        'Manage cloud infrastructure, implement CI/CD pipelines, monitor system performance, ensure security.',
        'Bachelor\'s degree in Computer Science or related field, strong automation skills.',
        'Remote', 115000, 155000, 'Published',
        
        recruiterIds[2].id, 'UX Researcher', 'Innovate.io', 
        'Join our product team to conduct user research and inform product decisions.',
        '2+ years of UX research experience, proficiency in research methodologies, strong analytical skills.',
        'Conduct user interviews, analyze research data, create user personas, present insights to stakeholders.',
        'Bachelor\'s or Master\'s degree in Psychology, HCI, or related field, excellent communication skills.',
        'New York, NY', 85000, 115000, 'Published',
        
        recruiterIds[2].id, 'Frontend Developer', 'Innovate.io', 
        'We are looking for a Frontend Developer to build beautiful and responsive user interfaces.',
        '2+ years of frontend development, expertise in React and CSS, experience with modern build tools.',
        'Build user interfaces, optimize performance, collaborate with designers, implement responsive designs.',
        'Bachelor\'s degree in Computer Science or equivalent, strong attention to detail.',
        'Remote', 95000, 125000, 'Published',
        
        recruiterIds[0].id, 'Backend Engineer', 'TalentOS Labs', 
        'Help us build scalable backend services for our talent acquisition platform.',
        '3+ years of backend development, experience with Node.js and PostgreSQL, knowledge of API design.',
        'Design and implement APIs, optimize database queries, ensure system scalability, write unit tests.',
        'Bachelor\'s degree in Computer Science or equivalent, strong problem-solving abilities.',
        'Remote', 105000, 145000, 'Draft',
        
        recruiterIds[1].id, 'Mobile Developer', 'TechCorp', 
        'Build mobile applications that reach millions of users worldwide.',
        '2+ years of mobile development, experience with React Native or Swift, knowledge of mobile UI patterns.',
        'Develop mobile features, optimize app performance, collaborate with backend team, test on multiple devices.',
        'Bachelor\'s degree in Computer Science or equivalent, portfolio of mobile apps.',
        'Austin, TX', 100000, 140000, 'Published'
      ]
    )

    // Get job IDs
    const jobIds = jobs.rows.map(row => row.id)

    // Insert applications with different statuses
    const applications = await pool.query(
      `INSERT INTO public.applications (job_id, applicant_id, status, cover_letter) 
       VALUES 
       ($1, $2, $3, $4),
       ($5, $6, $7, $8),
       ($9, $10, $11, $12),
       ($13, $14, $15, $16),
       ($17, $18, $19, $20),
       ($21, $22, $23, $24),
       ($25, $26, $27, $28),
       ($29, $30, $31, $32),
       ($33, $34, $35, $36),
       ($37, $38, $39, $40)
       RETURNING id`,
      [
        jobIds[0], applicantIds[0].id, 'Pending', 
        'I am excited to apply for the Senior Product Designer position. With my experience in creating user-centered designs and my passion for talent acquisition technology, I believe I would be a great fit for this role.',
        
        jobIds[1], applicantIds[0].id, 'Reviewed',
        'I am writing to express my interest in the Data Scientist position. My background in machine learning and statistical analysis makes me confident in my ability to contribute to your team.',
        
        jobIds[2], applicantIds[0].id, 'Shortlisted',
        'I am enthusiastic about the Full-stack Engineer position at TechCorp. My experience with React and Node.js aligns perfectly with your requirements.',
        
        jobIds[0], applicantIds[1].id, 'Pending',
        'As a UX Designer with 4 years of experience, I am thrilled to apply for the Senior Product Designer role. My portfolio demonstrates my expertise in creating user-centered designs.',
        
        jobIds[4], applicantIds[1].id, 'Reviewed',
        'I am excited about the UX Researcher position. My background in user research and design thinking makes me a strong candidate for this role.',
        
        jobIds[1], applicantIds[2].id, 'Accepted',
        'I am eager to apply for the Data Scientist position. My expertise in Python, SQL, and machine learning, combined with my analytical mindset, makes me an ideal candidate.',
        
        jobIds[3], applicantIds[2].id, 'Pending',
        'I am interested in the DevOps Engineer position. My experience with cloud infrastructure and automation tools aligns well with your needs.',
        
        jobIds[5], applicantIds[0].id, 'Rejected',
        'I am applying for the Frontend Developer position. My React skills and frontend experience would be valuable to your team.',
        
        jobIds[6], applicantIds[0].id, 'Pending',
        'I am excited about the Backend Engineer opportunity. My Node.js and PostgreSQL experience would allow me to contribute immediately.',
        
        jobIds[7], applicantIds[0].id, 'Reviewed',
        'I am applying for the Mobile Developer position. While my primary experience is in web development, I have been learning React Native and am eager to transition to mobile.'
      ]
    )

    // Insert documents for multiple applicants
    await pool.query(
      `INSERT INTO public.documents (applicant_id, name, file_url, file_type, file_size, document_type) 
       VALUES 
       ($1, $2, $3, $4, $5, $6),
       ($7, $8, $9, $10, $11, $12),
       ($13, $14, $15, $16, $17, $18),
       ($19, $20, $21, $22, $23, $24),
       ($25, $26, $27, $28, $29, $30),
       ($31, $32, $33, $34, $35, $36),
       ($37, $38, $39, $40, $41, $42),
       ($43, $44, $45, $46, $47, $48)`,
      [
        applicantIds[0].id, 'John_Doe_Resume.pdf', 'https://example.com/resumes/john_doe.pdf', 'application/pdf', 245000, 'CV',
        applicantIds[0].id, 'AWS_Certificate.pdf', 'https://example.com/certificates/aws.pdf', 'application/pdf', 156000, 'Certificate',
        
        applicantIds[1].id, 'Sarah_Johnson_Resume.pdf', 'https://example.com/resumes/sarah_johnson.pdf', 'application/pdf', 198000, 'CV',
        applicantIds[1].id, 'UX_Portfolio.pdf', 'https://example.com/portfolios/sarah_ux.pdf', 'application/pdf', 3200000, 'Other',
        
        applicantIds[2].id, 'Michael_Chen_Resume.pdf', 'https://example.com/resumes/michael_chen.pdf', 'application/pdf', 212000, 'CV',
        applicantIds[2].id, 'Machine_Learning_Course.pdf', 'https://example.com/certificates/ml_course.pdf', 'application/pdf', 145000, 'Certificate',
        
        applicantIds[3].id, 'Emily_Davis_Resume.pdf', 'https://example.com/resumes/emily_davis.pdf', 'application/pdf', 189000, 'CV',
        applicantIds[3].id, 'PMP_Certificate.pdf', 'https://example.com/certificates/pmp.pdf', 'application/pdf', 178000, 'Certificate'
      ]
    )

    // Insert interviews with different statuses
    const applicationIds = applications.rows.map(row => row.id)
    
    const scheduledDate = new Date()
    scheduledDate.setDate(scheduledDate.getDate() + 7) // Schedule for 1 week from now
    
    const completedDate = new Date()
    completedDate.setDate(completedDate.getDate() - 3) // Completed 3 days ago
    
    const cancelledDate = new Date()
    cancelledDate.setDate(cancelledDate.getDate() - 10) // Cancelled 10 days ago

    await pool.query(
      `INSERT INTO public.interviews (application_id, job_id, applicant_id, recruiter_id, scheduled_date, duration, status, notes) 
       VALUES 
       ($1, $2, $3, $4, $5, $6, $7, $8),
       ($9, $10, $11, $12, $13, $14, $15, $16),
       ($17, $18, $19, $20, $21, $22, $23, $24),
       ($25, $26, $27, $28, $29, $30, $31, $32),
       ($33, $34, $35, $36, $37, $38, $39, $40)`,
      [
        applicationIds[0], jobIds[0], applicantIds[0].id, recruiterIds[0].id, scheduledDate, 60, 'Scheduled', 
        'Initial screening interview to discuss candidate\'s experience and portfolio.',
        
        applicationIds[2], jobIds[2], applicantIds[0].id, recruiterIds[1].id, completedDate, 45, 'Completed',
        'Technical interview went well. Candidate demonstrated strong problem-solving skills.',
        
        applicationIds[5], jobIds[1], applicantIds[2].id, recruiterIds[0].id, completedDate, 60, 'Completed',
        'Final interview - candidate accepted the job offer.',
        
        applicationIds[1], jobIds[1], applicantIds[0].id, recruiterIds[0].id, scheduledDate, 30, 'Scheduled',
        'Phone screening to discuss data science background and experience.',
        
        applicationIds[3], jobIds[0], applicantIds[1].id, recruiterIds[0].id, cancelledDate, 60, 'Cancelled',
        'Interview cancelled by candidate due to scheduling conflict.'
      ]
    )

    // Insert notifications for multiple users
    await pool.query(
      `INSERT INTO public.notifications (user_id, title, message, type, related_id, is_read) 
       VALUES 
       ($1, $2, $3, $4, $5, $6),
       ($7, $8, $9, $10, $11, $12),
       ($13, $14, $15, $16, $17, $18),
       ($19, $20, $21, $22, $23, $24),
       ($25, $26, $27, $28, $29, $30),
       ($31, $32, $33, $34, $35, $36),
       ($37, $38, $39, $40, $41, $42),
       ($43, $44, $45, $46, $47, $48),
       ($49, $50, $51, $52, $53, $54),
       ($55, $56, $57, $58, $59, $60),
       ($61, $62, $63, $64, $65, $66),
       ($67, $68, $69, $70, $71, $72)`,
      [
        applicantIds[0].id, 'Application Submitted', 'Your application for Senior Product Designer has been submitted successfully.', 'Application', applicationIds[0], false,
        applicantIds[0].id, 'Interview Scheduled', 'You have an interview scheduled for Senior Product Designer on ' + scheduledDate.toISOString(), 'Interview', applicationIds[0], false,
        applicantIds[0].id, 'Application Status Update', 'Your application for Full-stack Engineer has been shortlisted!', 'Application', applicationIds[2], false,
        applicantIds[0].id, 'Interview Completed', 'Your technical interview for Full-stack Engineer has been completed.', 'Interview', applicationIds[2], true,
        
        applicantIds[1].id, 'Application Submitted', 'Your application for Senior Product Designer has been submitted successfully.', 'Application', applicationIds[3], false,
        applicantIds[1].id, 'Interview Cancelled', 'Your interview for Senior Product Designer has been cancelled.', 'Interview', applicationIds[3], false,
        
        applicantIds[2].id, 'Application Submitted', 'Your application for Data Scientist has been submitted successfully.', 'Application', applicationIds[5], false,
        applicantIds[2].id, 'Congratulations!', 'You have been accepted for the Data Scientist position!', 'Application', applicationIds[5], false,
        
        recruiterIds[0].id, 'New Application Received', 'John Doe has applied for Senior Product Designer position.', 'Application', applicationIds[0], false,
        recruiterIds[0].id, 'New Application Received', 'Sarah Johnson has applied for Senior Product Designer position.', 'Application', applicationIds[3], false,
        recruiterIds[0].id, 'Interview Completed', 'The interview for Data Scientist position with Michael Chen has been completed.', 'Interview', applicationIds[5], true,
        
        recruiterIds[1].id, 'New Application Received', 'John Doe has applied for Full-stack Engineer position.', 'Application', applicationIds[2], false,
        recruiterIds[1].id, 'Interview Completed', 'The technical interview with John Doe has been completed successfully.', 'Interview', applicationIds[2], true
      ]
    )

    console.log('Database seeded successfully')
    console.log('Test accounts:')
    console.log('Applicants:')
    applicantIds.forEach(user => {
      console.log(`  ${user.email} / Applicant123!`)
    })
    console.log('Recruiters:')
    recruiterIds.forEach(user => {
      console.log(`  ${user.email} / Recruiter123!`)
    })
    console.log(`\nSummary:`)
    console.log(`- ${applicantIds.length} applicants created`)
    console.log(`- ${recruiterIds.length} recruiters created`)
    console.log(`- ${jobIds.length} jobs created`)
    console.log(`- ${applications.rows.length} applications created`)
    console.log(`- Documents uploaded for all applicants`)
    console.log(`- Interviews created with various statuses`)
    console.log(`- Notifications sent to all users`)

  } catch (error) {
    console.error('Error seeding database:', error)
    throw error
  }
}