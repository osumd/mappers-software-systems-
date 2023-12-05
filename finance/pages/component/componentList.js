
import BudgetPieChart from "../budgetPieChart";
import MyForm    from "../exampleForm";
import {useState} from 'react';

const COMPONENT_ENUM = {
    BUDGET_FORM: 0,
    BUDGET_PIE_CHART:1,
};


// var Components = [
//     BudgetForm,
//     BudgetPieChart
// ];

var Components = [
    <MyForm></MyForm>,
    //<BudgetForm></BudgetForm>,
    BudgetPieChart([
        { category: "Food", amount: 500 },
        { category: "Entertainment", amount: 200 },
        { category: "Shopping", amount: 200 },
        { category: "Savings", amount: 700}
    ]),];


export {Components, COMPONENT_ENUM};