import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';

import Button from 'react-bootstrap/Button';
import styles from "../../styles/Home.module.css";
import { Chart } from "react-chartjs-2";
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
} from "chart.js";
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
function initChart(goal) {
  
  if (goal.amount < goal.threshold) {
    return {
      labels: [goal.name],
      datasets: [
        {
          label: "Current amount",
          type: "bar",
          backgroundColor: "blue",
          data: [goal.amount],
        },
        {
          label: "Remaining",
          type: "bar",
          backgroundColor: "rgb(240, 240, 240)",
          data: [goal.threshold - goal.amount],
        },
      ],
    };
  } else {
    return {
      labels: [goal.name],
      datasets: [
        {
          label: "Goal",

          type: "bar",
          backgroundColor: "green",
          data: [goal.threshold],
        }
      ],
    };
  }
}
export function GoalCompletion({show, onClose}){
  // const [show, setShow] = useState(true);
  // const handleClose= async(event)=>{
  //   setShow(false);
  // }
  return <>
    <Modal show={show} onHide={onClose}>
<Modal.Header closeButton>
  <Modal.Title>Congratulations</Modal.Title>
</Modal.Header> 
<Modal.Body>
    <p>You have completed one goal: {show.name} by saving {show.threshold.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                currencyDisplay: 'symbol'
            })}</p>
  </Modal.Body>
<Modal.Footer>
  <Button variant="secondary" onClick={onClose}>
    Close
  </Button>
</Modal.Footer>
</Modal>
  </>
}
export default function Goal({ goal , view, setView}) {
  const [chart, setChart] = useState(initChart(goal));
  const [change, setChange] = useState(false);
  const [factor, setFactor] = useState(1);
  const [complete, setComplete] = useState(false);
//  const [submit, setSubmit] = useState(false);
  const handleSubmit =()=>{
    if (goal.amount + change* factor <= 0){
      alert ("Invalid input: New current amount must be larger than 0")
    }
    else{
      const budgetItem = {
        id: goal._id,
        change: change * factor,
      };

     fetch("http://localhost:5000/goal/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetItem),
      })
        .then((response) => response.json())
        .then((updated) => {
          console.log(updated);
          setChange(false);
          if (updated.threshold <= updated.amount){
          setComplete(updated);
          
          }
          else{
            setChart(initChart(updated));
          }

          const element = document.getElementById(goal._id);
          element.value = "";
        })
        .catch((error)=> alert(error))
      }
  
}
  useEffect(() => {

    //validate input
    if (change) {
      const budgetItem = {
        id: goal._id,
        change: change * factor,
      };

     fetch("http://localhost:5000/goal/transfer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(budgetItem),
      })
        .then((response) => response.json())
        .then((updated) => {
          console.log(updated);
          setChange(false);
          setChart(initChart(updated));
          const element = document.getElementById("transfer");
          element.value = "";
        });
    }
  }, []);

  return (
    <>
      {complete && <GoalCompletion show={complete} onClose={(e)=> window.location.reload()}/>}
    <div className={styles.row}>
<div className={styles.flex}>
      <h2>{goal.name}</h2>
      <h2 className={styles.right}>{goal.threshold.toLocaleString('en-US', {
                style: 'currency',
                currency: 'USD',
                currencyDisplay: 'symbol'
            })}</h2>
      </div>
      <div className={styles.flex}>
      <p>Deadline: {goal.due_date}</p>
 <div className={styles.right}>
        <select onChange={(e) => setFactor(e.target.value)}>
          <option value={1}>Transfer in </option>
          <option value={-1}>Transfer out</option>
        </select>

        <input required
          id={goal._id}  type="number" placeholder="$0.00"
          
          onChange={(e) => setChange(e.target.value)}
        ></input>
        <button onClick={handleSubmit}>+</button>
        </div>
      </div>
      <div>
        {chart&& <Chart
          type="bar"
          style={{ position: "relative" }}
          data={chart}
          options={{
            maintainAspectRatio: false,
            responsive: false,

            barThickness: 30,
            indexAxis: "y",

            scales: {
              x: {
                stacked: true,
               // display: false,
              },
              y: {
                min:0,
                clip: false,
                display: false,
                stacked: true,
              },
            },
          }}
        />}
      </div>
      </div>
    </>

  );
}
