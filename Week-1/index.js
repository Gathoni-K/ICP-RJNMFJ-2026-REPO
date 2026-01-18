const express = require('express');
//the above line imports the framework.

const app = express();
//creating an application instance

//defining a route (HTTP method + path + handler)
app.get('/', (req,res) =>  {
    res.send("Hello World");
});
/*
get - HTTP method, retrieves/reads data
'/' - the route.
(req, res) => - a callback function with 2 parameters:
    req - request, info about what the user wants
    res - response, how the data is sent back to them
res.send() - actually sending our response

*/


//starting the server, binding to port 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});