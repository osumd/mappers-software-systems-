import '../styles/global.css'
import {useState} from "react";
import Context from "../root/context"
import ErrorWindow from "../root/GlobalComponents/ErrorContext"


function App({Component, pageProps}) {

  return (
    <>
        <Component {...pageProps} />
    </>
  );
}

export default App
