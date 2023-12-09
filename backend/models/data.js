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

        parseCSVStream(csvFile, fields.user_id[0]);
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
                //console.log("DATA RECOVERED: " + JSON.stringify(data, null, 2));
                var transValidation = validateTransaction(data);
                //console.log("transValidation: " + transValidation);
                if(transValidation != undefined)
                {
                    //console.log("transValidation: " + transValidation.validationStatus);
                    if(transValidation.validationStatus == true)
                    {
                        data.user_id = user_id;
                        allTransactions.push(data);
                    }
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
                
                //console.log("allTransactions: " + JSON.stringify(allTransactions, null, 2));
                if(allTransactions.length > 0)
                {
                    const result = await collection.insertMany(allTransactions, {ordered : false });
                    //console.log(`${result.insertedCount} documents inserted`);
                }
                
                
            } catch (err) {
                //console.error('Error inserting documents:', err);
            } finally {
                // Close the MongoDB connection
            }
        });
}

const acceptedRowInsertions =
{
    description: { pattern: /[\w\s]+/, required: true},
    date: { pattern: /\d{1,2}\/\d{1,2}\/\d{4}/, required: true},
    amount: { pattern: /\d+\.\d+/, required: true},
    category:  {pattern: /[\w\s]+/, required: true}
};

const acceptedTagMap = new Map([
    ['description', acceptedRowInsertions.description],
    ['date', acceptedRowInsertions.date],
    ['amount', acceptedRowInsertions.amount],
    ['category', acceptedRowInsertions.category],
]);


function validateTransaction(transactionJson)
{
    const keys = Object.keys(transactionJson);

    var   validTransaction = false;



    keys.forEach(key => {
        //console.log("The Key: " + key);
        const value = transactionJson[key];
        var valueInMap = acceptedTagMap.get(key);
        //console.log("Value in map: " + "{" + valueInMap.pattern + "," + valueInMap.required + "}");
        
        //console.log("Value: " + value);
        if(valueInMap == undefined)
        {
            if(valueInMap.required == true)
            {
                validTransaction = false;
                return {validationStatus: validTransaction};
            }
        }else
        {   
            var requirementMet = valueInMap.pattern.test(value);
            //console.log("requirementMet: " + requirementMet);
            if(requirementMet == true && valueInMap.required == true)
            {
                validTransaction = true;
            }
            if(requirementMet == false && valueInMap.required == true)
            {
                validTransaction = false;
                return {validationStatus: validTransaction};
            }
 
        }
    });



    return {validationStatus: validTransaction};
}

module.exports = recordRoutes;