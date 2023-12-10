import React, { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController,
} from 'chart.js';
import { Chart } from 'react-chartjs-2';
import { UserId } from './User/verification'

const filepath  = "../data/statement.csv"

ChartJS.register(
  LinearScale,
  CategoryScale,
  BarElement,
  PointElement,
  LineElement,
  Legend,
  Tooltip,
  LineController,
  BarController
);
const budget_amount= [50, 50, 0, 300 , 200, 200, 50]
//var budget={}

//const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November','December'];



// export async function getStaticProps(context) {
//   const res = await fetch('http://localhost:5000/transaction/12.74')
//   const transactions = await res.json().then((result)=>console.log(result))
//   return {
//     props: {transactions},
//   };
// }
export function fetcher(url){
  const [value, setValue] = useState([])

//console.log(transactions)

useEffect(() => {
  fetch(`http://localhost:5000${url}`)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      setValue(data)
      return value;
    })
    .catch(error=> console.error(error))
}, [])
return value
}

export default function Graph({
  transactions}) {
  const [category, setCategory] = useState('Merchandise')
  const [user_id, setUserId] = useState('');
  const [budget, setBudget] = useState({});

  const [chart, setChart] = useState(initChart([{_id: 0, spending: 0}], false))

  let categorySelector = fetcher("/categories")

  useEffect(() => {
    fetchBudgetItems();
  }, [user_id]);

  const fetchBudgetItems = async () => {
     try {
         const response = await fetch(`http://localhost:5000/budgetItems/${user_id}`);
         if (response.ok){
            const data = await response.json();
            const updatedBudget = {};
            for (let i = 0; i < data.length; i++){
              updatedBudget[data[i].category] = data[i].amount;
            }
            setBudget(updatedBudget);
            console.log(budget);
         } else {
            console.error("Failed to fetch budget items");
         }
     } catch(error) {
         console.error("Error fetching budget items", error);
     }
   }

   let getMonthlySpending = fetcher("/transactions/monthly/Restaurants")

   useEffect(() => {
    fetch(`http://localhost:5000/transactions/monthly/${category}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {

        setUserId(UserId().user_id);
        setChart(initChart(data, budget));
      })
      .catch(error=> console.error(error))

  }, [category, budget]);

  function initChart(spending, budget){
    console.log(budget[category]);
    return {
      labels: spending.map(month=>month._id),
      datasets: [
        {
          type: 'bar' ,
          label: category,
          backgroundColor: 'rgb(53, 162, 235)',
          data: spending.map(month=>month.spending),
        },
        {
          type: 'line',
          label: 'Budget Threshold',
          data: spending.map(month=> {
            if (budget && budget[category]){
              return budget[category]
            }
            else{
              return 0
            }
          }),
          borderColor: 'rgb(255,0,0)'
    
            
        }
      ]
    }
  }


  function byCategory (event){
    if (event.target.value){
      setCategory(event.target.value)
    }
   
  }

  return(
  <>
<select onChange={byCategory}> {categorySelector.map(category=>
<option value={category}>{category}</option>)}
</select>

{chart &&
  <Chart type='bar'
  data={
    chart
  } />};

  </> 
  )
 
}
