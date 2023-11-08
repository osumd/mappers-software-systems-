const express = require("express");
const formidable = require("formidable")
const cors = require("cors");

const dbo = require("./dbo");

const port = process.env.PORT || 5000;

const app = express();

app.use(cors());
app.use(express.json());
app.use(require("./models/user"));

app.listen(port, () => {
    // perform a database connection when server starts
    // the IP this runs from must be whitelisted with the MongoDB database server
    dbo.ConnectToDatabase();
    console.log("Connected To Finance Manager Database.");
});

app.post('/api/upload', (req, res, next) => {
    const form = new formidable.IncomingForm()

    form.maxFileSize = 50*1024*1024 // 5MB

    // calling parse() will parse the form and extract the fields and files into objects similar to arrays
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        // the variable is called files, and the name of the form in the html is also files, so we get this abomination of 'files.files'
        console.log(files.files)

        // if we did not receive files, assume it's just text
        if (files.files === undefined) {
            ParseManualTransaction(fields)
        } else {
            
        }

        res.status(200).send();
    });
})

function ParseManualTransaction(fields) {
    console.log({ fields }) // example: { title: [ 'title' ], money: [ 'money' ], category: [ '' ] }
}
