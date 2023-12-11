import React, { useState } from "react";
import {Layout} from "../../components/header";
import { useRouter } from 'next/router';
import styles from "../../styles/User.module.css";
var SignInErrorMessage = "";

export default function Create() {

    const router = useRouter();

    const [form, setForm] = useState({
        username: "",
        password: "",
    });
        // const navigate = useNavigate();
        // These methods will update the state properties.
    function updateForm(value) {
        return setForm((prev) => {
        return { ...prev, ...value };
        });
    }
    async function onLogin(e) {

        // Set up timeout functionality.
        e.preventDefault();
        const user = { ...form };


        try{
          const response = await fetch("http://localhost:5000/user/login", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(user),
          })
            .catch(error => {
            window.alert(error);
            SignInErrorMessage = "Response from server terminated.";
            return;
          });

          if(response.ok)
          {
            const data = await response.json();
            console.log(data);
            if(data != null)
            {

              sessionStorage.setItem('usertoken', data._usertoken);
              localStorage.setItem('usertoken', data._usertoken);
              if(data._usertoken != "")
              {
                console.log(data);
                router.push('/');
              }
              SignInErrorMessage = "Account not found.";
              setForm({ username: "", password: ""});

            }else
            {
              localStorage.setItem('usertoken', "");
              sessionStorage.setItem('usertoken', "");
              setForm({ username: "", password: ""});
              SignInErrorMessage = "Account not found.";
            }
            
          }else
          {
            console.error("Error:", response.status);
            localStorage.setItem('usertoken', "");
            sessionStorage.setItem('usertoken', "");
            SignInErrorMessage = "Network error.";
          }
        } catch (error)
        {
            console.error("Network error:", error.message);
            SignInErrorMessage = "Network Error.";
        }
        return;
    }



    return (
        
        <div className={`${styles.center} ${styles.pad5} ${styles.full}`}>
          <div className={styles.sspace}>
          <p>{SignInErrorMessage}</p>
          </div>
          <div className={`${styles.sig}`}>Golden Mappers Industries</div>
          <form onSubmit={onLogin}>
            <div className={`${styles.center} ${styles.pad5} form-group`}>
              <label htmlFor="password">Username</label><br></br>
              <input
                type="text"
                className={`${styles.sbox}  form-control`}
                id="username"
                value={form.username}
                onChange={(e) => updateForm({ username: e.target.value })}
              />
            </div>
            <div className={`${styles.center} ${styles.pad5} form-group`}>
              <label htmlFor="password">Password</label><br></br>
              <input
                type="text"
                className={`${styles.sbox} form-control`}
                id="password"
                value={form.password}
                onChange={(e) => updateForm({ password: e.target.value })}
              />
            </div>
            <div className={`${styles.center} ${styles.pad5} form-group`}>
              <input
                type="submit"
                value="Log In"
                className={`${styles.bbox} btn btn-primary`}
              />
              <div className={`${styles.center} form-group`}>
            
            <div className={`${styles.alrdy} ${styles.center}`}>
            Dont have an account?
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => {
                router.push("/User/signup")
              }}
            >
              Sign Up
            </button>
            </div>
            </div>
            </div>
            
          </form>
          
          <div className={styles.foot}>
            <footer>Golden Mapper Industries (copyright 2027)</footer>
          </div>
        </div>
        );
}