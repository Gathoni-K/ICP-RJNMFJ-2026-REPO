# Notes on our app.

## Building a Student's Grade Processor.

-Set up the project with commands discussed earlier.

2.Create tsconfig.json using:

    npx tsc --init

-Edit the file as discussed earlier.
-It should look something like:

    {
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "moduleResolution": "NodeNext",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noUncheckedIndexedAccess": true,
    "sourceMap": true,
    "declaration": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
    }

3.In package.json, update the section under scripts to look like this:

     "scripts": {
    "dev": "tsx watch src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
    },

4.Start creating the project.

5. Setting up our .gitignore file.

-Use the command: 

    touch .gitignore
    //creates our files

-In the file, paste the following:

    node_modules/
    dist/
    .env
    *.log
    .DS_Store

-The file tells Git what not to upload to GitHub.

-Such files are:

    1.dist/ - contains compiled JS files.
    -Is generated everytime 'npm run build' is ran.

    2. .env - contains secret information like API ekys, database passwords etc.

    3. *.log - log files that are generated during development.


## server.ts

-Is the entry point, the main file that sets up our Express application, configures middleware, connects all the routes and starts the server listening for requests.

-Is like the control center of our backend.

    import express from 'express'
    //import our Express framewrok, which lets us create a web server, handle routes etc.

    import cors from 'cors'
    //enables communication between frontend and backend.
    //cors stands for: Cross-Origin Resource Sharing

    import dotenv from 'dotenv'
    //loads variables from our '.env' file.

-What goes in this file?

1.Express setup.

2.Middleware configuration.

3.Importing and connecting routes.

4.Starting the server.

5.Global error handling.(if applicable)

-The default server.ts structure would be:

    import express from 'express';
    import cors from 'cors';
    import dotenv from 'dotenv';

    dotenv.config();

    const app = express();
    const port = process.env.PORT || 3000;

    app.use(cors());
    app.use(express.json());

    // Routes go here

    app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
    });

-Sometimes additional middleware may be needed:

    // If you need file uploads:
    import multer from 'multer';

    // If you need authentication:
    import authMiddleware from './middleware/auth.js';

    // If you need rate limiting:
    import rateLimit from 'express-rate-limit';

## rest of the app.

**1.Setting up our types.**

-Is created under models folder, define the types for the student and grade.

**2.Creating the controller**

-Is where business logic lives.

-Is done in the controllers folder.

-Is where we will add students, calculate averages etc.

-It will need to:

    1.store students.
    2.add a new student.
    3.get all students.
    4.get a specific student.
    5.add a grade to a student.
    6.calculate a student's average.
    7.delete a student.

1. add a student.

-The function is to take a name as input and create a new student object with a unique ID, name and an empty grades array, adds the student to the students array and returns the new student

2.get all students.

-Function is basically for fetching all the students data.

-Use the find method to parse through the array and compare the ids.

    students.find((student) => student.it === id);

    array.find((item) => condition)
    //loops through each item in the array.
    //tests the condition for each item and return the first item where the condition is true, and will return undefined if nothing matches.

    //Similar array methods include:
    .filter() - returns all matches.
    .map() - transforms each item.
    .some() - returns true if any match.
    .every() - returns true if all match.

3.adding a grade to a student.

-The function needs to find a student, create a grade and add a grade to the student's grades array.

4.calculating the average.

-The function needs to add up all the scores of the student then divide by the number of the subjects.

-The input is the student's ID and the output will be a number.

.reduce() - method that takes an array and reduces it down to a single value by doing something with each item.

    array.reduce((accumulator, currentItem) => {
        //do somethind
        return newAccumulator;
    }, startingValue);

    //accumulator - the running total as we loop through our array, gets updated each loop and is returned at the end.
    //currentItem - each item in the array as we loop through it.
    //startingValue - what the accumulator starts as, usually 0.


**HTTP methods**

1.GET

-Reads data.

-Fetches information.

-Does not change anything on the server.

-Use when: to retrieve data and one expects no side effects.

2.POST.

-Creates a new resources.

-Creates a non-idempotent process, i.e. will produce a different outcome when the request is received more than once.

-Use when one is adding something new, the operation has side effects and when the server decides the new resource's ID.

3.PUT.

-Completely replaces a resource.

-Use when one is updating every field, we know the resource identifier, we want predictable results.

-Is idempotent, calling it multiple times produces the same result.

4.PATCH.

-Partially updates a resource.

-Use when one is changing only specific fields and when we do not want to resend everything.

5.DELETE.

-deletes a resource.


-A method is safe if it does not modify data.



**Setting up routes.**

-The generic template would be:

    import express from 'express';
    import {myFunctions} from "/pathToFunctions";

    const router = express.Router();

    //routes here

    export default router;

-The three ways to get data:

1.req.params - from URL path

-Used when we want to do something to a specific item.

    router.get('/:id', (req, res) => {
        const id = req.params.id;
    })

2.req.body - from request body(JSON)

-Used when creating new data or updating existing data with information.

-Whenever we are creating or updating something, we will need data from the body.

-Methods include: POST, PUT, PATCH (never GET or DELETE)

-"Here's the information provided"

    router.post('/', (req, res) => {
        const { name } = req.body;
    })

3.req.query - from URL query string

-Used to filter, search, sort or paginate results.

-"Show items matching this criteria"

    router.get('/', (req, res) => {
        const grade = req.query.grade;
        const subject = req.query.subject;
    })

**Common patterns for each operation.**

1.GET all - no input

    router.get('/', (req, res) => {
        const items = getAllItems();
        res.json(items);
    });

2.GET one - ID from URL

    router.get('/:id', (req, res) => {
        const item = getItemById(req.params.id);

        if(!item) {
            return res.status(404).json({error: "Not found" });
        }
        res.json(item);
    })

3.POST create - data from body

    router.post('/', (req, res) => {
        const { name, email } = req.body;
        const newItem = createItem(name, email);
        res.status(201).json(newItem);
    })

4.PUT/PATCH update - id from url, data from body.

    router.put('/:id', (req, res) => {
        const id = req.params.id;
        const { name } = req.body;
        const updated = updateItem(id, name);

        if(!updated) {
            return res.status(404).json({error: "Not found" });
        }

        res.json(updated);
    });

5.DELETE - id from URL

    router.delete('/:id', (req, res) => {
        const deleted = deleteItem(req.params.id);

        if(!deleted) {
            return res.status(404).json({error: "Not found" });
        }

        res.json({message: "Deleted successfully" });
    });


**3.Connecting the Routes to server.ts**

-In server.ts:

1.Import the routes.

    import studentRoutes from '/pathToRoutes';

2.Connect the routes.

-After the middleware

    app.use(cors())
        and 
    app.use(express.json())

BUT before:

    app.listen()

add:

    app.use('api/students', studentRoutes);

-This ensures that any request sent to 'api/students/...' will be handled by studentRoutes where 'api/students' is the base path.
