import Head from 'next/head'
import { useEffect } from 'react'

import styles from '../styles/Home.module.css'

export default function Home() {
    async function handleFileSubmit(event) {
        // prevents the form from accessing '/api' unless fetch fails
        event.preventDefault()

        const form = event.currentTarget
        const url = new URL(form.action);
        const formData = new FormData(form);
        const fetchOptions = {
            mode: 'cors',
            method: form.method,
            body: formData,
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
    }

    async function handleManualSubmit(event) {
        event.preventDefault()

        const form = event.currentTarget
        const url = new URL(form.action)
        const formData = new FormData(form)
        const fetchOptions = {
            mode: 'cors',
            method: form.method,
            body: formData,
        }

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
        const form = document.querySelector('form')
        form.addEventListener('submit', handleFileSubmit)

        const manualForm = document.querySelector('.manualForm')
        manualForm.addEventListener('submit', async (event) => { await handleManualSubmit(event) })
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
                        <form action='http://localhost:5000/api/upload' method='post' encType='multipart/form-data'>
                            File name: <input type='text' name='title' />
                            <input type='file' name='files'></input>
                            <button>Upload Financial CSV</button>
                        </form>
                    </div>
                    <div className={styles.upload_flex_child}>
                        <h3>Type in Transaction</h3>
                        <form className="manualForm" action='http://localhost:5000/api/upload' method='post' encType='multipart/form-data'>
                            <table>
                                <tbody>
                                    <tr><th>Title/Name</th><th>Monetary Value</th><th>Category</th></tr>
                                    <tr>
                                        <td><input type='text' name='title' /></td>
                                        <td><input type="text" name="money" /></td>
                                        <td><input type="text" name="category" /></td>
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