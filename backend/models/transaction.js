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
const dbName = "HighPriv"
const collection = "Transactions"

 recordRoutes.route("/allTransactions").get(async function (req, res) {
  let db_connect = dbo.getDB(dbName);
 
  const found= await db_connect
  .collection(collection)
  .find();
  res.json(found)

});
recordRoutes.route("/myTransactions").get(async function (req, res) {
  let db_connect = dbo.getDB(dbName);
 
  const found= await db_connect
  .collection(collection)
  .find({}).sort({date: -1}).limit(10).toArray();
  res.json(found)

});
 recordRoutes.route("/categories").get(async function (req, res) {
  let db_connect = dbo.getDB(dbName);
 const found= await db_connect
    .collection(collection)
    .distinct("category", {});
    res.json(found)

 });
 recordRoutes.route("/categories/spending").get( async function (req, res) {

  let db_connect = dbo.getDB(dbName);
  const result = await db_connect
  .collection(collection)
  .aggregate([
    {$group: {_id: "$category", spending: {$sum: "$amount"}}
    }
  ]).toArray();
  res.json(result)
});
const projectMonthYear = 
  {
    "MM/YYYY": {$concat: [{$toString:{$month: "$date"}}, "/", { $toString: {$year: "$date"}}]},
    "amount": 1,
    "description": 1,
    "category": 1
  }
const getSpending=
{
  "amount": {$gte: 0}
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
  .collection(collection)
  .aggregate([
    {$match: Object.assign({"date": {$gte: min}}, getSpending)},
     {$project: projectMonthYear},
     {$group: {_id: "$MM/YYYY" , spending: {$sum: "$amount"} } }
  ]).toArray();
  res.json(result)
})
recordRoutes.route("/transactions/monthly/:category").get(async function(req, res){
  let db_connect = dbo.getDB(dbName);
  const result = await db_connect
  .collection(collection)
  .aggregate([
    {$match:   Object.assign({category: req.params.category}, getSpending)},
     {$project: projectMonthYear},
     {$group: {_id: "$MM/YYYY" , spending: {$sum: "$amount"} } }
  ]).toArray();
  res.json(result)
})
recordRoutes.route("/transactions/:category").get( async function (req, res) {

  let db_connect = dbo.getDB(dbName);
  let myquery = { 
    Category: req.params.category
  };
  let results = await db_connect
  .collection(collection)
  .aggregate([
    { $match: myquery }
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
 
   const collection = db_connect.collection(collection);
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


    const collection = db_connect.collection(collection);
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
    let collection = db_connect.collection(collection);
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

    let collection = db_connect.collection(collection);
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


recordRoutes.post("/transaction/search", async function(req,response) {

  const query = req.body;
  // const matchCriteria = {
  //   $match: {
  //     $and: [
  //       //query.categories ? { category: { $in: query.categories } } : {},
  //       query.amount ? { amount: { $gte: 0.0  , $lte: 100.0 } } : {},
  //       //query.date ? { Date: { $gte: query.date_from, $lte: query.date_to } } : {},
  //       //query.keywords.trim() !== '' ? { description: { $regex: query.keywords, $options: 'i' } } : {},
  //     ]
  //   }
  // };

  const dateFromString = (dateString) => {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day, 0, 0, 0);
  };
  const dateFrom = dateFromString(query.date_from);
  const dateTo = dateFromString(query.date_to);
  console.log("from: " + dateFrom + " to: " + dateTo);
  console.log("from:" , new Date(query.date_from)," to:", new Date(query.date_to));
  console.log("keywords: " + query.keywords );
  const matchCriteria = {
    $match: {
      $and: [
              query.categories.length > 0 ? { category: { $in: query.categories } } : {},
              { amount: { $gte: parseFloat(query.amount_from)  , $lte: parseFloat(query.amount_to) } },
              query.date_from != '' ? { date: { $gte: new Date(query.date_from), $lte: new Date(query.date_to) } } : {},
              query.keywords.trim() !== '' ? { description: { $regex: query.keywords} } : {},
              { user_id: query.user_id}
      ]
    }
  };


  const group_stage = {
      $group: {
          _id: "$user_id",
          count: { $sum: 1 }
      }
  }

  var pipeline = [ matchCriteria, group_stage ]


  let db_connect = dbo.getDB("HighPriv");

  //categories : array of potential categories
  //amount     : [from-to] or singular
  //date       : [from-to] or singular
  var DebugMode = true;

  function msg(message)
  {
      if(DebugMode)
      {
          console.log(message);
      }
  }

  msg("\n\n\n Transaction aggregation started");

  msg("Search body: " + query.amount_from + ":" + query.amount_to);
  

  try {
    // Perform the MongoDB aggregation

    let collection = db_connect.collection("transactions");
    if(collection == undefined)
    {
      msg("Collection was undefined");
      response.json({successful: false, transactions: 0});
    }

    const results = await collection.aggregate([matchCriteria]).toArray();
    response.json({successful: true, transactions: results});
    } catch (error) {
      msg('Error:', error);
      response.json({successful: false, transactions: 0});
    }
});
 
module.exports = recordRoutes;