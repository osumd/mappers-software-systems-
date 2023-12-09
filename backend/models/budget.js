const express = require("express");
const recordRoutes = express.Router();
const dbo = require("../dbo");
const { ObjectId } = require('mongodb');


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

recordRoutes.route("/budgetItem/:category").get(async function(req,res){

    try{
        let db_connect = dbo.getDB("HighPriv");
        const collection = db_connect.collection("Budget");

        const budgetItems = await collection.find({category: req.params.category}).toArray();

        res.status(200).json(budgetItems);
    } catch (error){
        console.error("Error retrieving a budget item:", error);
        res.status(500).json({ error: "Failed to retrieve a budget item " });
    }
});

recordRoutes.put("/updateBudgetItem/:id", async function(req,res){
    const budgetID = req.params.id;
    const newAmount = req.body.amount;

    try{
        let db_connect = dbo.getDB("HighPriv");
        const collection = db_connect.collection("Budget");
        const objId = new ObjectId(budgetID)

        const result = await collection.updateOne(
            {_id: objId},
            {$set: {amount: newAmount}}
        );

        if (result.modifiedCount > 0) {
            res.status(200).json({ message: 'Budget item updated successfully' });
        } else {
            res.status(404).json({ message: 'Budget item not found or not updated' });
        }
    } catch (error){
        console.error('Error updating budget item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

recordRoutes.delete("/deleteBudgetItem/:id", async function(req,res){
    const budgetID = req.params.id;

    try {
        let db_connect = dbo.getDB("HighPriv");
        const collection = db_connect.collection("Budget");
        const objId = new ObjectId(budgetID);

        const result = await collection.deleteOne({ _id: objId });

        if (result.deletedCount > 0) {
            res.status(200).json({ message: 'Budget item deleted successfully' });
        } else {
            res.status(404).json({ message: 'Budget item not found or not deleted' });
        }
    } catch (error) {
        console.error('Error deleting budget item:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = recordRoutes;