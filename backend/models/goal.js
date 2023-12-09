const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../dbo");
const user_id = 0;
const { BSON, EJSON, ObjectId } = require('bson');

recordRoutes.post("/goal", async function (req,response){

    const {name, threshold, amount, due_date} = req.body

    try{
        let db_connect = dbo.getDB("HighPriv");
        const collection = db_connect.collection("Goals");

        const goalDocument = {
            user_id: user_id,
            name: name,
            amount: amount,
           threshold: threshold,
           due_date: due_date
        };

        const item = await collection.insertOne(goalDocument);
        console.log(item);
        response.status(200).json(item);
    } catch(error){
        console.error("Error uploading budget item:", error);
        response.status(500).json({ error: "Failed to upload budget item" });
    }
});

recordRoutes.post("/goal/transfer", async function (req,response){

    const change= parseFloat(req.body.change);

    try{
        let db_connect = dbo.getDB("HighPriv");
        const collection = db_connect.collection("Goals");
        console.log(change);
       const item= await collection.findOneAndUpdate(
            {"_id": new BSON.ObjectId(req.body.id)},
            {$inc : {"amount": change}}
        )
        console.log(item);
        response.status(200).json(item);
    } catch(error){
        console.error("Error uploading budget item:", error);
        response.status(500).json({ error: "Failed to upload budget item" });
    }
});

recordRoutes.route("/goals").get(async function(req,res){


    try{
        let db_connect = dbo.getDB("HighPriv");
        const collection = db_connect.collection("Goals");

        const budgetItems = await collection.find({user_id: user_id}).toArray();

        res.status(200).json(budgetItems);
    } catch (error){
        console.error("Error retrieving budget items:", error);
        res.status(500).json({ error: "Failed to retrieve budget items" });
    }
});
module.exports = recordRoutes;