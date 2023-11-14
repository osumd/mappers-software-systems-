import React, { useState } from 'react';

export default function BudgetForm( {onAddBudgetItem} ){
    const [category, setCategory] = useState('');
    const [amount, setAmount] = useState('');

    const handleSubmit = (event) => {
        //prevent page reload
        event.preventDefault();

        //validate input
        if(category && amount){
            onAddBudgetItem({category, amount: Number(amount)});
            setCategory('');
            setAmount('');
        }

    };

    return (
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)}/>
          <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)}/>
          <button type="submit">Add Budget</button>
        </form>
      );
}