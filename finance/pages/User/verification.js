
async function PostFetch({ipaddress, body})
{
    try{
        const response = await fetch(ipaddress, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
        })
          .catch(error => {
            window.alert(error);
          return null;
        });

        if(response.ok)
        {
          const data = await response.json();

          return data;  
        }else
        {
          console.error("Error:", response.status);
          return null;
        }
      } catch (error)
      {
          console.error("Network error:", error.message);
          return null;
      }
}

export default async function VerifyNewUserCredentials(UserCredentials)
{
    
   

    const UsernameVerification = /^([A-z\d!-/:-@]){1,}/;
    const PasswordVerification = /^(?=.*[A-Z])(?=.*[!-/:-@])(?=.*\d)([A-z\d!-/:-@]){8,}/;
    const PasswordTest = PasswordVerification.test(UserCredentials.password);
    const UsernameTest = true;

    if(PasswordTest == false || UsernameTest == false)
    {
        return {passed: false, message: "Error credentials not valid. Please enter a valid password atleast 8 characters, include atleast one uppercase, one number and one symbol."};
    }


    const usernameJson = {
        username: UserCredentials.username
    }
    const usernameExists = await PostFetch({ipaddress:"http://localhost:5000/user/exist", body: usernameJson});

    if(usernameExists == true)
    {
        return {passed: false, message: "User already exists."};
    }

    return {passed: (PasswordTest & UsernameTest), message: "Error credentials not valid. Please enter a valid password atleast 8 characters, include atleast one uppercase, one number and one symbol."};
}

export function UserId()
{
    var usertoken = sessionStorage.getItem('user_id');
    const localusertoken = localStorage.getItem('user_id');
    
    if(localusertoken != "" && localusertoken != null)
    {
        usertoken = localusertoken;
    }
    

    if(usertoken == "" || usertoken == null)
    {
        msg("User token was empty.");
        return {LoginStatus: false, user_id:0};
    }

    return {LoginStatus: true, user_id: usertoken};
}

export async function UserLoggedIn()
{

    var DebugMode = true;

    function msg(message)
    {
        if(DebugMode)
        {
            console.log(message);
        }
    }

    try{
        var usertoken = sessionStorage.getItem('usertoken');
        const localusertoken = localStorage.getItem('usertoken');
        
        msg("Session Token: " + usertoken + "Local Token: " + localusertoken);

        if(localusertoken != "" && localusertoken != null)
        {
            usertoken = localusertoken;
        }
        

        if(usertoken == "" || usertoken == null)
        {
            msg("User token was empty.");
            return {LoginStatus: false};
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
            msg(data);
            if(data != null)
            {
                sessionStorage.setItem("user_id", data.user_id);
                localStorage.setItem("user_id", data.user_id);
                return {LoginStatus: data.validation, user_id: data.user_id};
            }
            else
            {
                sessionStorage.setItem("user_id", "");
                localStorage.setItem("user_id", "");
                //sessionStorage.setItem('usertoken',null);
                return {LoginStatus: false, user_id:0};  
            }    
        }else
        {
            msg("Error:" + response.status);
            //sessionStorage.setItem('usertoken',null);
            
            return {LoginStatus: false, user_id: 0};
        }

    }catch(error){
        //sessionStorage.setItem('usertoken',null);
        return {LoginStatus: false, user_id: 0};
    }
}

export async function VisibleUserData()
{
    
    var DebugMode = true;

    function msg(message)
    {
        if(DebugMode)
        {
            console.log(message);
        }
    }

    try{
        var usertoken = sessionStorage.getItem('usertoken');
        const localusertoken = localStorage.getItem('usertoken');
        
        msg("Session Token: " + usertoken + "Local Token: " + localusertoken);

        if(localusertoken != "" && localusertoken != null)
        {
            usertoken = localusertoken;
        }
        

        if(usertoken == "" || usertoken == null)
        {
            msg("User token was empty.");
            return {LoginStatus: false};
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
            msg(data);
            if(data != null)
            {
                return {LoginStatus: data.validation};
            }
            else
            {
                //sessionStorage.setItem('usertoken',null);
                return {LoginStatus: false};  
            }    
        }else
        {
            msg("Error:" + response.status);
            //sessionStorage.setItem('usertoken',null);
            return {LoginStatus: false};
        }

    }catch(error){
        //sessionStorage.setItem('usertoken',null);
        return {LoginStatus: false};
    }
}