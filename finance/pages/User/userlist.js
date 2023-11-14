import React, { useEffect, useState } from "react";

const User = (props) => (
 <tr>
   <td>{props.user.username}</td>
   <td>{props.user.password}</td>
 </tr>
);

export default function userList() {
 const [users, setUsers] = useState([]);
  // This method fetches the records from the database.
 useEffect(() => {
   async function getUsers() {
     const response = await fetch(`http://localhost:5000/users/`);
      
     if (!response.ok) {
       const message = `An error occurred: ${response.statusText}`;
       window.alert(message);
       return;
     }
      const users = await response.json();
     setRecords(records);
    }
    getUsers();
    return;
 }, [users.length]);
  // This method will delete a record
  // This method will map out the records on the table
 function userList() {
   return users.map((e) => {
     return (
       <User
         user={e}
       />
     );
   });
 }
  // This following section will display the table with the records of individuals.
 return (
   <div>
     <h3>Record List</h3>
     <table className="table table-striped" style={{ marginTop: 20 }}>
       <thead>
         <tr>
           <th>Username</th>
           <th>Password</th>
         </tr>
       </thead>
       <tbody>{userList()}</tbody>
     </table>
   </div>
 );
}