const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../dbo");


recordRoutes.post("/uploadBudgetItem", async function (req,response){
    const user_id = req.body.user_id;
    const {category, amount} = req.body.budget_data;

    try{
        let db_connect = dbo.getDB("HighPriv");
        const collection = db_connect.collection("Budget");

        const budgetDocument = {
            user_id: user_id,
            category: category,
            amount: amount
        };

        await collection.insertOne(budgetDocument);

        response.status(200).json({message: "Budget item uploaded successfully"});
    } catch(error){
        console.error("Error uploading budget item:", error);
        response.status(500).json({ error: "Failed to upload budget item" });
    }
});

recordRoutes.route("/budgetItems/:userId").get(async function(req,res){
    const userID = req.params.userId;

    try{
        let db_connect = dbo.getDB("HighPriv");
        const collection = db_connect.collection("Budget");

        const budgetItems = await collection.find({user_id: req.params.userId}).toArray();

        res.status(200).json(budgetItems);
    } catch (error){
        console.error("Error retrieving budget items:", error);
        res.status(500).json({ error: "Failed to retrieve budget items" });
    }
});
module.exports = recordRoutes;