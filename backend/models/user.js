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
 


recordRoutes.post("/user/exist", async function(req, response){

  var DebugMode = true;

  function msg(message)
  {
      if(DebugMode)
      {
          console.log(message);
      }
  }

  let db_connect = dbo.getDB("HighPriv");
  let user = {
    username: req.body.username
  };

  msg("Username entered to server: " + user.username);

  try{

  
  let collection = db_connect.collection("users");
  let verification = await collection.findOne(user);
  msg("Response was made from database: " + verification );
  if(verification != null)
  {
    
    const usertoken = jwt.sign(user, secretKey, { expiresIn: '1h' });
    response.json(true);

  }else
  {
    response.json(false);
  }
  }catch(error)
  {
    msg("Error checking username:" + error.message);
    response.json(false);
  }
});


recordRoutes.post("/user/userid", async function(req, response){

  var DebugMode = true;

  function msg(message)
  {
      if(DebugMode)
      {
          console.log(message);
      }
  }

  msg("\n\n\n\n Searching valid user_id");

  let db_connect = dbo.getDB("HighPriv");
  let user = {
    _usertoken: req.body._usertoken
  };

  msg("usertoken searching " + _usertoken);

  try{
    let collection = db_connect.collection("users");
    const user_full = jwt.decode(user);
    let verification = await collection.findOne(user_full);

    msg("Response was made from database: " + verification );
    if(verification != null)
    {
      const user_id = verification._id;
      response.json({user_id: user_id, sucessful: true});

    }else
    {
      response.json({user_id: "", sucessful: false})
    }
  }catch(error)
  {
    msg("Error retrieving user_id:" + error.message);
    response.json({user_id: "", sucessful: false})
  }
});

recordRoutes.post("/users/add", async function (req, response) {

  var DebugMode = true;

  function msg(message)
  {
      if(DebugMode)
      {
          console.log(message);
      }
  }

  let db_connect = dbo.getDB("HighPriv");
  let user = {
    username: req.body.username,
    password: req.body.password
  };

  try{

    let collection = db_connect.collection("users");
    let verification = await collection.insertOne(user);

    if(verification != null)
    {
      
      const usertoken = jwt.sign(user, secretKey, { expiresIn: '1h' });
      msg("Succsessfully inserted user: " + verification)
      response.json({_usertoken: usertoken});

    }else
    {
      msg('Token verification failed');
      response.json({_usertoken: ""});
    }
  
 }catch(error)
 {
    msg('Token verification failed' + error.message);
    response.json({_usertoken: ""});
 }
  

});


recordRoutes.post("/user/login",async function(req,response){

  var DebugMode = true;

  function msg(message)
  {
      if(DebugMode)
      {
          console.log(message);
      }
  }

  let db_connect = dbo.getDB("HighPriv");

  let user = {
    username: req.body.username,
    password: req.body.password
  };

  try
  {
    let collection = db_connect.collection("users");
    let verification = await collection.findOne(user);

    if(verification != null)
    {
      const usertoken = jwt.sign(user, secretKey, { expiresIn: '1h' });
      msg("Succesfully validated user credentials: " + verification);
      response.json({_usertoken: usertoken});

    }else
    {
      msg('Token verification failed');
      response.json({_usertoken: ""});
    }
  }catch(error)
  {
    msg('Token verification failed:', error.message);
    response.json({_usertoken: ""});
  }
  

});

recordRoutes.post("/user/usertoken", async function(req,response){

  var DebugMode = true;

  function msg(message)
  {
      if(DebugMode)
      {
          console.log(message);
      }
  }

  let db_connect = dbo.getDB("HighPriv");
  if(req.body._usertoken == null)
  {
    response.json({validation: false});

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
      if(verification != null)
      {
        response.json({validation: true});
        msg("Succesfully validated token: " + verification);

      }else
      {
        msg('Token verification failed');
        response.json({validation: false});
      }
      
    }catch(error)
    {
      msg('Token verification failed:', error.message);
      response.json({validation: false});
    }
  }  
});

//returns as much information about user as possible given user_token
recordRoutes.post("/user/visible", async function(req,response){

  var DebugMode = true;

  function msg(message)
  {
      if(DebugMode)
      {
          console.log(message);
      }
  }

  let db_connect = dbo.getDB("HighPriv");
  if(req.body._usertoken == null)
  {
    response.json({visible: "", validation: false});

  }else
  {
    try{
      const decoded = jwt.decode(req.body._usertoken, secretKey);

      const visibleuser = {
        username: decoded.username,
      };
      let collection = db_connect.collection("users");

      if(decoded != null)
      {
        response.json({visible: visibleuser, validation: true});
        msg("Succesfully validated token: " + verification);

      }else
      {
        msg('Token verification failed.');
        response.json({visible: "", validation: false});
      }
      
    }catch(error)
    {
      msg('Token verification failed:', error.message);
      response.json({visible: "", validation: false});
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