import React, { useEffect, useState } from "react";

import "bootstrap/dist/css/bootstrap.min.css";
//import Button from 'react-bootstrap/Modal';
import Button from "react-bootstrap/Button";
import { UserId } from "../User/verification";
import AddGoal from "./AddGoal";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import Goal from "./Goal";
import styles from "../../styles/Home.module.css";

import { Footer, Nav } from "../dashboard";

export default function Goals() {
  //const user_id = UserId().user_id;

  const [add, setAdd] = useState(false);
  const [user_id, setUserId] = useState(0);
  const handleAdd = () => setAdd(true);
  const [view, setView] = useState(true);
  const [complete, setComplete] = useState([]);
  const [active, setActive] = useState([]);

  useEffect(() => {

    function checkLoginStatus() {
        var userLoggedIn = UserId();
        setUserId(userLoggedIn.user_id);
        if(userLoggedIn.LoginStatus == false)
        {
            router.push('/');
        }
    }
  
    checkLoginStatus(); // Call the function to check login status when the component mounts
  })

  const fetcher = () => {
    
    fetch(
      `http://localhost:5000/${view ? "active" : "complete"}_goals/${user_id}`
    )
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data);
   
        if (view){
          setComplete([...data]);
          setActive(false);
        }
        else{
          setComplete(false);
          setActive([...data]);
        }

      })
      .catch((error) => console.error(error));
  };

  useEffect(() => {
    fetcher();
  }, [user_id, add, view]);

  return (
    <>
      
      <div className={styles.container}>

        <Nav />
        <div className={styles.page}>
          <p className={styles.title}>Financial Goals</p>
          <div className={styles.right}>
            <Button
              style={{ width: 100 }}
              variant="primary"
              onClick={handleAdd}
            >
              Add goal
            </Button>
          </div>
          <ButtonGroup>
            <Button
              variant="secondary"
              disabled={view}
              onClick={(e) => setView(true)}
            >
              Active
            </Button>
            <Button
              variant="secondary"
              disabled={!view}
              onClick={(e) => setView(false)}
            >
              Completed
            </Button>
          </ButtonGroup>
          {add && <AddGoal show={add} setShow={setAdd} user_id={user_id} />}

         { complete && complete.map((item) => <Goal goal={item} />)}
             {  active && active.map((item) => <Goal goal={item} view={view} setView={setView} />)}
          {active[0] && !active[0].threshold && <div className={styles.input}>Set your first financial goal here!!</div>
              }
          <Footer />
        </div>
      </div>
    </>
  );
}
