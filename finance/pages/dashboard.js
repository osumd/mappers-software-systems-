import Head from "next/head";
import styles from "../styles/Home.module.css";
import { Layout } from "../components/header";
import React, { useEffect, useState } from "react";
import Graph from "./graph";
import BudgetPieChart from "./budget/budgetPieChart";
import Transactions from "./component/transactions";

import DashboardGoal from "./goal/DashboardGoal";
export function Nav() {
  return (
    <>
      <div className={styles.nav}>
        <a href="/goal/DashboardGoal">Goals</a>
        <a href="/upload/upload">Upload</a>

        <div className={styles.navcenter}>
          <a href="/dashboard">Dashboard</a>
        </div>
        <div className={styles.navright}>
          <a href="/User/logout">Logout</a>
          <a href="/search/search">Search</a>
        </div>
      </div>
    </>
  );
}
export function Footer() {
  return (
    <>
      <div className={styles.foot}>
        <footer>Golden Mapper Industries (copyright 2027)</footer>
      </div>
    </>
  );
}

export default function Home() {
  function myHomeFunction(choice) {
    //This return can be replaced with returning components
    return (
      <Layout>
        <div className={styles[`comp${choice}`]}>
          <div className={styles.funcBody}>Component</div>
        </div>
      </Layout>
    );
  }

  // var homeComponents = [myHomeFunction, xyz];

  // TODO: when different pages have been created, update the navigation links
  return (
    <Layout>
      <div className={styles.container}>
        <Head>
          <title>RocketMoney</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>

        {/* ------------------------------------NAV BAR----------------------------------------------------- */}

        <Nav />

        {/* ------------------------------------BODY-------------------------------------------------------- */}

        <div className={styles.body}>
          {/* ------------------TOP HALF----------------- */}

          <div className={styles.topHalf}>
            <div className={styles.child}>
              <Graph />
            </div>
            <div className={styles.comp2}>
              <div className={styles.childs}>
              <Transactions />
              </div>
            </div>
          </div>

          {/* ------------------BOTTOM HALF--------------- */}

          <div className={styles.bottomHalf}>
            <div className={styles.child}>
              <BudgetPieChart />
            </div>

            <div className={styles.comp4}>
              <DashboardGoal />
            </div>
          </div>
        </div>

        {/* ------------------------------------FOOTER----------------------------------------------------- */}
        <Footer/>
        {/* ------------------------------------EXTRA------------------------------------------------------ */}

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
