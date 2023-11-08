import Head from 'next/head'
import {useEffect} from 'react'

import styles from '../styles/Home.module.css'

export default function Home() {
  function handleFileSubmit(event) {
    const form = event.currentTarget
    const url = new URL(form.action);
    const formData = new FormData(form);
    const fetchOptions = {
      method: form.method,
      body: formData,
    };

    if (formData.get('title') != '') {
      fetch(url, fetchOptions)
      alert('File submitted')
      return
    }
    alert('File must have title')

    // prevents the form from accessing '/api' unless fetch fails
    event.preventDefault()
  }

  function handleManualSubmit(event) {
    const form = event.currentTarget
    const url = new URL(form.action)
    const formData = new FormData(form)
    const fetchOptions = {
        method: form.method,
        body: formData,
    }

    if (formData.get('title') != '' && formData.get('money') != '') {
        fetch(url, fetchOptions)
        alert('Transaction submitted')
    }
    else {
        alert("Title and monetary value may not be empty")
    }

    event.preventDefault()
  }

    useEffect(() => {
        const form = document.querySelector('form')
        form.addEventListener('submit', handleFileSubmit)

        const manualForm = document.querySelector('.manualForm')
        manualForm.addEventListener('submit', handleManualSubmit)
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
                                    <td><input type='text' name='title'/></td>
                                    <td><input type="text" name="money"/></td>
                                    <td><input type="text" name="category"/></td>
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
