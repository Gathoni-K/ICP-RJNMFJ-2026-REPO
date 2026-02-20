import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

// Load our environment variables
dotenv.config();

// Get the credentials from .env file
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

console.log('🔍 Checking your credentials...');
console.log('URL found:', supabaseUrl ? 'Yes' : 'No');
console.log('Key found:', supabaseKey ? 'Yes' : 'No');

// Stop if credentials are missing
if (!supabaseUrl || !supabaseKey) {
    console.error(' Missing Supabase credentials in .env file');
    process.exit(1);
}

// Create the Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// This is our test function
async function testConnection() {
    console.log('\n Attempting to call Supabase...');
    
    try {
        // Try the simplest possible query - just get 1 student
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .limit(1);
        
        if (error) {
            // This usually means the table doesn't exist
            console.log('Connection worked but got an error from Supabase:');
            console.log('   Error message:', error.message);
            
            if (error.message.includes('relation "students" does not exist')) {
                console.log('\n💡 This actually GOOD NEWS! The connection works,');
                console.log('   but you haven\'t created the "students" table yet.');
                console.log('   Next step: Create your tables in Supabase.');
            }
        } else {
            // Success! We got a response
            console.log('✅ SUCCESS! Connected to Supabase!');
            console.log('   Data received:', data);
        }
        
    } catch (err) {
        // This catches network errors, wrong URLs, etc.
        console.log(' Connection failed completely:');
        console.log('   Error:', error.message);
    }
}

// Run the test
testConnection();