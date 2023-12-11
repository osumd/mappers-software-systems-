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
    form.parse(req, async (err, fields, files) => {
        if (err) {
            next(err);
            return;
        }

        // if we did not receive files, assume it's just text
        if (files.files === undefined) {
            await ParseManualTransaction(fields)
        } else if (files.files !== undefined) {
            const csvFile = files.files[0].filepath;
            msg("Filepath: " + csvFile);

            await parseCSVStream(csvFile, fields.user_id[0]);
        }

        res.status(200).send();
    });
})

// the fields must pass a regex check before they are given to this function
async function ParseManualTransaction(fields) {
    let db_connect = dbo.getDB("HighPriv")
    let collection = db_connect.collection("transactions")

    let new_fields = {}
    new_fields.description = fields.Description[0]
    const [month, day, year] = fields.PostingDate.split('/').map(Number);
    const dateObject = new Date(year, month - 1, day);
    new_fields.date = dateObject;
    new_fields.amount = parseFloat(fields.Amount[0]);
    new_fields.user_id = fields.user_id[0]

    try {
        await collection.insertOne(fields, {ordered : false })
    } catch (err) {
        console.error('Error inserting transaction:', err)
    }
}

async function parseCSVStream(csvStream, user_id) {
    const allTransactions = []
    // Use csv-parser to parse the CSV stream
    fs.createReadStream(csvStream)
        .pipe(csvParser())
        .on('data', (data) => {

            var validTransaction = validateTransaction(data);

            if(validTransaction == true)
            {
                data.user_id = user_id
                data.amount = parseFloat(data.amount);
                const [month, day, year] = data.date.split('/').map(Number);
                const dateObject = new Date(year, month - 1, day);
                data.date = dateObject;
    
                allTransactions.push(data)
            }


            /*
            if (data) {
                var transValidation = validateTransaction(data)

                if (transValidation == false) return

                data.user_id = user_id
                allTransactions.push(data)
            }
            */
        })
        .on('end', async () => {
            // All rows have been processed
            let db_connect = dbo.getDB("HighPriv");
            let collection = db_connect.collection("transactions");

            try {
                if(allTransactions.length > 0)
                {
                    const result = await collection.insertMany(allTransactions, {ordered : false });
                    console.log(`${result.insertedCount} documents inserted`);
                }
            } catch (err) {
                //console.error('Error inserting documents:', err);
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

    var validTransaction = false;

    keys.forEach(key => {
        //console.log("The Key: " + key);
        const value = transactionJson[key];
        var valueInMap = acceptedTagMap.get(key.toLowerCase());
        //console.log("Value in map: " + "{" + valueInMap.pattern + "," + valueInMap.required + "}");
        
        // console.log("Value: " + value);
        if (valueInMap == undefined)
        {
            validTransaction = false;
            return validTransaction;
        } else
        {
            var requirementMet = valueInMap.pattern.test(value);
            // console.log("requirementMet: " + requirementMet);
            if (requirementMet == true && valueInMap.required == true)
            {
                validTransaction = true;
            }
            if (requirementMet == false && valueInMap.required == true)
            {
                validTransaction = false;
                return validTransaction;
            }
 
        }
    });

    return validTransaction;
}

module.exports = recordRoutes;