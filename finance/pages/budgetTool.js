import React, { useState } from 'react';
import BudgetForm from './budgetForm'
import BudgetPieChart from './budgetPieChart';

import styles from '../styles/Home.module.css'



export default function BudgetTool(){

    const [budgetData, setBudgetItems] = useState([]);

    const addBudgetItem = (newItem) => {
        setBudgetItems([...budgetData, newItem]);
    };
    
    return (
             <div className={styles.budget_container}>
                 <div className={styles.budget_child}>
                     {<BudgetPieChart budgetData={budgetData}/>}
                 </div>
                 <div className={styles.budget_child}> 
                     <BudgetForm onAddBudgetItem={addBudgetItem} />
                 </div>
            
             </div>
    );
}


// export default function BudgetTool(){

//     const [budgetData, setBudgetItems] = useState([]);

//     const addBudgetItem = (newItem) => {
//         setBudgetItems([...budgetData, newItem]);
//     };
    
//     return (
//     <div className={styles.budget_container}>
//         <div className={styles.budget_child}>
//             <BudgetPieChart budgetData={budgetData}/>
//         </div>
//         <div className={styles.budget_child}> 
//             <BudgetForm onAddBudgetItem={addBudgetItem} />
//         </div>
    
//     </div>
//     );
// }
