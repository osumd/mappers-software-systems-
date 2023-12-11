import Head from 'next/head'
import { useEffect } from 'react'

import styles from '../../styles/Home.module.css'
import {Router} from 'next';
import { UserLoggedIn } from '../User/verification';
import { useRouter } from 'next/router';


export default function Home() {

    var router = useRouter();
    var Debug = true;
    var userLoggedIn ={
        LoginStatus: false,
        user_id: 0,
    };

    function msg(message)
    {
        if(Debug == true)
        {
            console.log(message);
        }
    }
    var server_url = "";

    async function handleFileSubmit(event) {
        // prevents the form from accessing '/api' unless fetch fails
        event.preventDefault()

        
        const form = event.currentTarget
        const url = new URL("http://localhost:5000/api/upload");
        const formData = new FormData(form);
        formData.append('user_id', userLoggedIn.user_id);
        msg(formData);

        const fetchOptions = {
            mode: 'cors',
            method: 'post',
            body: formData
        };

        if (formData.get('files').name != '') {

            try {
                const response = await fetch(url, fetchOptions)
        
                const result = response.status
                
                if (result == 200) {
                    alert('File submitted')
                }
                else {
                    alert('File failed to submit')
                }

            } catch (e) { console.log(e) }

        } else {
            alert('File must have title')
        }

        //form.reset();
    }

    async function handleManualSubmit(event) {
        event.preventDefault()
        
        const form = event.currentTarget
        const url = new URL("http://localhost:5000/api/upload")
        const formData = new FormData(form)
        formData.append('user_id', userLoggedIn.user_id);
        
        const fetchOptions = {
            mode: 'cors',
            method: 'post',
            body: formData,
        }
        
        try {
            const response = await fetch(url, fetchOptions)
    
            const result = response.status
            
            if (result == 200) {
                alert('Transaction submitted')
            }
            else {
                alert('Transaction failed to submit')
            }

        } catch (e) { console.log(e) }
    }

    useEffect(() => {

        async function checkLoginStatus() {
            userLoggedIn = await UserLoggedIn();
            if(userLoggedIn.LoginStatus == false)
            {
                router.push('/');
            }
        }
      
        checkLoginStatus(); // Call the function to check login status when the component mounts
    })

    return (
        <>
            <Head>
                <title>Add Transactions</title>
            </Head>
            <main className={styles.container}>

            <div className={styles.nav}>
                <a href="/goal/DashboardGoal">Goals</a>
                <a href="/upload/upload">Upload</a>

                <div className={styles.navcenter}>
                    <a href="/dashboard">Dashboard</a>
                </div>
                <div className={styles.navright}>
                    <a href="/User/logout">Logout</a>
                    <a href="">Search</a>
                </div>
            </div>



                <div className={styles.body}>
                    <div className={styles.upload_flex_child}>
                        <h3>Upload Financial Documentation</h3>

                        <form className={styles.uploadbox} onSubmit={handleFileSubmit} encType='multipart/form-data'>
                            <input type='file' name='files'></input>
                            <button>Upload Financial CSV</button>
                        </form>

                    </div>
                    <div className={styles.upload_flex_child}>
                        <h3>Type in Transaction</h3>

                        <form onSubmit={handleManualSubmit} className="manualForm" encType='multipart/form-data'>
                            <table>
                                <tbody>
                                    <tr>
                                        <td>Description</td>
                                        <td><input type='text' name='Description' pattern="^[a-zA-Z0-9\s]*$" title="Enter a valid description" required /></td>
                                    </tr>
                                    <tr>
                                        <td>Posting Date</td>
                                        <td><input type='text' name='PostingDate' pattern="^(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/\d{4}$" title="Enter a valid date (month/day/year: 01/01/2000)" required /></td>
                                    </tr>
                                    <tr>
                                        <td>Amount</td>
                                        <td><input type="text" name="Amount" pattern="\d+(\.\d{1,2})?" title="Enter a valid amount" required  /></td>
                                    </tr>
                                </tbody>
                            </table>

                            <button>Submit Transaction</button>
                        </form>
                    </div>
                </div>

                <div className={styles.foot}>
                    <footer>
                        Golden Mapper Industries (copyright 2027)
                    </footer>
                </div>

            </main>
        </>
    )
}
