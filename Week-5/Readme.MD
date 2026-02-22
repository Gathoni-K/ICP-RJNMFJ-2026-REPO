# Student Grades Processor — Testing & Deployment

A RESTful API built with Express.js and TypeScript that processes student grades. This document covers the testing strategy and deployment process applied to the project in week 5.

---

## What I Learned

### Testing Concepts
- **Unit testing** — testing one function in isolation without real database calls
- **Mocking** — replacing real dependencies with fake controlled versions
- **The AAA pattern** — Arrange, Act, Assert — the structure every test follows
- **Happy path testing** — testing when everything goes right
- **Edge case testing** — testing when things go wrong, like not found errors or database failures
- **Jest** — the testing framework that runs tests and reports results
- **ts-jest** — the bridge that lets Jest understand and compile TypeScript
- **jest.clearAllMocks()** — resetting mocks before each test so they don't bleed into each other
- **safeParse vs parse** — and why safeParse is the right choice in production code
- **moduleNameMapper** — configuring Jest to handle ESM style `.js` imports in TypeScript

### Deployment Concepts
- **Environment variables on a cloud server** — why `.env` is never pushed to GitHub and how to set variables on Render manually
- **Build commands vs start commands** — the difference between compiling and running
- **Root directory configuration** — telling Render where your project lives inside a monorepo
- **TypeScript strict builds** — why errors ignored locally break deployment and why that is a good thing
- **Typing caught errors** — why TypeScript treats caught errors as unknown and how to handle them
- **Middleware placement** — why router.use() belongs at the top of a router, not inside individual route handlers

---

## Technologies Used

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | Web framework for building REST APIs |
| TypeScript | Type-safe JavaScript |
| Supabase | Cloud PostgreSQL database |
| Zod | Input validation |
| Supabase Auth | JWT-based authentication |
| Jest | Testing framework |
| ts-jest | TypeScript support for Jest |
| Render | Cloud deployment platform |
| dotenv | Environment variable management |

---

## Project Structure

```
src/
    config/
        supabase.ts            # Supabase client initialization
    controllers/
        studentController.ts   # Business logic and database calls
    middleware/
        authMiddleware.ts      # JWT verification middleware
    models/
        types.ts               # Student and Grade types
    routes/
        authRoutes.ts          # Signup and login endpoints
        students.ts            # Student CRUD endpoints
    tests/
        students.test.ts       # Unit tests for all service functions
    types/
        express.d.ts           # Extended Express Request type
    validators/
        studentValidator.ts    # Zod schemas
    index.ts                   # Entry point
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

## Testing

### What is Unit Testing

Unit testing is writing code that checks your code works correctly. Instead of manually hitting the API with Postman after every change, tests do that checking automatically and immediately report if something broke.

The three types of tests:
- **Unit tests** — test one function in isolation, no real database or network calls
- **Integration tests** — test multiple parts working together
- **End to end tests** — test the entire flow from HTTP request to database and back

This project covers unit tests — the foundation of any testing strategy.

---

### What is Mocking

Mocking replaces real dependencies with fake controlled versions. Service functions depend on Supabase to talk to the database. In tests, you don't want real database calls because:

- **Speed** — network calls are slow, mocks are instant
- **Predictability** — a real database can have different data at different times, mocks always return exactly what you tell them to
- **Isolation** — unit tests should test your code only, not Supabase's code
- **Safety** — real database calls during tests could accidentally modify or delete real data
- **Cost** — Supabase has request limits, hammering it with test requests is wasteful

---

### The AAA Pattern

Every test follows the same three step structure:

**Arrange** — set up everything the test needs. Define what the mock should return and prepare the inputs.

**Act** — call the actual function being tested.

**Assert** — check that the result matches what was expected.

---

### Test Structure

Every test file follows this pattern:

- **describe** — groups related tests under one label
- **it** — one individual test case, written as a sentence completing "it should..."
- **beforeEach** — runs before every test to reset mocks so they don't bleed into each other

Every function gets three tests:
- Happy path — everything goes right, function returns expected data
- Not found — database returns PGRST116, function returns null
- Unexpected failure — database returns any other error, function throws

---

### Running Tests

```
npm test
```

To rerun tests automatically on every file save:

```
npm run test:watch
```

---

### Jest Configuration

The jest configuration lives in package.json:

```
preset: ts-jest          — handles TypeScript compilation
testEnvironment: node    — runs in Node not a browser
testMatch: **/*.test.ts  — finds all test files
moduleNameMapper         — strips .js extensions from imports so Jest can resolve them
```

---

## Deployment

### Platform — Render

Render is a cloud platform optimized for traditional server applications like Express APIs. It connects directly to GitHub and deploys automatically on every push.

**Why Render over Vercel:** Vercel is optimized for serverless functions and frontend frameworks like Next.js. Express runs as a continuous server process which Render supports natively. Matching the platform to the architecture is the key decision.

---

### Deployment Configuration

| Setting | Value |
|---|---|
| Platform | Render |
| Runtime | Node.js |
| Build Command | npm install && npm run build |
| Start Command | node dist/index.js |
| Root Directory | Week-5 |

The build command installs dependencies and compiles TypeScript. The start command runs the compiled JavaScript output from the dist folder.

---

### Environment Variables on Render

The `.env` file is never pushed to GitHub for security reasons — Render doesn't have those credentials automatically. Every environment variable must be added manually in Render's dashboard under the Environment section:

- `SUPABASE_URL`
- `SUPABASE_KEY`
- `PORT`

This is the correct way to handle secrets in any cloud deployment. The rule is simple — secrets never live in the repository.

---

### Required package.json Scripts

```
build   — tsc
start   — node dist/index.js
dev     — tsx src/index.ts
test    — jest
```

### Required tsconfig.json Setting

```
outDir: ./dist
```

Without these two things the build fails on Render — it won't know how to compile or where to find the compiled output.

---

## Key Learning Moments

### 1. TypeScript errors ignored locally break deployment
Render runs the TypeScript compiler strictly during the build. Errors that TypeScript flags but that don't stop local development will fail the build on Render. This forces you to write properly typed code and is a feature, not a bug.

### 2. Caught errors are typed as unknown
TypeScript treats caught errors in catch blocks as `unknown` — it doesn't assume they're Error objects. The fix is casting explicitly with `const err = error as Error` before accessing `.message`. This is safer because not everything thrown in JavaScript is an Error object.

### 3. Middleware placement matters
Placing `router.use(authMiddleware)` inside individual route handlers does nothing — middleware registered inside a handler runs after the handler has already started. It must be placed before all route definitions at the router level to actually intercept requests.

### 4. Monorepo root directory
When a repository contains multiple projects in subfolders, deployment platforms look at the root by default. Setting the Root Directory on Render to the specific subfolder tells it exactly where to find the project.

### 5. Mocking mirrors the function
The mock chain must mirror the Supabase chain in the actual function. If the function calls `.from().select().eq().single()`, the mock must chain those same methods in the same order. Understanding what the function actually does is what makes writing mocks possible.

---

## Challenges Faced and Solutions

1. **Build failed — package.json not found**
   - *Problem*: Render looked at the repo root but the project lived in a Week-5 subfolder
   - *Solution*: Set the Root Directory field in Render settings to Week-5

2. **TypeScript errors failing the build**
   - *Problem*: Caught errors typed as unknown, req.user not recognized on Request type
   - *Solution*: Cast caught errors as Error, created express.d.ts declaration file extending the Request interface

3. **Jest couldn't resolve .js imports**
   - *Problem*: TypeScript ESM style imports using .js extensions confused Jest's module resolver
   - *Solution*: Added moduleNameMapper to jest config to strip .js extensions at test time

4. **authMiddleware placed inside route handlers**
   - *Problem*: router.use(authMiddleware) inside each handler did nothing — middleware must be registered before routes
   - *Solution*: Moved router.use(authMiddleware) to the top of the router, above all route definitions

---

## Future Improvements

- Add integration tests that test routes and services together
- Add end to end tests using Supertest
- Set up CI/CD pipeline so tests run automatically before every deploy
- Add pagination to the getAllStudents endpoint
- Deploy a React frontend to Vercel consuming this API

---

## Getting Started

### Prerequisites
- Node.js v16 or higher
- npm
- Supabase account — free tier is sufficient
- Render account — free tier is sufficient

### Local Setup

1. Clone the repository and navigate into the Week-5 folder
2. Run npm install to install dependencies
3. Create a .env file with SUPABASE_URL, SUPABASE_KEY, and PORT
4. Run npm run dev to start the development server
5. Run npm test to run the test suite

### Deployed URL

The API is live at your Render URL. All protected endpoints require a Bearer token in the Authorization header obtained from the login endpoint.

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

**Project built as part of learning: Testing and Deployment with Jest, ts-jest, and Render**