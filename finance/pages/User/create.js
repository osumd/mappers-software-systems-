import React, { useState } from "react";
import VerifyUser from "./verification";
import Link from 'next/link';
import Layout from "../../components/header"
import ErrorStatus from "../../components/ErrorMessage"

export default function Create() {
    
   

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
        // This function will handle the submission.
    function onSubmit(e) {
        // Set up timeout functionality.

        

        e.preventDefault();
        // When a post request is sent to the create url, we'll add a new record to the database.
        const newUser = { ...form };
        
        const UserVerificaiton = VerifyUser(newUser);
        

        if(UserVerificaiton == false)
        {
          var UserVerificationError = "Username or Password does not meet syntax requirements. Password must be atleast 12 characters long, contain atleast one number,special character and upper case letter.";
          ErrorStatus.raiseError(UserVerificationError);
          setForm({ username: "", password: ""});
        }

        return;

        fetch("http://localhost:5000/users/add", {
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
        

        setForm({ username: "", password: ""});
    }


    return (<Layout>
        <div>
          <h3>Sign Up</h3>
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