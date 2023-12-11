import React, { useContext, useState, useEffect } from "react";
import { useRouter} from 'next/router';

import VerifyNewUserCredentials from "./verification";
import { UserLoggedIn } from '../User/verification';
import {Layout} from "../../components/header"

import styles from "../../styles/User.module.css";

//This Error_Data is a context module and just serves as an example for global state.
// import {Error_Data} from "../../root/GlobalComponents/ErrorContext"

var SignUpErrorMessage = "";

export default function Create() {
    const router = useRouter();

    var userLoggedIn ={
      LoginStatus: false,
      user_id: 0,
    };
    useEffect(() => {

      async function checkLoginStatus() {
          userLoggedIn = await UserLoggedIn();
          console.log(userLoggedIn);
          if(userLoggedIn.LoginStatus == true)
          {
              router.push('/dashboard');
          }
      }
    
      checkLoginStatus(); // Call the function to check login status when the component mounts
    });
    
    //This Error_Data is a context module and just serves as an example for global state.
    // const {error, raiseError} = useContext(Error_Data);
    
    const [form, setForm] = useState({
        username: "",
        password: "",
    });
  
    function updateForm(value) {
        return setForm((prev) => {
        return { ...prev, ...value };
        });
    }



    async function insertUser(newUser)
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
        router.push('/dashboard');
      }else
      {
        sessionStorage.setItem('usertoken', "");
        localStorage.setItem('usertoken', "");
      }

      setForm({ username: "", password: ""});
  }

  return (
      <div className={`${styles.center} ${styles.pad5} ${styles.full}`}>
        <div className={styles.sspace}>
          <p>{SignUpErrorMessage}</p>
          </div>
          <div className={`${styles.sig}`}>Golden Mappers Industries</div>
        <form onSubmit={onSubmit}>
          <div className={`${styles.center} ${styles.pad5} form-group`}>
            <label htmlFor="password">Username</label>
            <input
              type="text"
              className={`${styles.sbox}  form-control`}
              id="username"
              value={form.username}
              onChange={(e) => updateForm({ username: e.target.value })}
            />
          </div>
          <div className={`${styles.center} ${styles.pad5} form-group`}>
            <label htmlFor="password">Password</label>
            <input
              type="text"
              className={`${styles.sbox}  form-control`}
              id="password"
              value={form.password}
              onChange={(e) => updateForm({ password: e.target.value })}
            />
          </div>
          <div className={`${styles.center} ${styles.pad5} form-group`}>
            <input
              type="submit"
              value="Create person"
              className={`${styles.bbox} btn btn-primary`}
            />
          </div>

          <div className={`${styles.alrdy} ${styles.center}`}>
          Already have an account?
          <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                router.push("/User/login");
              }}
            >
              Log In
            </button>
            </div>
        </form>
        <div className={styles.foot}>
            <footer>Golden Mapper Industries (copyright 2027)</footer>
          </div>
      </div>
      );
}