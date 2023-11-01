import Head from 'next/head'
import styles from '../styles/Home.module.css'

function OnFileSubmit() {
    const form = document.querySelector('form')
    form.addEventListener('submit', handleSubmit)

    let input = document.querySelector('input')
    const files = input.files
    if (files.length > 0) {
        console.log('file uploaded')
        let main = document.querySelector('main')
        while (main.hasChildNodes()) {
            main.removeChild(main.firstChild)
        }
        let h2 = document.createElement('h2')
        h2.textContent = 'Financial Information Processing'
        main.appendChild(h2)
    }
}

export default function Home() {
    return (
        <>
            <Head>
                <title>Upload Financial Information</title>
            </Head>
            <main className={styles.main}>
                <h2>Upload Financial Information</h2>
                <div className={styles.form_container}>
                    <form action='http://localhost:5000/api' method='post' encType='multipart/form-data'>
                        <input type='file'></input>
                        <button onClick={OnFileSubmit}>Upload Financial CSV</button>
                    </form>
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

    fetch(url, fetchOptions);

    // prevents the form from accessing '/api'
    event.preventDefault()
    console.log('submit')
}
