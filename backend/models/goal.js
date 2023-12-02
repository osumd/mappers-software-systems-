const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../dbo");
const user_id = 0;

recordRoutes.post("/goals", async function (req,response){
    const user_id = req.body.user_id;
    const {name, threshold} = req.body.goal_data;

    try{
        let db_connect = dbo.getDB("HighPriv");
        const collection = db_connect.collection("Goals");

        const goalDocument = {
            user_id: user_id,
            name: name,
            amount: 0,
           threshold: threshold
        };

        await collection.insertOne(goalDocument);

        response.status(200).json({message: "Budget item uploaded successfully"});
    } catch(error){
        console.error("Error uploading budget item:", error);
        response.status(500).json({ error: "Failed to upload budget item" });
    }
});

recordRoutes.post("/goals/:id", async function (req,response){
    const goal_id = req.params.id;
    const added_amount = req.body.amount;

    try{
        let db_connect = dbo.getDB("HighPriv");
        const collection = db_connect.collection("Goals");


        await collection.updateOne(
            {"id": goal_id},
            {$inc : {"amount": added_amount}}
        )
        
        response.status(200).json({message: "Budget item uploaded successfully"});
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