const express = require("express");
const dbo = require("./dbo");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
app.use(require("./models/user"));

app.listen(port, () => {
    // perform a database connection when server starts
    dbo.ConnectToDatabase();
    console.log("Connected To Finance Manager Database.");
});