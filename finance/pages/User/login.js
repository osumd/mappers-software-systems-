import React, { useState } from "react";
import {Layout} from "../../components/header";
import VerifyUser from "./verification";
import { useRouter } from 'next/router';

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
        const uservalidation = VerifyUser(user);
        if(uservalidation == false){return;}

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
              setForm({ username: "", password: ""});

            }else
            {
              localStorage.setItem('usertoken', "");
              sessionStorage.setItem('usertoken', "");
              setForm({ username: "", password: ""});
            }
            
          }else
          {
            console.error("Error:", response.status);
            localStorage.setItem('usertoken', "");
            sessionStorage.setItem('usertoken', "");
          }
        } catch (error)
        {
            console.error("Network error:", error.message);
        }
        return;
    }

    return (
    
    <Layout>
        <div>
          <h3>Sign In</h3>
          <form onSubmit={onLogin}>
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