#  Grade Processor Pro

A professional full-stack academic management system designed for educators. This application streamlines student enrollment, subject-specific grading, and real-time performance analytics through a clean, feature-based architecture.

---

##  Key Features

### 1. Secure Educator Authentication
* **Dual-Flow Auth:** Dedicated Login and Signup interfaces for educator onboarding.
* **Native Form Validation:** Optimized performance using HTML5 and standard React state management, bypassing the need for heavy frontend validation libraries like Zod.
* **Persistent Sessions:** Secure JWT-based authentication with automatic token storage and retrieval.

### 2. Student Registry & Management
* **Enrollment Interface:** Add new students to the institutional database with immediate UI feedback.
* **Student Offboarding:** Secure deletion of student records with cascading cleanup of associated grades.
* **Registry Overview:** A real-time list of current enrollments with unique ID references.

### 3. Dynamic Grade Assignment
* **Targeted Grading:** A specialized workflow allowing educators to select specific students and assign scores to various subjects.
* **Constraint Enforcement:** Intelligent input handling ensuring scores remain within the valid 0-100 range.
* **Automated Updates:** Real-time data refreshing ensures the dashboard reflects new grades immediately upon submission.

### 4. Performance Analytics Dashboard
* **On-the-fly Calculations:** Dynamic GPA and average score generation using nested student data.
* **Insight Cards:** At-a-glance summaries showing subject counts and performance trends for every student in the registry.

---

##  Security Implementation

###  Authentication & Authorization
* **JWT Protection:** All sensitive API routes are guarded by backend middleware requiring a valid JSON Web Token.
* **Secure Headers:** A centralized API utility (`lib/api.ts`) automatically injects `Authorization: Bearer <token>` into outgoing requests.
* **Route Guarding:** Frontend navigation guards prevent unauthenticated users from accessing the Dashboard or Management pages.

###  Data Integrity
* **Backend Zod Validation:** While the frontend stays light, the backend employs strict Zod schemas to validate all incoming payloads (Student names, Subject strings, and Numeric scores).
* **Type Safety:** Shared TypeScript interfaces ensure that data structures remain consistent between the Express server and React client.

###  Storage Safety
* **Stateless Sessions:** No sensitive user data is stored in the database without proper hashing (Backend implementation).
* **Token Lifecycle:** Simple logout logic ensures tokens are cleared from the browser's local storage to end sessions securely.

--- 
## Technical Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, TypeScript, Tailwind CSS, Lucide React, React Router Dom |
| **Backend** | Node.js, Express, Zod, JWT |
| **Architecture** | Feature-Based (Bulletproof React Style) |
| **API Client** | Native Fetch Wrapper (`lib/api.ts`) |

---

## API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **POST** | `/auth/signup` | Create a new educator account |
| **POST** | `/auth/login` | Authenticate and receive session token |
| **GET** | `/students` | Retrieve all students with nested grades |
| **POST** | `/students` | Register a new student |
| **POST** | `/students/:id/grades` | Assign a subject score to a student |
| **DELETE** | `/students/:id` | Remove a student record permanently |