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
import { InferGetStaticPropsType, GetStaticProps } from 'next'
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
const spendings = [100, 200, 200, 300, 200, 200, 200]
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
      console.log(data)
    })
    .catch(error=> console.error(error))
}, []);
return value
}

export default function Graph({
  transactions}) {
    const [category, setCategory] = useState('Restaurants')

    const [chart, setChart] = useState(initChart([{_id: 0, spending: 0}]))

  //console.log(transactions)
   let categorySelector = fetcher("/categories")

   let getMonthlySpending = fetcher("/transactions/monthly/Restaurants")

   useEffect(() => {
    fetch(`http://localhost:5000/transactions/monthly/${category}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
  
        console.log(data)
        setChart(initChart(data))
      })
      .catch(error=> console.error(error))
  }, [category]);


  const handleChart = async () => {
    // const data = await (await fetch(`http://localhost:5000/transactions/monthly/${category}`)).json()
    // console.log(data)
    // setSpending(data)

    

  }
  function initChart(spending){
    return {
      labels: spending.map(month=>month._id),
      datasets: [
        {
          type: 'bar' ,
          label: 'Dataset 3',
          backgroundColor: 'rgb(53, 162, 235)',
          data: spending.map(month=>month.spending),
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
