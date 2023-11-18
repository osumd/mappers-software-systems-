import React from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BudgetPieChart( {budgetData} ){

    // const budgetData = [
    //     { category: "Food", amount: 500 },
    //     { category: "Entertainment", amount: 200 },
    //     { category: "Shopping", amount: 200 },
    //     { category: "Savings", amount: 700}
    // ];

    const data = {
        labels: budgetData.map((item) => item.category),
        datasets: [
          {
            //label:
            data: budgetData.map((item) => item.amount),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)',
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)',
            ],
            borderWidth: 1,
          },
        ],
      };
    return(
        <div>
            <Pie data={data}></Pie>
        </div>
    );
}
