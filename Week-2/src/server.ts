import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
//reads our .env file and makes the variables avaialable.
//Must be called before we try to use any env variables

const app = express();
//creates our express applocation instance, the app object allows us to set routes, middleware etc.

const port = process.env.PORT || 3000;

//our middleware, which is basically everything that runs on every request.
//middleware = functions running before our route handlers.

app.use(cors());
//enables CORS for all routes.

app.use(express.json());
//parses incoming json data

//setting up our routes - the URLs our API responds to.
app.get('/', (req, res) => {
    res.json({ message: 'Grade Processor API' });
});

//starts the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});