import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useEffect, useState } from 'react';
import Modal from 'react-bootstrap/Modal';

import Button from 'react-bootstrap/Button';
import styles from "../../styles/Home.module.css";
export default function AddGoal({show, setShow, user_id}){

  const [name, setName] = useState(false);
  const [threshold, setThreshold] = useState(false);
  const [amount, setAmount] = useState(false);
  const [deadline, setDeadline] = useState(false);
  const handleClose= async(event)=>{
    setShow(false);
  }
  const handleSubmit = async (event) => {
    //prevent page reload
      event.preventDefault();
   
      if (Date.parse(deadline) <=new Date()){
        alert("Invalid input: target date must be later than the current date");
        return;
      }
      if (amount >=threshold){
        alert ("Invalid input: The current amount must be less than the goal amount")
        return;
      }
      let newGoal={name: name, threshold: threshold, amount:amount, due_date: deadline}
          try{
              const response = await fetch(`http://localhost:5000/addGoal/${user_id}`, {
                  method: "POST",
                  headers: {
                      "Content-Type": "application/json",
                  },
                  body: JSON.stringify(newGoal),
              });

              if (response.ok){
                handleClose();
                
              } else {
                  console.error("Failed to upload budget item");
              }
          } catch (error){
              console.error("Error while uploading budget item: ", error);
          }
      
  
    }
  return (
  <>
  <Modal show={show} onHide={handleClose}>
<Modal.Header closeButton>
  <Modal.Title>Write down your goal</Modal.Title>
</Modal.Header> 
<form onSubmit={handleSubmit}>
<Modal.Body>

        {/*<input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)}/>*/}
        <div>
        <label>What are you saving for?</label>
        <input className={styles.input} required placeholder="Iphone 15" onChange={(e) => setName(e.target.value)}/>
        </div>
        <div>
        <label className={styles.label}>Goal </label>
        <input className={styles.input} required type="number" placeholder="$1000.00" min="0" onChange={(e) => setThreshold(parseFloat(e.target.value))}/>
        </div>
        <div>
        <label>Current amount</label>
        <input className={styles.input} type="number" step="0.01" placeholder="$0" defaultValue="0" min={0} onChange={(e) => setAmount(parseFloat(e.target.value))}/>
        </div>
        <div>
        <label>Set deadline for yourself</label>
        <input className={styles.input} required type="date"  onChange={(e) =>setDeadline(e.target.value)}/>
        </div>


  </Modal.Body>
<Modal.Footer>
  <Button variant="secondary" onClick={handleClose}>
    Close
  </Button>
  <Button variant="primary" type="submit">
    Save Changes
  </Button>
</Modal.Footer>
</form>
</Modal>
  </>
  )
}
