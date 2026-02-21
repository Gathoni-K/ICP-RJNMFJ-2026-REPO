# Notes on Week 4 Task.

-Task is on improving performance and security.


## Optimization.

### 1.PostgreSQL Indexes.

-Is a data structure made to ensure that searches are effective.

-Basic syntax is:

    CREATE INDEX index_name ON table_name (column_name);

-The query is written as normal.

-When should on create an index?

1.when one filters or searches frequently by that column.

2.there are frequent joins on that column.

3.there are frequent sorts by that column.

-Foreign key columns are almost always worth indexing as one joins on them constantly.

-Indexes have a cost, every time an insertion, update or deletion is done on a row, postgreSQL has to update every index on that table.

    too few indexes - slow reads
    too many indexes - slow writes

- Use explain analyze before query to see if PostgreSQL is actually using the index.

-Types of indexes include: 
1.B-tree
2.GIN - for searching inside arrays or tests, used for full text search.

### 2.DB Query Optimization.

-The practice of making db queries as efficient as possible, they return the correct results while doing the least amount of work possible.

-Areas typically covered:

1.Only selecting the needed columns.

2.Avoiding redundant queries.

3.Using the appropriate Supabase methods so that they do the heavy-lifting and not our js code.

4.Use LIMIT to preview query results.

5.Avoid SELECT DISTINCT if possible.

-Is a command used to remove duplicate rows from results.

-Only use when one needs unique values from a column and there is NO BETTER way to express it.

-The cost is mainly seen on large datasets.

6.Use wildcards only at the end of a phrase.
-Wildcards are special characters used in search queries to represent unknown or variable characters.

-Our character is '%' and is used with the LIKE operator.

    SELECT * FROM students WHERE name LIKE 'Jo%';
    //select names starting with 'Jo'

    SELECT *
    FROM students;
    //we can optimize the query above like so:

    SELECT name
    //selecting only the column we need
    FROM students
    LIMIT 10;
    //get a preview of the query results.

-The supabase join template is:

    const { data, error } = await supabase
    .from('parent_table')
    .select(`
    *,
    child_table (*)
    `)
    //other methods of parent table go here

    //remember that the child table is always the one holding the foreign key



## Security.

### 1.Input validation.

-Looking at our functions, inputs needing validation include:
    1.addStudent - name cannot be empty, too long or contain invalid characters.
    2.addStudentGrade - id cannot be an invalid UUID, subject cannot be empty or too long, score should be valid.
    3.getStudentById - id cannot be an invalid UUID format

-This is handled in the routes as routes handle HTTP concerns, requests, responses etc.

-Use of a validation library, choice is Zod, will let us define a schema and validate it against it in one line.

-Install it using the command:

    npm install zod

-Import and use it in the code like so:

    import { z } from 'zod';

-Create a new folder under 'src' called 'validators'

-The general sytax for a schema would be:

    const exampleSchema = z.object({
        name: z.string().min(1).max(100),
        age: z.number().min(0).max(120)
    });

-The complete file would look something like:

    import { z } from 'zod';

    const fieldName = z.object({ field: z.type().rules() });
    //defining reusable pieces here
    //if a field appears in more than one operation then it is a reusable piece

    export const createSchema = fieldOne.merge(fieldTwo);
    export const getSchema = fieldOne;

-Rules that can be chained for:

    1.numbers:
    z.number().min(0).max(100)    // between 0 and 100
    z.number().int()               // must be a whole number
    z.number().positive()          // must be greater than 0

    2.strings:
    z.string().min(1).max(100)    // length between 1 and 100
    z.string().uuid()              // must be a valid UUID
    z.string().email()             // must be a valid email
    z.string().optional()          // not required

    3.others:
    z.boolean()                    // true or false
    z.date()                       // valid date
    z.array(z.string())            // array of strings


### 2.Authentication.

-Answers the question 'Who is making this request?'

**How Supabase authentication works**
-Supabase auth is built on JWT tokens whose flow is like so:

    User signs up / logs in
        ↓
    Supabase verifies credentials
        ↓
    Supabase returns a JWT token to the client
        ↓
    Client sends that token with every request
        ↓
    Your API verifies the token
        ↓
    You know who the user is

-What do we need?

1.Auth routes - sign up and login endpoints

2.Auth middleware - a function running before protected routes to check the token then either accepts or rejects the request.

3.Protect existing routes - plugg middleware into student routes.








