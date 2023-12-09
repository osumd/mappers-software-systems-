import BudgetPieChart from './budgetPieChart';
import { useRouter} from 'next/router';
import React, { useEffect, useState } from 'react';
import { UserId } from '../User/verification'

import styles from '../../styles/component/component.module.css';



export default function BudgetTool(){
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');
    const [budgetData, setBudgetData] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [user_id, setUserId] = useState('');

    const [editItemId, setEditItemId] = useState(null);
    const [editedAmount, setEditedAmount] = useState('');

    const router = useRouter();

    //const user_id = userLoggedIn.user_id;
    //const user_id = "12345";

    useEffect(() => {
        fetchBudgetItems();
        fetchCategoryList();
        setUserId(UserId().user_id);
    }, [user_id]);

    const navigateToDashboard = () => {
        router.push('/dashboard');
    };

   const fetchBudgetItems = async () => {
        try {
            const response = await fetch(`http://localhost:5000/budgetItems/${user_id}`);
            if (response.ok){
                const data = await response.json();
                setBudgetData(data);
            } else {
                console.error("Failed to fetch budget items");
            }
        } catch(error) {
            console.error("Error fetching budget items", error);
        }
    }

    const changeBudget = async (id) =>{
        setEditItemId(id);
    }

    const deleteBudget = async (id) => {
        try{
            const response = await fetch(`http://localhost:5000/deleteBudgetItem/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                fetchBudgetItems(); // Fetch updated data after successful delete
            } else {
                console.error('Failed to delete budget item');
            }
        } catch(error){
            console.error('Error while deleting budget item: ', error);
        }
    }

    const saveChangedBudget = async (id) => {
        try {
            const response = await fetch(`http://localhost:5000/updateBudgetItem/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount: editedAmount }),
            });

            if (response.ok) {
                fetchBudgetItems(); // Fetch updated data after successful update
                setEditItemId(null); // Reset the edit state
                setEditedAmount(''); // Reset the edited amount
            } else {
                console.error('Failed to update budget item');
            }
        } catch (error) {
            console.error('Error while updating budget item: ', error);
        }
    }

    const fetchCategoryList = async () => {
        try {
            const response = await fetch("http://localhost:5000/categories/");
            if(response.ok){
                const data = await response.json();
                setCategoryList(data);
            } else {
                console.error("Failed to fetch category list");
            }
        } catch(error) {
            console.error("Error fetching category list", error);
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
    <div className="container">
        <div>
            <BudgetPieChart showButton={false}/>
        </div>
        <div> 
            <form  onSubmit={handleSubmit}>
                <div className="container">
                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                        <option value="">Select a category</option>
                        {categoryList.map((categoryItem, index) => (
                            <option key={index} value={categoryItem}>
                                {categoryItem}
                            </option>
                        ))}
                </select>
                <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)}/>
                <button type="submit">Add Budget</button>
                </div>
            </form>
        </div>
        <div>
            <table className={styles.table}>
                <thead>
                <tr>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Action</th>
                </tr>
                </thead>
                <tbody>
            {budgetData.map((val, key) => {
                    return (<tr key={key}>
                        <td>{val.category}</td>
                        <td>
                            {editItemId === val._id ? (
                                <input
                                type="number"
                                value={editedAmount}
                                onChange={(e) => setEditedAmount(e.target.value)}
                            />
                            ) : (val.amount)
                            }
                        </td>
                        <td>
                        {editItemId === val._id ? (
                                    <button onClick={() => saveChangedBudget(val._id)}>Save</button>
                                ) : (
                                    <>
                                        <button onClick={() => changeBudget(val._id)}>Change</button>
                                        <button onClick={() => deleteBudget(val._id)}>Delete</button>
                                    </>
                                )}
                        </td>
                    </tr>
                    )
            })}
            </tbody>
            </table>

            
        </div>

        <div>
            <button onClick={navigateToDashboard}>Back To Dashboard</button>
        </div>

        <style jsx>{`

        table {
            border-collapse: collapse;
        }

        tr,th{
            border: 1px solid black;
            padding: 5px; 
        }

        th {
            background-color: black;
            color: white;
        }

        .container {
            display: flex;
            align-items: center;
            justify-content: space-evenly;
        }
        
        tr:nth-child(odd){
            background-color: #f2f2f2;
        }
        
        tr:nth-child(even){
            background-color: #ffffff;
        }
        
      `}</style>
    </div>
    );
}
