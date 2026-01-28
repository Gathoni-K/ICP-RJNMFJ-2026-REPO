# Student Grade Processor API

A RESTful API built with Node.js, Express, and TypeScript for managing students and their grades. This backend application allows you to create students, add grades, calculate averages, and retrieve student data through HTTP endpoints.

---

## Features

- Create and manage students
- Add multiple grades per student (subject and score)
- Calculate average grade for each student
- Retrieve all students or individual student data
- RESTful API endpoints for all operations
- In-memory data storage
- Full TypeScript support

---

## Technologies Used

- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **TypeScript** - Type-safe JavaScript
- **ES Modules** - Modern JavaScript module system
- **CORS** - Cross-Origin Resource Sharing enabled
- **dotenv** - Environment variable management

---

## Project Structure
```
Week-2/
├── src/
│   ├── models/
│   │   └── types.ts          # TypeScript interfaces (Student, Grade)
│   ├── controllers/
│   │   └── studentController.ts  # Business logic functions
│   ├── routes/
│   │   └── students.ts       # API route definitions
│   └── server.ts             # Main server file
├── .env                      # Environment variables
├── package.json
└── tsconfig.json
```

---

## Setup & Installation

### Prerequisites
- Node.js (v18 or higher)
- npm

### Installation Steps

1. Clone or download this repository

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
PORT=3000
NODE_ENV=development
```

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:3000`

---

## API Endpoints

### Base URL
```
http://localhost:3000/api/students
```

### Endpoints

#### 1. Create a Student
**POST** `/api/students`

**Request Body:**
```json
{
  "name": "Alice Johnson"
}
```

**Response:**
```json
{
  "id": "uuid-here",
  "name": "Alice Johnson",
  "grades": []
}
```

---

#### 2. Get All Students
**GET** `/api/students`

**Response:**
```json
[
  {
    "id": "uuid-here",
    "name": "Alice Johnson",
    "grades": [...]
  }
]
```

---

#### 3. Get Student by ID
**GET** `/api/students/:id`

**Response:**
```json
{
  "id": "uuid-here",
  "name": "Alice Johnson",
  "grades": [...]
}
```

---

#### 4. Add Grade to Student
**POST** `/api/students/:id/grades`

**Request Body:**
```json
{
  "subject": "Math",
  "score": 85
}
```

**Response:**
```json
{
  "id": "uuid-here",
  "name": "Alice Johnson",
  "grades": [
    {
      "id": "grade-uuid",
      "subject": "Math",
      "score": 85
    }
  ]
}
```

---

#### 5. Calculate Student Average
**GET** `/api/students/:id/average`

**Response:**
```json
{
  "average": 85.5
}
```

---

## Testing the API

### Using Thunder Client (VS Code Extension)

1. Install Thunder Client extension in VS Code
2. Click the lightning bolt icon in the sidebar
3. Create a new request
4. Set the method (GET, POST, etc.)
5. Enter the endpoint URL
6. Add request body for POST requests (in JSON format)
7. Click Send

### Example Test Flow

1. **Create a student:**
   - POST `http://localhost:3000/api/students`
   - Body: `{"name": "Tasha Wambui"}`

2. **Add grades:**
   - POST `http://localhost:3000/api/students/{student-id}/grades`
   - Body: `{"subject": "Math", "score": 85}`
   - Repeat for other subjects

3. **Get average:**
   - GET `http://localhost:3000/api/students/{student-id}/average`

---

## Available Scripts
```bash
npm run dev      # Start development server with auto-reload
npm run build    # Compile TypeScript to JavaScript
npm start        # Run compiled production build
```

---

## Data Models

### Student Interface
```typescript
interface Student {
  id: string;
  name: string;
  grades: Grade[];
}
```

### Grade Interface
```typescript
interface Grade {
  id: string;
  subject: string;
  score: number;
}
```

---

## Notes

- Data is stored in-memory and will reset when the server restarts
- No database is currently connected
- CORS is enabled for all origins (development only)
- This is a learning project for backend development fundamentals

---

## Future Enhancements

- Add database integration (MongoDB/PostgreSQL)
- Implement student deletion
- Add grade update/delete functionality
- Input validation and error handling
- Letter grade assignment (A, B, C, etc.)
- Authentication and authorization
- Unit tests

---

## Author

Built as part of a web development internship - Week 2 project

---

