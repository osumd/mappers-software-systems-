import React, { useEffect, useState } from 'react';
import BudgetPieChart from './budgetPieChart';
import { UserLoggedIn } from '../User/verification'

import styles from '../../styles/Home.module.css'



export default function BudgetTool(){
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [budgetData, setBudgetData] = useState([]);

    //const user_id = userLoggedIn.user_id;
    const user_id = "12345";

    useEffect(() => {
        fetchBudgetItems();
    }, [user_id]);

   const fetchBudgetItems = async () => {
        try {
            const response = await fetch(`http://localhost:5000/budgetItems/${user_id}`);
            if (response.ok){
                const data = await response.json();
                setBudgetData(data);
            } else {
                console.error("Failed to fetch budget items");
            }
        } catch {
            console.error("Error fetching budget items", error);
        }
    }

    const handleSubmit = async (event) => {
      //prevent page reload
        event.preventDefault();

      //validate input
        if(category && amount){

            const budgetItem = {
                user_id,
                budget_data: {
                    category,
                    amount: Number(amount),
                },
            };
        
            try{
                const response = await fetch("http://localhost:5000/uploadBudgetItem", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(budgetItem),
                });

                if (response.ok){
                    setCategory('');
                    setAmount('');
                    fetchBudgetItems(); //fetch updated data after successful upload
                } else {
                    console.error("Failed to upload budget item");
                }
            } catch (error){
                console.error("Error while uploading budget item: ", error);
            }
        }
    }

    return (
    <div className={styles.container}>
        <div>
            <BudgetPieChart budgetData = {budgetData}/>
        </div>
        <div> 
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)}/>
                <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)}/>
                <button type="submit">Add Budget</button>
            </form>
        </div>

    </div>
    );
}
