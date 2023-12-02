import React, { useEffect, useState } from 'react';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BudgetPieChart(){

  const [budgetData, setBudgetData] = useState([]);
  const user_id = "12345";

  useEffect(() => {
    fetchBudgetItems();
});

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

    const data = {
        labels: [],
        datasets: [
          {
            data: [],
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

    if (budgetData && Array.isArray(budgetData)) {
      data.labels = budgetData.map((item) => item.category);
      data.datasets[0].data = budgetData.map((item) => item.amount);
    }

    return(
      <div>
        {budgetData && Array.isArray(budgetData) ? (
          <Pie data={data}></Pie>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    );
}