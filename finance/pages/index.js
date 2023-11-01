import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';

export default function Home() {
  
  

  return (
    <>
    <Head>
      <title>Golden Finance</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
        <h1>Golden Finance</h1>

        <Link href="/user/login">Login</Link><br></br>
        <Link href="/user/signup">Sign Up</Link><br></br>
        <Link href="/">Back to home</Link><br></br>
    </>
  );
}
