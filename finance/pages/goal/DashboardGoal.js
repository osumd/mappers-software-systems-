
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router'
import Goal from './Goal';

import { UserId } from '../User/verification';
export default function DashboardGoal(){
  const user_id = UserId().user_id;
  const [list, setList] = useState([])
 const router = useRouter();
  useEffect(() => {
    fetch(`http://localhost:5000/goals/${user_id}`)
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