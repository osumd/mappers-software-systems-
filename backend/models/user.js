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
const secretKey = '&^da0X*f)9%u$0c./z*$x#0!9uVs{029}a131312';


// This section will help you get a list of all the records.
recordRoutes.route("/users").get(function (req, res) {
 let db_connect = dbo.getDB("HighPriv");

 db_connect
   .collection("users")
   .find({})
   .toArray(function (err, result) {
     if (err) throw err;
     
     res.json(result);
   });
});


 
// This section will help you get a single record by id
recordRoutes.route("/user/:id").get(async function (req, response) {
 let db_connect = dbo.getDB("HighPriv");
 //console.log(req.params.id);
  let myquery = { 
    username: req.params.id
  };

  const collection = db_connect.collection("users");
  const found = await collection.findOne(myquery);
  response.json(found);
});

// This section will help you create a new record.
// recordRoutes.route("/users/add").post(function (req, response) {
//   let db_connect = dbo.getDB("HighPriv");
//   let myobj = {
//     username: req.body.username,
//     password: req.body.password,
//   };
//   db_connect.collection("users").insertOne(myobj, function (err, res) {
//     console.log("thread?");
//     if (err) throw err;
//     response.json(res);
//   });
// });

async function AddUser(db_connect, myobj, response)
{
  const collection = db_connect.collection("users");
  const rr = await collection.insertOne(myobj);

  response.json("good");
}

recordRoutes.post("/users/add",function (req, response) {
  
  let db_connect = dbo.getDB("HighPriv");
  let myobj = {
    username: req.body.username,
    password: req.body.password,
  };

  AddUser(db_connect,myobj, response);
  
  return;
  

});

 
recordRoutes.post("/user/login",async function(req,response){
  let db_connect = dbo.getDB("HighPriv");
  let user = {
    username: req.body.username,
    password: req.body.password
  };

  let collection = db_connect.collection("users");
  let verification = await collection.findOne(user);
  console.log(verification);
  if(verification != null)
  {
    const usertoken = jwt.sign(user, secretKey, { expiresIn: '1h' });
    response.json({_usertoken: usertoken});

  }else
  {
    response.json({verification});
  }

});

recordRoutes.post("/user/usertoken", async function(req,response){
  let db_connect = dbo.getDB("HighPriv");
  if(req.body._usertoken == null)
  {
    response.json(null);
  }else
  {
    try{
      const decoded = jwt.decode(req.body._usertoken, secretKey);

      const user = {
        username: decoded.username,
        password: decoded.password
      };
      let collection = db_connect.collection("users");
      let verification = await collection.findOne(user);
      response.json(true);

    } catch(error)
    {
      console.error('Token verification failed:', error.message);
      response.json(false);
    }
  }

  
});




// This section will help you update a record by id.
recordRoutes.route("user/update/:id").post(async function (req, response) {
  let db_connect = dbo.getDB("HighPriv");
  let myquery = { username: req.username };
  let newvalues = {
    $set: {
      username: req.body.username,
    },
  };
  const collection = db_connect.collection("users");
  const updatestatus = await collection.updateOne(myquery,newvalues);
  res.json({updatestatus});

});

// This section will help you delete a record
recordRoutes.route("/:id").delete((req, response) => {
 let db_connect = dbo.getDB("HighPriv");
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect.collection("users").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});

module.exports = recordRoutes;