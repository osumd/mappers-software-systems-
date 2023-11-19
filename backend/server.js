const express = require("express");
const formidable = require("formidable")
const cors = require("cors");

const dbo = require("./dbo");

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());

app.use(require("./models/user"));
app.use(require("./models/data"));

app.listen(port, () => {
    // perform a database connection when server starts
    // the IP this runs from must be whitelisted with the MongoDB database server
    dbo.ConnectToDatabase();
    console.log("Connected To Finance Manager Database. Port: ", port);
});
