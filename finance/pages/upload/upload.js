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

        if (formData.get('title') != '' && formData.get('files').name != '') {

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
        
        const fetchOptions = {
            mode: 'cors',
            method: form.method,
            body: formData,
        }
        
        const transaction = {
            title: formData.get('title'),
            money: formData.get('money'),
        }

        msg("Handling the submission process" + transaction.title + "money:" + transaction.money);
        return;

        if (formData.get('title') != '' && formData.get('money') != '') {
            try {
                const response = await fetch(url, fetchOptions)

                const result = response.status
                
                if (result == 200) {
                    alert('Transaction submitted')
                }
                else {
                    alert('Transaction failed to submit, please try again later')
                }

            } catch (e) { console.log(e) }
        }
        else {
            alert("Title and monetary value may not be empty")
        }
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
            <main className={styles.main}>
                <div className={styles.upload_flex_container}>
                    <div className={styles.upload_flex_child}>
                        <h3>Upload Financial Documentation</h3>

                        <form onSubmit={handleFileSubmit} encType='multipart/form-data'>
                            File name: <input type='text' name='title' />
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
                                        <td>Posting Date</td>
                                        <td>Amount</td>
                                    </tr>
                                    <tr>
                                        <td><input type='text' name='Description' pattern="^[a-zA-Z0-9\s]*$" title="Enter a valid description" required/></td>
                                        <td><input type='text' name='PostingDate' pattern="^(0[1-9]|1[0-2])/(0[1-9]|[12][0-9]|3[01])/\d{4}$" title="Enter a valid description" required/></td>
                                        <td><input type="text" name="Amount" pattern="\d+(\.\d{1,2})?" title="Enter a valid amount" required  /></td>
                                    </tr>
                                </tbody>
                            </table>

                            <button>Submit Transaction</button>
                        </form>
                    </div>
                </div>
            </main>
        </>
    )
}
// (?:([A-Z]+)|([a-z]+)|([\d]+))|([\s]+)+