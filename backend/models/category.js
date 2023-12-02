const {month} = require ("../lib")
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
 const dbName = "Finance"


 recordRoutes.route("/allTransactions").get(function (req, res) {
  let db_connect = dbo.getDB(dbName);
 
  db_connect
    .collection("")
    .find({})
    .toArray(function (err, result) {
      if (err) throw err;
      
      res.json(result);
    });
 });
 recordRoutes.route("/categories").get(async function (req, res) {
  let db_connect = dbo.getDB(dbName);
 const found= await db_connect
    .collection("Categories")
    .distinct("Category", {});
    res.json(found)

 });
 recordRoutes.route("/categories/spending").get( async function (req, res) {

  let db_connect = dbo.getDB(dbName);
  const result = await db_connect
  .collection("transactions")
  .aggregate([
    {$group: {_id: "$Category", spending: {$sum: "$Amount"}}
    }
  ]).toArray();
  res.json(result)
});
const projectMonthYear = 
  {
    "MM/YYYY": {$concat: [{$toString:{$month: "$Date"}}, "/", { $toString: {$year: "$Date"}}]},
    "Amount": 1,
    "Description": 1,
    "Category": 1
  }
const getSpending=
{
  "Amount": {$gte: 0}
}
recordRoutes.route("/transactions/monthly/relative/:count").get(async function(req, res){
  let tomonth = new Date().getMonth();
  let toyear = new Date().getFullYear();
  let min = new Date();
  min.setDate(1)
  
  let count = req.params.count;
  if (count > tomonth){
    min.setMonth(12-(count-tomonth))
    min.setYear(toyear -1)
  }
  else{
    min.setMonth(tomonth-count)
  }


  let db_connect = dbo.getDB(dbName);
  const result = await db_connect
  .collection("transactions")
  .aggregate([
    {$match: Object.assign({"Date": {$gte: min}}, getSpending)},
     {$project: projectMonthYear},
     {$group: {_id: "$MM/YYYY" , spending: {$sum: "$Amount"} } }
  ]).toArray();
  res.json(result)
})
recordRoutes.route("/transactions/monthly/:category").get(async function(req, res){
  let db_connect = dbo.getDB(dbName);
  const result = await db_connect
  .collection("transactions")
  .aggregate([
    {$match:   Object.assign({Category: req.params.category}, getSpending)},
     {$project: projectMonthYear},
     {$group: {_id: "$MM/YYYY" , spending: {$sum: "$Amount"} } }
  ]).toArray();
  res.json(result)
})
  recordRoutes.route("/transactions/:category").get( async function (req, res) {

    let db_connect = dbo.getDB(dbName);
    let myquery = { 
      Category: req.params.category
    };
    let results = await db_connect
    .collection("transactions")
    .aggregate([
      { $match: myquery}
    ]).toArray();
    res.json(results);
  });
  recordRoutes.route("/")



 // This section will help you get a single record by id
recordRoutes.route("/transaction/:id").get(async function (req, response) {
  let db_connect = dbo.getDB(dbName);
  //console.log(req.params.id);
   let myquery = { 
     Amount: parseFloat(req.params.id)
   };
 
   const collection = db_connect.collection("transactions");
   const found = await collection.findOne(myquery);
   response.json(found);
 });
  
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
    let db_connect = dbo.getDB(dbName);

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
  let db_connect = dbo.getDB(dbName);
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

  let db_connect = dbo.getDB(dbName);

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