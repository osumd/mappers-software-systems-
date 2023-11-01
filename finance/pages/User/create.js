import React, { useContext, useState } from "react";
import VerifyUser from "./verification";
import {Layout} from "../../components/header"
import {Error_Data} from "../../root/GlobalComponents/ErrorContext"

var SignUpErrorMessage = "";

export default function Create() {

    const {error, raiseError} = useContext(Error_Data);
    

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
        async function onSubmit(e) {

        SignUpErrorMessage = "";
        // Set up timeout functionality.
        e.preventDefault();
        // When a post request is sent to the create url, we'll add a new record to the database.
        const newUser = { ...form };

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

        console.log(await response.json());

        return;

        const UserVerificaiton = VerifyUser(newUser);
        if(UserVerificaiton == false)
        {  
          SignUpErrorMessage = "Login credentials did not match criterium.";
          setForm({ username: "", password: ""});
          return;
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