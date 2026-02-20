# CONNECTING A DATABASE TO STUDENT GRADES PROCESSOR.

-Initial setup:

    npm install @supabase/supabase-js

-In Supabase.com, after creating the project, add the anon key and the url to our .env file as shown:

    SUPABASE_URL=urlHere
    SUPABASE_KEY=anonKeyHere

-It is worth noting that one can choose between the anon and the service_role key,the latter typically used for server-side admin tasks and bypasses RLS entirely.

-After that is done, create the config folder under src where we will have the 'supabase.ts' file.

-The file will look like so:

    import { createClient } from '"supabase/supabase-js';
    import dotenv from 'dotenv';

    dotenv.config();

    const supabaseUrl = process.env.SUPABASE_URL;
    const supabaseKey = process.env.SUPABASE_KEY;

    if(!supabaseUrl || !supabaseKey){
        throw new Error("Missing supabase credentials.");
    }

    export const supabase = createClient(supabaseUrl, supabaseKey);

## 2.Creating tables.

-It is important to note that, in as much as we have our sql code in vs code, we still need to copy-paste the same code to our SQL editor on Supabase, remember that ours is a cloud database.

-All SQL queries written in VS Code must also be in our SQL editor over at Supabase.

So far the flow has been:

    Tables => Types => Business logic

## 3.Setting up our Business Logic.

-Import our types and supabase client as shown below:

    import { supabase } from '/pathToSupabase.ts'
    import type { typeNamesHere } from 'pathToTypes'

-The general pattern each function follows:

    export const functionName = async (param1: type, param2: type): Promise<ReturnType> => {
        const { data, error } = await supabase
        .from('table_name')
        .someOperation()

        if(error) {
            throw new Error(`Descriptive message: ${error.message}`);
        }

        return data;
    };

**Operations that can be performed.**

    .insert() - adds new rows
    .select() - fetch rows
    .update() - modifies exisiting rows
    .delete() - removes rows

    //our basic CRUD operations.

    //modifiers chaining onto our CRUD operations include:

    .eq('column', value) - where column = value
    .neq('column', value) - where column != value
    .gt('column', value) - where column > value
    .lt('column', value) - where column < value
    .order('column', {ascending: true/false})
    .limit(numberHere) - only returns the number of specified rows
    .single() -  unwrap single result from array

    e.g:
    supabase.from('students').select('*').eq('id', 1).single()
    // "from students, select everything, where id equals 1, give me one object"

**Joining Tables**

-This can be seen in our getAllStudents function.

-Whenever data has a relationship, and data is needed from both sides of the relationship in one response, tables need to be joined, e.g. the table for student names and grades.

-Common scenarios:
1.Posts and their comments.
2.Orders and their items.
3.Users and their profiles.
4.Students and their grades.

-Template for joining tables:


    const { data, error } = await supabase
    .from('parent_table')
    .select(`
    *,
    child_table(*)
    `)

    //whatever holds the foreign key is the child table.

    const { data, error } = await supabase
    .from('students')
    .select(
        `
        *,
        grades (*)
        `
    )


##  4.Setting up our routes.

    router.METHOD('/path', async (req, res) => {
    try {
        // 1. Extract data from request
        const { id } = req.params;        // from URL e.g. /students/:id
        const { name } = req.body;        // from request body
        const { page } = req.query;       // from query string e.g. ?page=1

        // 2. Call your service function
        const result = await serviceFunction(id);

        // 3. Handle not found if needed
        if (!result) {
            return res.status(404).json({ message: 'Resource not found' });
        }

        // 4. Send back success response
        res.status(200).json(result);

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
    });
