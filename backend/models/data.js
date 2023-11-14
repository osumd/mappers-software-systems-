const express = require('express')

const routes = express.Router()

routes.route('/api/upload').post((req, res, next) => {
    const form = new formidable.IncomingForm()

    form.maxFileSize = 50*1024*1024 // 5MB, any CSV bigger than this is a gigantic file that we don't want to parse

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
    console.log({ fields }) // example: { title: [ 'title' ], date: [ 'date' ], money: [ 'money' ], category: [ '' ] }
}