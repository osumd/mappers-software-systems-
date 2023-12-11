
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Goal from './Goal';

import styles from '../../styles/Home.module.css'

import { UserId } from '../User/verification';
export default function DashboardGoal(){
  const [user_id, setUserId] = useState(0);
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
  const [list, setList] = useState([])
 const router = useRouter();
  useEffect(() => {
    fetch(`http://localhost:5000/active_goals/${user_id}`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        console.log(data)
        setList(data)
      })
      .catch(error=> console.error(error))
  }, );
const handleViewAll= () => {
  router.push('goal/GoalPage');
};
  return(
  <>
   {list[0] ? <Goal goal={list[0]}/>: <p>Click view more to add more goals</p>}
  <button onClick={handleViewAll}>View more</button>


  </>
  )
}