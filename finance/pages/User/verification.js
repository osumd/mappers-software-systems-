
export default function VerifyUser(UserPackage, VerificationError)
{
    //console.log(UserPackage);
    const UsernameVerification = /^([A-z\d!-/:-@]){6,}/;
    const PasswordVerification = /^(?=.*[A-Z])(?=.*[!-/:-@])(?=.*\d)([A-z\d!-/:-@]){8,}/;
    const PasswordTest = PasswordVerification.test(UserPackage.password);
    //console.log(PasswordTest);
    
    return PasswordTest;
}

export async function UserLoggedIn()
{

    try{
        const usertoken = sessionStorage.getItem('usertoken');
        
        if(usertoken == null)
        {
            return false;
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

                return true;
            }
            else
            {
                //sessionStorage.setItem('usertoken',null);
                return false;  
            }    
        }else
        {
            console.error("Error:", response.status);
            //sessionStorage.setItem('usertoken',null);
            return false;
        }

    }catch(error){
        //sessionStorage.setItem('usertoken',null);
        return false;
    }
}