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
import 'bootstrap/dist/css/bootstrap.min.css';

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
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Modal';

function initChart(goal){


  if (  goal.amount < goal.threshold){

    return {
      labels: [goal.name],
      datasets: [
          {
            label: "Current amount",
            type:'bar',
              backgroundColor: 'blue',
              data: [goal.amount]
  
          },
          {
            label: "Remaining",
            type:'bar',
              backgroundColor: 'rgb(240, 240, 240)',
              data: [goal.threshold-goal.amount]
          },
  
      ]
    }
  
  }

  else{
    return {
      labels: [goal.name],
      datasets: [
          {
            label: "Threshold",

            type:'bar',
              backgroundColor: 'blue',
              data: [goal.threshold]
  
          },
          {
            label: "",
            type:'bar',
              backgroundColor: 'green',
              data: [goal.amount - goal.threshold]
          },
  
      ]
    }
  
  }
}
export function Goal({goal}){
   const [chart, setChart] = useState(initChart(goal));
   const [change, setChange] = useState (false);
   const [factor, setFactor] = useState (1);

  
  const handleSubmit = async (event) => {
    //prevent page reload
      event.preventDefault();

    //validate input
      if(change){

          const budgetItem = {
              id: goal._id,
              change: change * factor
          };
      
          try{
              const response = await fetch("http://localhost:5000/goal/transfer", {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(budgetItem),
              });

              if (response.ok){
                const updated = await response.json();
                console.log(updated)
                setChart(initChart(updated))
                 
              } else {
                  console.error("Failed to upload budget item");
              }
          } catch (error){
              console.error("Error while uploading budget item: ", error);
          }
          const element = document.getElementById('transfer');
          element.value = ''
      }
  
    }

  
    return (
        <>
        <h3>{goal.name}</h3>
        <p>Deadline: {goal.due_date}</p>
        <span style={{float: 'right'}}>
        <select onChange={(e)=> setFactor(e.target.value)}>
          <option value={1}>Transfer in </option>
          <option value={-1}>Transfer out</option>
        </select>
        
        <input id="transfer" type="number" onChange={(e) => setChange(e.target.value)}></input>
        <button onClick={handleSubmit}>+</button>
        </span>
        <div>
        <Chart type='bar'style={{position: 'relative'}} 
        data={chart} 
        options={
          
          { 
            tooltips: {
              enabled: true,
              mode: 'single',
              callbacks: {
                label: function(tooltipItems, data) {
                  var text = tooltipItems.datasetIndex === 0 ? 'some text 1' : 'some text 2'
                  return tooltipItems.yLabel + ' ' + text;
                }
              }
            },
            maintainAspectRatio:false,
            responsive: false,
        
          plugins: {
            tooltips:{
              callbacks: {
                label: function(tooltipItems, data) {
                  var text = tooltipItems.datasetIndex === 0 ? 'some text 1' : 'some text 2'
                  return tooltipItems.yLabel + ' ' + text;
                }
              }
            },

          
            legend:{display: false}
          },
          barThickness: 10,
          indexAxis: 'y',
          layout: {
            padding: -1
        },
          scales: {

            x: {
                stacked: true,
                display: false
            },
            y: {
            clip:false,
              display: false,
                stacked: true
            }

        }}}/>
        </div>

        </>
    )



}
export default function Goals(){
  
  const [add, setAdd] = useState(false);
  const handleClose = () => setAdd(false);
  const handleAdd = () => setAdd(true);
  let newGoal={name: 0, threshold: 0, amount:0, due_date: 0}
    const [list, setList] = useState([])
    useEffect(() => {
      fetch(`http://localhost:5000/goals`)
        .then((res) => {
          return res.json();
        })
        .then((data) => {
    
          console.log(data)
          setList(data)
        })
        .catch(error=> console.error(error))
    }, [add]);
    const handleSubmit = async (event) => {
      //prevent page reload
        event.preventDefault();
  
      //validate input
        if(newGoal.name && newGoal.threshold){
          setAdd(false);
        
            try{
                const response = await fetch("http://localhost:5000/goal", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(newGoal),
                });
  
                if (response.ok){
                  console.log(response)
                 for (const [key, values] in Object.entries(newGoal)){
                  newGoal[key] = false;
                 }
                   
                } else {
                    console.error("Failed to upload budget item");
                }
            } catch (error){
                console.error("Error while uploading budget item: ", error);
            }
        }
    
      }
  return (
    <>
     <button onClick={handleAdd}>Add goal</button>
    {list && list.map(item=>
        <Goal goal={item}/>
        )}
          <Modal show={add} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Write down your goal</Modal.Title>
        </Modal.Header> 
       <Modal.Body> <form onSubmit={handleSubmit}>
                {/*<input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)}/>*/}
                <div>
                <label>What are you saving for?</label>
                <input required placeholder="Iphone 15" onChange={(e) => newGoal.name=e.target.value}/>
                </div>
                <div>
                <label>Goal: </label>
                <input required type="number" placeholder="$1000.00" onChange={(e) => newGoal.threshold=e.target.value}/>
                </div>
                <div>
                <label>Current amount</label>
                <input type="number"  value={0} onChange={(e) => newGoal.threshold=e.target.value}/>
                </div>
                <div>
                <label>Set deadline for yourself</label>
                <input type="date"  onChange={(e) => newGoal.due_date=e.target.value}/>
                </div>
                <button type="submit">Done</button>

            </form></Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
        </Modal>
    </>
)
    }



