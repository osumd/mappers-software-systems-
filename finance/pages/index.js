import Head from 'next/head';
import styles from '../styles/Home.module.css';
import Layout from "../components/header"


function xyz(props)
{

}

export default function Home() {


  function myHomeFunction(choice){

    return (
      <Layout>
        <div className={styles[`comp${choice}`]}>
          <h3>Component</h3>
        </div>
      </Layout>
    )

    // switch (choice) {
    //   case 1:
    //     return (
    //       <Layout>
    //         <div className={styles.comp1}>
    //           <h3>Component 1</h3>
    //         </div>
    //       </Layout>
    //     )
    //   case 2:
    //     return (
    //       <Layout>
    //         <div className={styles.comp2}>
    //           <h3>Component 2</h3>
    //         </div>
    //       </Layout>
    //     )
    //   case 3:
    //     return (
    //       <Layout>
    //         <div className={styles.comp3}>
    //           <h3>Component 3</h3>
    //         </div>
    //       </Layout>
    //     )
    //   case 4:
    //     return ()
    //   defualt:
    //     return;
    // }


    return (
      <Layout>
        <div>
          balls
        </div>
      </Layout>
    )
  }



  var homeComponents = [myHomeFunction, xyz];

  // TODO: Move <style> tag below into CSS file
  // TODO: when different pages have been created, update the navigation links
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

        <div className={styles.topHalf}>
          <div>
            {myHomeFunction(1)}
          </div>
  
          <div>
            {myHomeFunction(2)}
          </div>
        </div>

        <div className={styles.bottomHalf}>
          <div>
            {myHomeFunction(3)}
          </div>

          <div>
            {myHomeFunction(4)}
          </div>
        </div>
          
          {myHomeFunction()}
          {/* <xyz props={}/>
          {xyz()} */}
      </div>


      <div className={styles.foot}>
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


