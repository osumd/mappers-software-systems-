# Table of Contents
- [Database Login](#Database-Login)
- [Installing Mongodb](#Installing-Mongodb)
- [Start the server](###Start-the-server)
- [Start the client](###-Start-the-client)
- [Creating a model](##Creating-a-model)
- [Talking to the server inside of finance](#Talking-to-the-server-inside-of-finance)

# Database Login
___________________________________
| **Email**   | **Password**   |
| -------------- | -------------- |
| keversmithd@my.lanecc.edu   | mappers123     |
__________________________________
## Link to login
[MongoDB Atlas](https://account.mongodb.com/account/login?_ga=2.83911577.1247569756.1698795575-1658450861.1698198299)
#### Steps to allow your ip addresss.
Look at the left bar then scan
Down until finding Quickstart under
Security.
Click t his and click add my current ip, then click add entry.
I'm sorry for some reason mongodb doesn't have any other way.

# Installing Mongodb
### Install the database
[backend/](./backend/)
#### Head into this directory and run
```bash
$ cmd ./backed/
$ npm install mongodb express cors dotenv
```
# Start the server
[backend/](./backend/)
Head into this directory and run
```bash
$ node server.js
```
# Start the client
[backend/](./finance/)
Make sure to have run
```bash
$ npm install
```
#### Head into this directory and run
```bash
$ npm run dev
```
# Creating a model
### Requirements.
#### Insert a new javascript file into this folder
[backend/models/](./backend/models/)
#### Use this to include the data base and the server router and the encryption key.
```javascript
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
const secretKey = 'Your secret key.';
```
#### Create your custom server function.
``` javascript
recordRoutes.post("/your/path", async function (req, response) {
  
  let db_connect = dbo.getDB("HighPriv"); // This gets your database.

 //This is passed to this function from the website client.
 //Any object sent will be sent here
  let YourObjectSent =  req.body; 
  //This format will allow the data to be searched for
  const YourObjectInJson
  {
     var1: req.body.var1,
     var2: req.body.var2
  }

  const db_collection = db_connect.collection("users"); 
  //I will now list all functions availabe here.
  const db_request =  await db_collection.insertOne(YourObjectInJson);


```
____________________________________________________________________ 
| **Command**   | **Arguments**   | **Return**  | **Description** |
| -------------- | -------------- | ---------- | ----------------- |
| await db_collection.insertOne(YourObjectInJson);   | JsonObject |  Sents back .acknowledged, which means that it inserted properly and .insertedID, the id of the inserted object.   
| Inserts the value into the collection | await db_collection.findOne(YourObjectInJson);  Returns all documents which have match any paramters inside of query. | Find an entry into the collection. |
|await collection.updateOne(YourObjectInJson,ObjectInJsonWithNewValues); | ObjectInJsonWithNewValue is exactly the same but instead add an outer lay $set{% old inner json code}, $unset{ % old inner json code %} or $replaceWith{ % old inner json code % }  | { "acknowledged" : true, "matchedCount" : 1, "modifiedCount" : 1 } | updateOne | |
| await deleteOne(myquery) | Deletes the item with matching json arguments | { "acknowledged" : true, "deletedCount" : 1 } | |

``` javascript
    res.json({Anything you want to send back.});
});
```


# Talking to the server inside of finance
## Example Form
``` javascript
import React, { useContext, useState } from "react";

export default function Page() {

    // set form, just takes whatever json format you have.

    const [form, setForm] = useState({
        your_form1: "",
        your_form2: "",
    });
    // These methods will update the state properties.
    function updateForm(value) {
        //updateForm({ username: e.target.value })} this calls this function.
        return setForm((prev) => {
            //gets the previous values in the form and replaces only the neccecary ones
            return { ...prev, ...value };
        });
    }


    // This function will handle the submission.
    async function onSubmit(e) {
        e.preventDefault();
        // When a post request is sent to the create url, we'll add a new record to the database.
        const newEntry = { ...form };
        //Gets current data in the form statevariable.

        const response = await fetch("http://localhost:5000/your/path", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
            body: JSON.stringify(newEntry), //put your json object here.
        })
        .catch(error => {
            window.alert(error);
            return;
        });

        const PostRequestResponnse = await response.json());

        

        setForm({ your_form1: "",
        your_form2: "",});
        return;
    }

    return (
        <form onSubmit={onSubmit}>
        <div className="form-group">
            <label htmlFor="your_form1">your_form1</label>
            <input
            type="text"
            className="form-control"
            id="your_form1"
            value={form.your_form1}
            onChange={(e) => updateForm({ your_form1: e.target.value })}
            />
        </div>
        <div className="form-group">
            <label htmlFor="your_form2">your_form2</label>
            <input
            type="text"
            className="form-control"
            id="your_form2"
            value={form.your_form2}
            onChange={(e) => updateForm({ your_form2: e.target.value })}
            />
        </div>
        <div className="form-group">
            <input
            type="submit"
            value="sumbitthese"
            className="btn btn-primary"
            />
        </div>
        </form>
        );
}
```


# Creativity ensues
### What im working on
I have the folder under pages called user which allows to sign up, sign in, I've yet to include log out and edit user value.

I have yet to make a collection named transcations which maps the user id to a collecition that they own.