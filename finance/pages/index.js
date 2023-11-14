import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Link from 'next/link';
import { UserLoggedIn } from './user/verification';
import React, { useState, useEffect } from "react";

function UserLoggedInHome()
{
  return (
    <>
        <Link href="/user/logout">Log Out</Link><br></br>
    </>
  );
}
function UserLoggedOutHome()
{
  return (
    <>
        <Link href="/user/login">Login</Link><br></br>
        <Link href="/user/signup">Sign Up</Link><br></br>
        <Link href="/">Back to home</Link><br></br>
    </>
  );
}



export default function Home() {



  const [loginBasedHome, setLoginBasedHome] = useState(null); // Initialize loginBasedHome with null

  useEffect(() => {
    async function checkLoginStatus() {
      const userLoggedIn = await UserLoggedIn();
      console.log(userLoggedIn);
      const componentToRender = userLoggedIn.LoginStatus ? UserLoggedInHome() : UserLoggedOutHome();
      setLoginBasedHome(componentToRender); // Set the component based on user's login status
    }

    checkLoginStatus(); // Call the function to check login status when the component mounts
  }, []); // Empty dependency array ensures the effect runs once after the initial render

  if (loginBasedHome === null) {
    // Render loading state if loginBasedHome is still null (while waiting for the API response)
    return <div>Loading...</div>;
  }

  return (
    <>
    <Head>
      <title>Golden Finance</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>
        <h1>Golden Finance</h1>
        {loginBasedHome}
    </>
  );
}
