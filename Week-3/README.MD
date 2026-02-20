# Week 3 Task.

# Grade Processor API

A RESTful API built with Express.js and TypeScript that processes student grades, featuring persistent storage with Supabase (PostgreSQL). This project demonstrates the migration from in-memory storage to a cloud database.

## What I Learned

### Core Concepts
- **Building RESTful APIs** with Express.js
- **TypeScript** for type-safe JavaScript development
- **Database integration** (migrating from in-memory to cloud database)
- **Async/await** pattern for handling asynchronous operations
- **Environment variables** for secure configuration
- **Error handling** in asynchronous code

### Database Skills
- **PostgreSQL** basics (tables, relationships, queries)
- **Supabase** as a Database-as-a-Service platform
- **SQL** for creating tables and inserting data
- **One-to-many relationships** (students → grades)
- **Foreign keys** and referential integrity
- **Cascading deletes** (removing grades when a student is deleted)

### API Development
- **CRUD operations** (Create, Read, Update, Delete)
- **HTTP methods** (GET, POST, DELETE)
- **Route parameters** for dynamic endpoints
- **Request body parsing** for JSON data
- **Proper status codes** (200, 201, 404, 500)
- **Input validation** and error handling

## 🛠 Technologies Used

| Technology | Purpose |
|------------|---------|
| **Node.js** | JavaScript runtime environment |
| **Express.js** | Web framework for building REST APIs |
| **TypeScript** | Typed JavaScript superset |
| **Supabase** | Cloud database (PostgreSQL) |
| **PostgreSQL** | Relational database |
| **dotenv** | Environment variable management |
| **cors** | Cross-Origin Resource Sharing middleware |
| **tsx** | TypeScript execution for Node.js |

##  Project Structure

```
week-3/
├── src/
│   ├── config/
│   │   └── supabase.ts        # Supabase client configuration
│   ├── controllers/
│   │   └── studentController.ts # Business logic and database operations
│   ├── models/
│   │   └── types.ts           # TypeScript interfaces
│   ├── routes/
│   │   └── students.ts        # API route definitions
│   └── server.ts               # Main application entry point
├── sql/
│   ├── 01_create_tables.sql    # Database schema
│   ├── 02_mock_data.sql        # Sample data for testing
│   └── README.md               # SQL files documentation
├── .env                         # Environment variables (not in repo)
├── .gitignore                   # Git ignore rules
├── package.json                 # Project dependencies
├── tsconfig.json                # TypeScript configuration
└── README.md                    # Project documentation
```

##  API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | API welcome message |
| GET | `/api/students` | Get all students with their grades |
| GET | `/api/students/:id` | Get a specific student by ID |
| POST | `/api/students` | Add a new student |
| POST | `/api/students/:id/grades` | Add a grade to a student |
| GET | `/api/students/:id/average` | Calculate a student's average grade |
| DELETE | `/api/students/:id` | Delete a student and their grades |

##  Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Supabase account (free tier)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd week-3
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   SUPABASE_URL=your_supabase_project_url
   SUPABASE_ANON_KEY=your_supabase_anon_key
   PORT=3000
   ```

4. **Set up the database**
   - Create a Supabase project at [app.supabase.com](https://app.supabase.com)
   - Run the SQL in `sql/01_create_tables.sql` to create tables
   - (Optional) Run `sql/02_mock_data.sql` to add sample data

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Test the API**
   Open your browser and visit: `http://localhost:3000/api/students`

##  API Usage Examples

### Get all students
```bash
GET http://localhost:3000/api/students
```

### Add a new student
```bash
POST http://localhost:3000/api/students
Content-Type: application/json

{
  "name": "John Doe"
}
```

### Add a grade
```bash
POST http://localhost:3000/api/students/student-id-here/grades
Content-Type: application/json

{
  "subject": "Mathematics",
  "score": 85
}
```

### Get student average
```bash
GET http://localhost:3000/api/students/student-id-here/average
```

### Delete a student
```bash
DELETE http://localhost:3000/api/students/student-id-here
```

##  Key Learning Moments

### 1. **From In-Memory to Database**
   - **Before**: Data lived in a JavaScript array and disappeared on server restart
   - **After**: Data persists in Supabase cloud database
   - **Lesson**: Databases provide persistent, scalable storage

### 2. **Async/Await Revelation**
   - **Before**: Synchronous code that assumed instant data access
   - **After**: Asynchronous code that waits for database responses
   - **Lesson**: Database operations take time and need proper handling

### 3. **Error Handling Importance**
   - **Before**: Minimal error checking
   - **After**: Comprehensive try/catch blocks and error responses
   - **Lesson**: Always expect and handle failures gracefully

### 4. **Data Relationships**
   - **Before**: All data nested in a single array
   - **After**: Properly normalized tables with foreign keys
   - **Lesson**: Relational databases prevent data redundancy

## Testing the API

You can test the API using:
- **Browser** - for GET requests
- **Postman** - for all HTTP methods
- **Thunder Client** (VS Code extension)
- **cURL** - command line tool

##  Database Schema

```sql
students {
  id          UUID (PK)
  name        TEXT
  created_at  TIMESTAMP
}

grades {
  id          UUID (PK)
  student_id  UUID (FK → students.id)
  subject     TEXT
  score       NUMERIC
  created_at  TIMESTAMP
}
```

##  Challenges Faced & Solutions

1. **Missing tables error**
   - *Problem*: API couldn't find database tables
   - *Solution*: Created tables by running SQL in Supabase dashboard

2. **Environment variable mismatch**
   - *Problem*: Code looked for `SUPABASE_ANON_KEY` but .env had `SUPABASE_KEY`
   - *Solution*: Standardized variable names or updated code to match

3. **Async route handlers**
   - *Problem*: Routes weren't awaiting promises
   - *Solution*: Added async/await and try/catch blocks to routes

##  Future Improvements

- Add authentication with Supabase Auth
- Create a React frontend
- Add input validation with Zod
- Implement pagination for students list
- Add filtering and search capabilities
- Write unit tests with Jest
- Deploy to Render or Railway

##  License

This project is created for learning purposes.

---

**Project completed as part of learning: Database Integration with Express.js and Supabase**