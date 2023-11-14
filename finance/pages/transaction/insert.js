import React, { useContext, useState } from "react";
import { useRouter } from 'next/router';

import VerifyNewUserCredentials from "./verification";
import {Layout} from "../../components/header"

var SignUpErrorMessage = "what happend";

export default function InserTransactionData() {

    var debug = true;
    function msg(message)
    {
        if(debug == true)
        {
            console.log(message);
        }
    }

    const router = useRouter();

    //Ensures log in status.
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
    }, []); // Empty dependency array ensures the effect runs once after the initial render
    
    const [form, setForm] = useState({
        fileUrl: "",
    });
  
    function updateForm(value) 
    {
        return setForm((prev) => {
        return { ...prev, ...value };
        });
    }

    async function insertTransaction(newTransaction)
    {
      var debugMode = true;

      function msg(message)
      {
        if(debugMode == true)
        {
          console.log(message);
        }

      }

      try{
        const response = await fetch("http://localhost:5000/users/add", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(newUser),
          })
            .catch(error => {
            window.alert(error);
            return;
          });

        if(response.ok)
        {
          msg("Response was okay");
          const data = await response.json();
          msg("Response: " + data);
          if(data._usertoken != "")
          {
            return data._usertoken;
          }else
          {
            return false;
          }
        }else
        {
          console.error("Error:", response.status);
          return false;
        }
      } catch (error)
      {
          console.error("Network error:", error.message);
          return false;
      }

    }

    async function onSubmit(e) {

      SignUpErrorMessage = "";

      e.preventDefault();
      // When a post request is sent to the create url, we'll add a new record to the database.
      const newUser = { ...form };

      const UserVerificaiton = await VerifyNewUserCredentials(newUser);
      if(UserVerificaiton.passed == false)
      {  
        SignUpErrorMessage = UserVerificaiton.message;
        setForm({ username: "", password: ""});
        return;
      }

      const insertValidation = await insertUser(newUser);
      console.log(insertValidation);
      if(insertValidation != false)
      {
        sessionStorage.setItem('usertoken', insertValidation);
        localStorage.setItem('usertoken', insertValidation);
        router.push('/');
      }else
      {
        sessionStorage.setItem('usertoken', "");
        localStorage.setItem('usertoken', "");
      }

      setForm({ username: "", password: ""});
  }

  return (
  
  <Layout>
      <div>
        <h3>Sign Up</h3>
        <h1>{SignUpErrorMessage}</h1>
        <form onSubmit={onSubmit}>
          <div className="form-group">
            <label htmlFor="password">Username</label>
            <input
              type="text"
              className="form-control"
              id="username"
              value={form.username}
              onChange={(e) => updateForm({ username: e.target.value })}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="text"
              className="form-control"
              id="password"
              value={form.password}
              onChange={(e) => updateForm({ password: e.target.value })}
            />
          </div>
          <div className="form-group">
            <input
              type="submit"
              value="Create person"
              className="btn btn-primary"
            />
          </div>
        </form>
      </div>
      </Layout>
      );
}