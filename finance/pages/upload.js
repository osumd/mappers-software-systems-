import Head from 'next/head'
import styles from '../styles/Home.module.css'
import { useEffect } from 'react'

export default function Home() {
    useEffect(() => {
        const form = document.querySelector('form')
        form.addEventListener('submit', handleSubmit)
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
                                Text field title: <input type="text" name="title" />
                                <input type="file" name="files"></input>
                                <button>Upload Financial CSV</button>
                            </form>
                    </div>
                    <div className={styles.upload_flex_child}>
                        <h3>Type in Transactions</h3>
                            <form action='http://localhost:5000/api/upload' method='post' encType='multipart/form-data'>
                                Text field title: <input type="text" name="title" />
                                <input type="file" name="files"></input>
                                <button>Upload Financial CSV</button>
                            </form>
                    </div>
                </div>
            </main>
        </>
    )
}

function handleSubmit(event) {
    const form = event.currentTarget
    const url = new URL(form.action);
    const formData = new FormData(form);
    const fetchOptions = {
        method: form.method,
        body: formData,
    };

    if (formData.get("title") != "") {
        fetch(url, fetchOptions)
        alert("File submitted")
    }
    alert("File must have title")

    // prevents the form from accessing '/api' unless fetch fails
    event.preventDefault()
}
