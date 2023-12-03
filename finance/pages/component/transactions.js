import React, { useEffect, useState } from 'react';
export function Item({transaction}){

  return (
    <>
    <p>{transaction.date}</p>
    <h3>{transaction.description}</h3>
    <p>{transaction.category}</p>
    <p>{transaction.amount}</p>
    </>
  )
}
export default function Transactions({category}){
  const [list, setList] = useState([])
  useEffect(() => {
    fetch(`http://localhost:5000/myTransactions/`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
  
        console.log(data)
        setList(data);
      })
      .catch(error=> console.error(error))
  }, [category]);
return (
  <>
  {list.map(item=> 
    <Item transaction={item}/>)}
  </>
)

}