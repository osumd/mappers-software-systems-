const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../dbo");
const user_id = 0;
const { BSON, EJSON, ObjectId } = require('bson');

recordRoutes.post("/addGoal/:user_id", async function (req,response){
    const user_id= parseInt(req.params.user_id);
    const {name, threshold, amount, due_date} = req.body

    try{
        let db_connect = dbo.getDB("HighPriv");
        const collection = db_connect.collection("Goals");

        const goalDocument = {
            user_id: user_id,
            name: name,
            amount: parseFloat(amount),
           threshold: parseFloat(threshold),
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
       await collection.updateOne(
            {"_id": new BSON.ObjectId(req.body.id)},
            {$inc : {"amount": change}}
        )
        const item = await collection.findOne({"_id": new BSON.ObjectId(req.body.id)})
        console.log(item);
        response.status(200).json(item);
    } catch(error){
        console.error("Error uploading budget item:", error);
        response.status(500).json({ error: "Failed to upload budget item" });
    }
});

recordRoutes.route("/goals/:user_id").get(async function(req,res){
    const user_id= parseInt(req.params.user_id);
    try{
        let db_connect = dbo.getDB("HighPriv");
        const collection = db_connect.collection("Goals");

        const budgetItems = await collection.find({
            user_id: user_id,
        }).toArray();
        
        res.status(200).json(budgetItems);
    } catch (error){
        console.error("Error retrieving budget items:", error);
        res.status(500).json({ error: "Failed to retrieve budget items" });
    }
});
recordRoutes.route("/active_goals/:user_id").get(async function(req,res){
    const user_id= parseInt(req.params.user_id);

    try{
        let db_connect = dbo.getDB("HighPriv");
        const collection = db_connect.collection("Goals");

        const budgetItems = await collection.find({user_id: 0,
                $expr:{
               $gt: [ "$threshold" , "$amount" ] }  
              }).toArray();
        
        res.status(200).json(budgetItems);
    } catch (error){
        console.error("Error retrieving budget items:", error);
        res.status(500).json({ error: "Failed to retrieve budget items" });
    }
});
recordRoutes.route("/complete_goals/:user_id").get(async function(req,res){

    const user_id= parseInt(req.params.user_id);
    try{
        let db_connect = dbo.getDB("HighPriv");
        const collection = db_connect.collection("Goals");

        const budgetItems = await collection.find({user_id: user_id,
            
                $expr:{
               $lte: [ "$threshold" , "$amount" ] }
              
              }).toArray();
        
        res.status(200).json(budgetItems);
    } catch (error){
        console.error("Error retrieving budget items:", error);
        res.status(500).json({ error: "Failed to retrieve budget items" });
    }
});
module.exports = recordRoutes;