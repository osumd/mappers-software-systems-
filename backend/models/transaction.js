const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const recordRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../dbo");
 
// This help convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;

const jwt = require('jsonwebtoken');
const secretKey = '&^da0X*f)9$$u#2$0c./*DzaD%%3qFS*$%%42x#0!9uVs{029}a131312';
 
// This section will help you get a single record by id
recordRoutes.route("/transactions").get(async function (req, response) {
  
  var DebugMode = true;

  function msg(message)
  {
      if(DebugMode)
      {
          console.log(message);
      }
  }

  try{
    let db_connect = dbo.getDB("HighPriv");

    if(db_connect == undefined)
    {
      msg("DB_Connect returning undefined");
      response.json({transactionDocuments: "", successful:false})
      
    }
    let myquery = { 
      user_id: req.body.user_id
    };
    msg(" \n\n\n\n Transaction Request");

    msg("Currently searching transacions for " + myquery);


    const collection = db_connect.collection("transactions");
    if(collection == undefined)
    {
      msg("Collection returning undefined");
      response.json({transactionDocuments: "", successful:false})
      
    }
    var cursor = await collection.find(myquery);
    msg("Found cursor for transactions: " + cursor);
    var results = cursor.toArray();

    response.json({transactionDocuments: results, successful:true});
  }catch(error)
  {
    response.json({transactionDocuments: "", successful:false})
    msg("Error fetching transactions:" + error.message);
  }
  
  
});
 
recordRoutes.route("/transaction").get(async function (req, response) {
  var DebugMode = true;

  function msg(message)
  {
      if(DebugMode)
      {
          console.log(message);
      }
  }
  msg("\n\n\n\n Transaction ID Request ");
  let db_connect = dbo.getDB("HighPriv");
  let transaction = {
    transaction_id: req.body.transaction_id
  };

  msg("Transaction id : " + transaction);

  try{
    let collection = db_connect.collection("transactions");
    let verification = await collection.findOne(transaction);
    
    if(verification != null)
    {
      msg("Response was made from database: " + verification );
      response.json({transactionDocuments: verification, successful:true});

    }else
    {
      msg("Error checking getting transaction");
      response.json({transactionDocuments: "", successful:false});
    }
  }catch(error)
  {
    msg("Error checking transaction:" + error.message);
    response.json({transactionDocuments: results, successful:false});
    
  }
});

recordRoutes.post("/transaction/insert", async function (req, response) {

  var DebugMode = true;

  function msg(message)
  {
      if(DebugMode)
      {
          console.log(message);
      }
  }

  msg("\n\n\n Transaction insertion started");

  let db_connect = dbo.getDB("HighPriv");

  const user_id = req.body.user_id;
  const data = req.body.transaction_data;

  const transactionsWithUserId = data.map(transaction => {
    return { ...transaction, user_id: user_id };
  });
  
  try{

    let collection = db_connect.collection("transactions");
    if(collection == undefined)
    {
      msg("Collection was undefined");
      response.json({successful: false});
    }
    
    let verification = await collection.insertMany(transactionsWithUserId);

    if(verification != null)
    {
      msg("Succsessfully inserted transaciton: " + verification)
      response.json({succesful: true});

    }else
    {
      msg('Failed to insert transaction');
      response.json({succesful: false});
    }
  
 }catch(error)
 {
    msg('Token verification failed' + error.message);
    response.json({succesful: false});
 }
  

});

 
module.exports = recordRoutes;