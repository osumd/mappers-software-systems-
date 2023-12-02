import React, { useEffect, useState } from 'react';
export function Item({goal}){

  return (
    <>
    <p>{goal.name}</p>
    <p>{goal.threshold}</p>
    <p>{goal.amount}</p>
    </>
  )
}
export default function Goals({category}){
  
  const [list, setList] = useState([])
  useEffect(() => {
    fetch(`http://localhost:5000/goals/`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
  
        console.log(data)
        setList(data)
      })
      .catch(error=> console.error(error))
  }, [category]);
return (
  <>
  {list.map(item=> 
    <Item goal={item}/>)}
  </>
)

}