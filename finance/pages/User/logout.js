import {useState, useEffect} from "react"
import { useRouter } from 'next/router';

async function LogUserOutServer()
{

    router = useRouter();

    var DebugMode = true;

    function msg(message)
    {
        if(DebugMode)
        {
            console.log(message);
        }
    }

    try{
        const usertoken = sessionStorage.getItem('usertoken');
        msg("Usertoken: " + usertoken);

        if(usertoken == null)
        {
            return {LogoutStatus: true};
        }
        
        const usertokenJson =
        {
            _usertoken: usertoken
        }

        const response = await fetch("http://localhost:5000/user/usertoken", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(usertokenJson),
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

                return {LoginStatus: true};
            }
            else
            {
                //sessionStorage.setItem('usertoken',null);
                return {LoginStatus: false};  
            }    
        }else
        {
            console.error("Error:", response.status);
            //sessionStorage.setItem('usertoken',null);
            return {LoginStatus: false};
        }

    }catch(error){
        //sessionStorage.setItem('usertoken',null);
        return {LoginStatus: false};
    }
}

export default function UserLogOut()
{
    const router = useRouter();
    sessionStorage.setItem('usertoken', "");
    localStorage.setItem('usertoken', "");
    router.push('/User/login');      
}