import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from "../components/header"
export default function Home() {
  // TODO: Move <style> tag below into CSS file
  return (
    <Layout>
    <div className={styles.container}>
      <Head>
        <title>RocketMoney</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <div className={styles.nav}>

        <a href=''>Account</a>
        <a href=''>Componenent</a>

        <div className={styles.navcenter}>
          <a href=''>Dashboard</a>
        </div>
        <div className={styles.navright}>
          <a href=''>Search</a>
          <a href=''>Componenent</a>
        </div>
      </div>


      <div className={styles.body}>

      </div>

      <footer>
        Golden Mappers Industries (copyright 2027)
      </footer>







      <style jsx>{`
        main {
          padding: 5rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
        footer {
          position: absolute;
          width: 100%;
          bottom: 0%;
          height: 50px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }
        footer img {
          margin-left: 0.5rem;
        }
        footer a {
          display: flex;
          justify-content: center;
          align-items: center;
          text-decoration: none;
          color: inherit;
        }
        code {
          background: #fafafa;
          border-radius: 5px;
          padding: 0.75rem;
          font-size: 1.1rem;
          font-family:
            Menlo,
            Monaco,
            Lucida Console,
            Liberation Mono,
            DejaVu Sans Mono,
            Bitstream Vera Sans Mono,
            Courier New,
            monospace;
        }
      `}</style>

      <style jsx global>{`
        html,
        body {
          padding: 0;
          margin: 0;
          font-family:
            -apple-system,
            BlinkMacSystemFont,
            Segoe UI,
            Roboto,
            Oxygen,
            Ubuntu,
            Cantarell,
            Fira Sans,
            Droid Sans,
            Helvetica Neue,
            sans-serif;
        }
        * {
          box-sizing: border-box;
        }
      `}</style>
    </div>
    </Layout>
  );
}