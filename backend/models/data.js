const express = require('express')

const recordRoutes  = express.Router()
const formidable = require('formidable');

const csvParser = require("csv-parser");
const fs = require("fs");

const dbo = require("../dbo");

recordRoutes.route('/api/upload').post((req, res) => {

    var Debug = true;

    function msg(message)
    {
        if(Debug == true)
        {
            console.log(message);
        }
    }

    msg("\n\n\n Beginning upload \n\n\n");

    form = new formidable.IncomingForm();

    form.maxFileSize = 50*1024*1024 // 5MB, any CSV bigger than this is a gigantic file that we don't want to parse
    
    
    // calling parse() will parse the form and extract the fields and files into objects similar to arrays
    form.parse(req, (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        msg(fields)
        // the variable is called files, and the name of the form in the html is also files, so we get this abomination of 'files.files'
        msg(files.files[0])
        const csvFile = files.files[0].filepath;
        msg("Filepath: " + csvFile);

        parseCSVStream(csvFile, fields.user_id);
        // if we did not receive files, assume it's just text
        if (files.files === undefined) {
            ParseManualTransaction(fields)
        } else {
            
        }

        res.status(200).send();
    });

    // res.status(100).send();
})

function ParseManualTransaction(fields) {
    //console.log({ fields }) // example: { title: [ 'title' ], date: [ 'date' ], money: [ 'money' ], category: [ '' ] }
}




async function parseCSVStream(csvStream, user_id) {
    const allTransactions = [];



    // Use csv-parser to parse the CSV stream
    fs.createReadStream(csvStream)
        .pipe(csvParser())
        .on('data', (data) => {
            if (data) {
                //Process each row of data as needed
                var transValidation = validateTransaction(data);
                if(transValidation.validationStatus == true)
                {
                   data.user_id = user_id;
                   allTransactions.push(data);
                }
                
            }
        })
        .on('end', async () => {
            // All rows have been processed
            let db_connect = dbo.getDB("HighPriv");
            //https://stackoverflow.com/questions/24122981/how-to-stop-insertion-of-duplicate-documents-in-a-mongodb-collection
            //db.collection.updateMany(doc, doc, {upsert:true}) to prevent duplications
            let collection = db_connect.collection("transactions");
            //console.log('CSV stream parsed:', allTransactions);
        

            try {
                // Insert multiple documents into the collection
                const result = await collection.insertMany(allTransactions);
                console.log(`${result.insertedCount} documents inserted`);
            } catch (err) {
                console.error('Error inserting documents:', err);
            } finally {
                // Close the MongoDB connection
            }
        });
}

const acceptedRowInsertions =
{
    description: { pattern: /"\w"/, required: false},
    posting_date: { pattern: 0, required: false},
    amount: { pattern: /0/, required: false},
};

const acceptedTagMap = new Map([
    ['Details', acceptedRowInsertions.description],
    ['Posting Date', acceptedRowInsertions.posting_date],
    ['Amount', acceptedRowInsertions.amount]
]);


function validateTransaction(transactionJson)
{
    const keys = Object.keys(transactionDetails);
    keys.forEach(key => {
    const value = transactionDetails[key];
    console.log(value);
    var valueInMap = acceptedTagMap.get(key);
    if(valueInMap == undefined)
    {

    }else
    {   
        var requirementMet = valueInMap.pattern.test(value);
        if(valueInMap.required == true && requirementMet == false)
        {
            return {validationStatus: false}
        }
        if(requirementMet)
        {

        }
    }
    console.log(`${key}: ${value}`);
    });

}

module.exports = recordRoutes;