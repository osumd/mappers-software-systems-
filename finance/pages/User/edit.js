import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';

 export default function Edit() 
 {
    const router = useRouter();
    const { id } = router.query;

  
    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    useEffect(() => {
        async function fetchData() 
        {
            const response = await fetch(`http://localhost:5000/user/${id}`);

            if (!response.ok) {
                const message = `An error has occurred: ${response.statusText}`;
                return;
            }
            const user = await response.json();
            console.log(user);
            if (!user) {
              console.log(`User with id ${id} not found`);
                return;
            }
            setForm(user);
        }
        if(id)
        {
          fetchData();
        }
        
        return;
    }, [id, router]);


  // These methods will update the state properties.
    function updateForm(value) {
        return setForm((prev) => {
            return { ...prev, ...value };
        });
    }
    
    async function onSubmit(e) {

        e.preventDefault();

        const user = {
            username: form.username,
        };
        console.log(user);
    }
  if(form.username == '')
  {
    return null;
  }
  // This following section will display the form that takes input from the user to update the data.
 return (
   <div>
     <h3>Update User</h3>
     <form onSubmit={onSubmit}>
       <div className="form-group">
         <label htmlFor="name">Username: </label>
         <input
           type="text"
           className="form-control"
           id="name"
           value={form.username}
           onChange={(e) => updateForm({ username: e.target.value })}
         />
       </div>
       <br />
       <div className="form-group">
         <input
           type="submit"
           value="Update User"
           className="btn btn-primary"
         />
       </div>
     </form>
   </div>
 );
}

//second way to prevent anything from coming in.
// export async function getServerSideProps(context) {
//   const { id } = context.query;

//   // Fetch data based on the id parameter
//   // Example: const user = await fetchData(id);

//   // Pass fetched data to the component as props
//   return {
//     props: {
//       user: {
//         id, // Pass id to the component
//         // Other user data fetched from your API or database
//       },
//     },
//   };
// }