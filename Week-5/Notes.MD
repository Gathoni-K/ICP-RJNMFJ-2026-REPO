# Week 5 task.

-Testing and Deployment

## 1.Testing.

-This is writing code that checks whether our code runs correctly.

-Allows one to consider the exact requirements pf code and how the interfaces will be used if written before the actual code.

-Handled using Jest, a library used for testing.

-Set up:

    npm install --save-dev jest ts-jest @types/jest

-Configure in package.json like so:
   
   "jest": {
    "preset": "ts-jest",
    "testEnvironment": "node",
    "testMatch": ["**/*.test.ts"],
    "moduleNameMapper": {
        "(.+)\\.js": "$1"
    }
    },

-In our ''scripts', add the following lines:

    "scripts": {
    "test": "jest",
    "test:watch": "jest --watch"
    }

-Tells jest to use test-js to handle ts files, runs tests in a Node environment, looks for files ending in '.test.ts' as test files.


-Steps for writing tests:

1.Write tests for new feature.
-At this stage, the tests fail as code is yet to be implemented.

2.Writing bare minimum code required to pass the tests.

3.Refactoring code, ensure optimization.

**Types of Tests.**

1.Unit tests - tests one function in isolation.

2.Integration tests - tests multiple parts working together, e.g. does the route correctly call the service that correctly calls the database.

3.End to end test - tests the entire flow from HHTP requests to database responses and back, exactly like how a real user would experience it.

### Mocking.

-Is replacing real dependencies with fake ones that can be controlled.

-Is more like what a flight simulator is to a pilot.

Things controlled with a mock:

1.return value - when this function is called, return this specific data.

    pretend Supabase returned{ data: { id: '123', name: 'Jill' }, error: null}

2.error simulation - when the function is called, return this error.

    pretend Supabase returned { data: null, error: { code: 'PGRST116' } }

3.call verification - checks the right arguments.

    verify that .from('students') was called with the correct table name

-How jest mocking works:

-Jest has a built-in function called 'jest.mock()'.

-When jest is told to mock a module, it intercepts every import of that module in our test file and replaces it with a fake version.

-Use 'jest.fn()' to define what the fake returns.

-Tests follow the same pattern:

Arrange - set up everything the test needs, mock dependencies, define what the fake should return and prepare the inputs.

Act - call the actual function with the inputs.

Assert - check that the result is as expected.




