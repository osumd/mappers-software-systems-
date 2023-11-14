import React, { useState, useEffect } from "react";
import { useRouter } from 'next/router';

 export default function Edit() 
 {
    const router = useRouter();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const visibleUserData = {
      username: ""
    };

    useEffect(() => {
      async function VerifyUserID() {
        const userLoggedIn = await UserLoggedIn();
        msg("Searching for user: " + userLoggedIn);
        if(userLoggedIn.LoginStatus == false)
        {
          msg("User account not logged in, please sign in.");
          router.push('/user/signin');
        }else
        {
          msg("User successfully logged in with usable user_id.");
        }
      }
  
      VerifyUserID(); // Call the function to check login status when the component mounts

        
      return;
    }, []);

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
        
    }

    // This following section will display the form that takes input from the user to update the data.
    return(
    <div>
      <h3>Welcome Back</h3>
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