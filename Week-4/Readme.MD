# Student Grades Processor — Optimization & Security

A RESTful API built with Express.js and TypeScript that processes student grades with persistent storage via Supabase (PostgreSQL). This document covers the optimization and security improvements applied to the project after the initial build.

---

## What I Learned

### Optimization Concepts
- **Database indexes** and how they speed up queries
- **The N+1 problem** and why it kills performance
- **Supabase join syntax** for fetching related data in a single query
- **Lightweight existence checks** — only querying what you need
- **SQL best practices** — wildcards, avoiding SELECT DISTINCT, pushing calculations into the database
- **EXPLAIN ANALYZE** for verifying index usage

### Security Concepts
- **Input validation** with Zod — rejecting bad data before it reaches the database
- **Zod schemas** — building reusable validation pieces and composing them per operation
- **JWT authentication** — how tokens work and why they matter
- **Supabase Auth** — built-in authentication flow
- **Auth middleware** — protecting routes by verifying tokens on every request
- **Row Level Security** — enforcing access rules at the database level
- **TypeScript declaration files** — extending Express types to carry user identity

### Architecture Concepts
- **Separation of concerns** — each layer has one job and one job only
- **Layered architecture** — middleware, routes, services, and database as distinct layers
- **Validation belongs in routes** — not in services
- **safeParse vs parse** — handling validation failures gracefully without crashing the server

---

## Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Web framework for building REST APIs |
| TypeScript | Type-safe JavaScript |
| Supabase | Cloud PostgreSQL database |
| PostgreSQL | Relational database |
| Zod | Input validation and schema definition |
| Supabase Auth | JWT-based authentication |
| dotenv | Environment variable management |
| tsx | TypeScript execution for Node.js |

---

## Project Structure

```
src/
    config/
        supabase.ts            # Supabase client initialization
    middleware/
        authMiddleware.ts      # JWT verification — runs before protected routes
    routes/
        authRoutes.ts          # Signup and login endpoints
        studentRoutes.ts       # Student CRUD endpoints
    services/
        studentService.ts      # Business logic and database calls
    types/
        express.d.ts           # Extended Express Request type to carry user
    validators/
        studentValidator.ts    # Zod schemas for all operations
    index.ts                   # Entry point — ties everything together
```

---

## API Endpoints

| Method | Endpoint | Description | Protected |
|---|---|---|---|
| POST | `/auth/signup` | Register a new user | No |
| POST | `/auth/login` | Login and receive JWT token | No |
| GET | `/api/students` | Get all students with grades | Yes |
| GET | `/api/students/:id` | Get a specific student | Yes |
| POST | `/api/students` | Add a new student | Yes |
| POST | `/api/students/:id/grades` | Add a grade to a student | Yes |
| GET | `/api/students/:id/average` | Calculate a student's average | Yes |
| DELETE | `/api/students/:id` | Delete a student | Yes |

---

## Optimization

### 1. Database Indexes

An index is a data structure that allows PostgreSQL to find rows without scanning the entire table. Without an index, every query reads every row — called a sequential scan. With an index on the right column, PostgreSQL jumps directly to matching rows.

The index added in this project targets `student_id` on the grades table, since every grades query filters by this column. Foreign key columns are the highest value candidates for indexing because they are queried on every join.

**When to add an index:**
- Columns frequently used in WHERE clauses
- Foreign key columns used in joins
- Columns frequently sorted with ORDER BY

**The tradeoff:** indexes speed up reads but slow down writes, since PostgreSQL must update every index on insert, update, or delete. Index only the columns queried frequently — not everything.

---

### 2. Fixing the N+1 Problem

The N+1 problem occurs when fetching a list triggers one extra database query per record. The original getAllStudents fetched all students in one query, then looped over every student firing a separate grades query. 100 students meant 101 database calls.

The fix uses Supabase's built-in join syntax. By nesting the child table inside the select, Supabase fetches students and their grades together in a single query. The cost stays at one database call regardless of how many students exist.

**The Supabase join template always follows this pattern:**
- Start from the parent table in the `.from()` call
- Nest the child table inside the select using backtick syntax
- The child table is always the one holding the foreign key

**Before vs After:**

| | Database Calls |
|---|---|
| Before — N+1 | 1 + one per student |
| After — join | 1 always |

---

### 3. Lightweight Existence Checks

When a function only needs to verify a record exists, fetching the entire record is wasteful. The original addStudentGrade called getStudentById just to confirm a student existed — pulling the full student object with all their grades just to answer a yes or no question.

The optimized approach queries only the id column. One column, one row — the cheapest possible query that gives the same answer.

---

### 4. General SQL Best Practices

**Wildcards at the end only.** A wildcard at the start of a LIKE search forces PostgreSQL to scan every row because there is no starting point. A wildcard at the end allows index usage because PostgreSQL knows where to begin.

**Avoid SELECT DISTINCT when possible.** PostgreSQL must fetch all rows, sort them, compare every row against every other, and filter duplicates before returning anything. If duplicates are appearing, fix the query rather than masking the problem with DISTINCT.

**Push calculations into the database.** Aggregations like COUNT, AVG, and SUM are faster in SQL than in JavaScript. The database is built for this work and reduces how much data needs to travel across the wire.

**Group by primary key only.** When using GROUP BY, the primary key alone is sufficient. All other columns in that table are already implied by it — grouping by additional columns is redundant work.

---

## Security

### Layer 1 — Input Validation with Zod

Input validation ensures data meets expectations before any real work begins. Without it, malformed or malicious data flows straight into the database.

**Why validation belongs in the routes layer:** validation is an HTTP concern. The moment a request arrives, bad data should be rejected immediately — before reaching the service or the database. The service should be able to trust whatever arrives.

**The validator file pattern:** build small reusable field definitions first, then compose them into operation-specific schemas. A field appearing in multiple operations — like an id — becomes a reusable piece defined once. If the rule ever changes, it updates everywhere automatically.

**Deciding what is reusable vs operation-specific:** if a field appears in more than one operation, make it a reusable piece. If it only appears once, define it directly in the operation schema.

**Always use safeParse in routes.** safeParse never throws — it returns a result object you can check. Use result.data instead of req.body after validation so only clean, trusted data reaches the service.

**Validation always happens before the try-catch block.** The try-catch handles unexpected failures. A validation failure is not unexpected — it is a deliberate check. It should never be caught by the error handler and treated as a server crash.

**Status codes:**
- Validation failure → 400 Bad Request
- Service or database error → 500 Internal Server Error

---

### Layer 2 — Authentication with Supabase Auth

Authentication answers the question: who is making this request? Without it, anyone who discovers the API endpoints can read or modify any data freely.

Supabase Auth uses JWT — JSON Web Tokens. A JWT is a signed string encoding the user's identity that cannot be tampered with.

**The authentication flow:**
1. User signs up or logs in via the auth endpoints
2. Supabase verifies credentials and returns a JWT token
3. Client sends the token on every subsequent request in the Authorization header as: Bearer followed by the token
4. Auth middleware extracts and verifies the token with Supabase
5. If valid, the user's identity is attached to the request object and the request continues
6. If invalid or missing, the request is rejected with a 401 Unauthorized response

**Auth middleware** runs before every protected route. It extracts the token, verifies it, attaches the user to the request, and calls next() to pass control forward. Any failure stops the request immediately.

**Protecting all routes at once:** a single router.use(authMiddleware) line placed before the route definitions protects every route in that router automatically — no need to add it to each route individually.

**Extending the Express Request type:** TypeScript does not know by default that the Express Request object can carry a user field. A declaration file extending the Request interface tells TypeScript this property is allowed to exist, resolving the type error when attaching user identity to the request.

---


## How a Request Travels Through the App

```
Incoming Request
    ↓
Auth Middleware — is this user authenticated?
    ↓
Route — validate the input with Zod
    ↓
Service — apply business logic, call the database
    ↓
Supabase — RLS checks if this user can access this data
    ↓
Response travels back up the chain
```

---

## Key Learning Moments

### 1. Optimization is about reducing work
Every database call has a cost. The goal is to get the correct result with the fewest calls and the cheapest queries. The N+1 fix alone reduced 101 database calls to 1 for the getAllStudents operation.

### 2. Validation belongs at the boundary
The route layer is where the outside world meets the application. That is the right place to check whether incoming data is acceptable — before any business logic or database interaction begins.

### 3. Authentication and RLS work as a pair
Authentication alone stops unauthorized users at the application level. RLS enforces the same rules at the database level. Together they create defense in depth — two independent layers that must both be bypassed for data to be compromised.

### 4. Separation of concerns makes everything cleaner
Each layer doing one job means changes in one layer do not ripple through the rest. Changing how validation works does not affect the service. Changing the database schema does not affect the routes. The layers are independently maintainable.

---

## Challenges Faced and Solutions

1. **N+1 queries silently degrading performance**
   - *Problem*: getAllStudents was making one database call per student without any obvious error
   - *Solution*: Replaced the nested map with Supabase's built-in join syntax, reducing to a single query

2. **Validation scattered across route handlers**
   - *Problem*: Manual if checks were inconsistent and mixed in with business logic
   - *Solution*: Centralized all validation in a dedicated validator file using Zod schemas

3. **TypeScript rejecting req.user**
   - *Problem*: Express's Request type does not include a user field by default
   - *Solution*: Created a declaration file extending the Request interface to include the Supabase User type

4. **Existence checks triggering full data fetches**
   - *Problem*: Checking if a student existed before adding a grade fetched the entire student record unnecessarily
   - *Solution*: Replaced with a lightweight query selecting only the id column

---

## Future Improvements

- Add pagination to the getAllStudents endpoint
- Add filtering and search by name or subject
- Implement Redis caching for frequently requested data
- Write unit tests for service functions with Jest
- Deploy to Render or Railway
- Build a React frontend that consumes the API
- Supabase RLS.

---

## Database Schema

```
students
    id            UUID — primary key, auto-generated
    name          TEXT — not null
    created_at    TIMESTAMPTZ — defaults to now()

grades
    id            UUID — primary key, auto-generated
    student_id    UUID — foreign key referencing students.id
    subject       TEXT — not null
    score         NUMERIC — between 0 and 100
    created_at    TIMESTAMPTZ — defaults to now()

indexes
    idx_grades_student_id — on grades(student_id)
```

---

**Project built as part of learning: Backend Optimization and Security with Express.js, Supabase, and Zod**