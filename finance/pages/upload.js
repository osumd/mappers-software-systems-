import Head from 'next/head';
import styles from '../styles/Home.module.css';

function OnFileSubmit() {
    let input = document.querySelector('input')
    const files = input.files
    if (files.length > 0) {
        console.log('file uploaded')
    }
    let main = document.querySelector('main')
    while (main.hasChildNodes()) {
        main.removeChild(main.firstChild)
    }
    let h2 = document.createElement('h2')
    h2.textContent = "Financial Information Processing"
    main.appendChild(h2)
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
                    <input type='file'></input>
                    <button onClick={OnFileSubmit}>Upload Financial CSV</button>
                </div>
        </main>
        </>
    )
}