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
      console.log(data)
    })
    .catch(error=> console.error(error))
}, [])
return value
}

export default function Graph({
  transactions}) {
    const [category, setCategory] = useState('Restaurants')

    const [chart, setChart] = useState(initChart([{_id: 0, spending: 0}], false))
    let budget={}


  //console.log(transactions)
   let categorySelector = fetcher("/categories")
   if (categorySelector){
  
    for (let i =0; i < categorySelector.length; i++){
      budget[categorySelector[i]] = budget_amount[i]
     }
    
    }
   
   //fill category with random budget



   let getMonthlySpending = fetcher("/transactions/monthly/Restaurants")

   useEffect(() => {
    fetch(`http://localhost:5000/transactions/monthly/${category}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
  
        console.log(data)
        setChart(initChart(data, budget))
      })
      .catch(error=> console.error(error))
  }, [category]);

  function initChart(spending, budget){
    console.log(budget)
    return {
      labels: spending.map(month=>month._id),
      datasets: [
        {
          type: 'bar' ,
          label: 'Dataset 3',
          backgroundColor: 'rgb(53, 162, 235)',
          data: spending.map(month=>month.spending),
        },
        {
          type: 'line',
          data: spending.map(month=> {
            if (budget){
              return budget[category]
            }
            else{
              return 0
            }
          })
          
            
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
