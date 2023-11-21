import Head from 'next/head';
import styles from '../styles/Home.module.css';
import {Layout} from "../components/header"

import Link from 'next/link';
import { UserLoggedIn } from './User/verification';
import React, { useState, useEffect } from "react";
import MyForm from './exampleForm';

import * as ComponentList from './component/componentList';
import Graph from './graph';
function UserLoggedInHome()
{
  return (
    <Layout>
    <div className={styles.container}>
      <Head>
        <title>RocketMoney</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      

      <div className={styles.nav}>
        <Link href="/User/signup">Account</Link>
        <Link href="/user/component">Component</Link>

        <div className={styles.navcenter}>
          <Link href="/">Dashboard</Link>
        </div>
        <div className={styles.navright}>
          <Link href="/search/">Search</Link>
          <Link href="/component/0">Component</Link>
        </div>
      </div>



      <div className={styles.body}>


        
        <div className={styles.randomTray}>
            {ComponentList.Components[0]}
            {ComponentList.Components[1]}
            {ComponentList.Components[2]}
        </div>

        <div className={styles.topHalf}>
          <div>
            
          </div>
  
          <div>
            {}
          </div>
        </div>

        <div className={styles.bottomHalf}>
          <div>
            {}
          </div>

          <div>
          
          </div>
        </div>
          
          {}
          {/* <xyz props={}/>
          {xyz()} */}
      </div>


      <div className={styles.foot}>
        <Graph />
      <footer>
        Golden Mapper Industries (copyright 2027)
      </footer>
      </div>
    
      

      <style jsx>{`
        main {
          padding: 5rem 0;
          margin: 0.5%;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      `}</style>


    </div>
    </Layout>
  );


}

function UserLoggedOutHome()
{
  return (
    <>
        <Link href="/User/login">Log In</Link><br></br>
    </>
  );
}

export default function Home() {

  const [loginBasedHome, setLoginBasedHome] = useState(null); // Initialize loginBasedHome with null

  useEffect(() => {
    async function checkLoginStatus() {
      const userLoggedIn = await UserLoggedIn();
      const componentToRender = userLoggedIn.LoginStatus ? UserLoggedInHome() : UserLoggedOutHome();
      setLoginBasedHome(componentToRender); // Set the component based on user's login status
    }

    checkLoginStatus(); // Call the function to check login status when the component mounts
  }, []); // Empty dependency array ensures the effect runs once after the initial render

  if (loginBasedHome === null) {
    // Render loading state if loginBasedHome is still null (while waiting for the API response)
    return UserLoggedOutHome();
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





