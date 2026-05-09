# Rural Healthcare Management System (RHMS)

A full-stack, professional healthcare management system designed for rural medical centers. Features include role-based access, patient management, real-time analytics, and automated billing.

## Tech Stack

- **Frontend**: React.js, Tailwind CSS, Recharts, Lucide Icons
- **Backend**: Spring Boot (Java 17), Spring Security, JWT, JPA
- **Database**: MySQL
- **Design**: Modern Medical UI with Glassmorphism and Responsive Layout

## Key Features

1. **Secure Authentication**: JWT-based login for Admin, Doctors, and Receptionists.
2. **Patient Management**: Complete CRUD operations for patient records.
3. **Analytics Dashboard**: Real-time stats on revenue, village-wise distribution, and disease analysis.
4. **Automated Billing**: Automatic calculation of total costs (Medicine + Consultation).
5. **Role-Based Access**: 
   - **Admin**: Full access.
   - **Doctor**: Update records, view analytics.
   - **Receptionist**: Register patients, handle billing.

## Project Structure

```text
/
├── backend/            # Spring Boot Application
├── frontend/           # React + Vite Application
└── database/           # SQL Schema and Sample Data
```

## Setup Instructions

### 1. Database Setup
1. Install MySQL Server.
2. Run the scripts provided in `database/init.sql` to create the database and sample data.
3. Update `backend/src/main/resources/application.properties` with your MySQL credentials.

### 2. Backend Setup
1. Navigate to the `backend` directory.
2. Build the project: `mvn clean install`
3. Run the application: `mvn spring-boot:run`
4. The API will be available at `http://localhost:8080`.
5. Swagger UI: `http://localhost:8080/swagger-ui.html`

### 3. Frontend Setup
1. Navigate to the `frontend` directory.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`
4. The application will be available at `http://localhost:5173`.

## Admin Credentials
- **Username**: admin
- **Password**: password123

## UI Highlights
- **Modern Palette**: Medical-inspired blue/slate color system.
- **Glassmorphism**: Subtle transparent effects for cards and navbars.
- **Micro-animations**: Smooth transitions using Framer Motion.
- **Responsive**: Fully functional on mobile, tablet, and desktop.

