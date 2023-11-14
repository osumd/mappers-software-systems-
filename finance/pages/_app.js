import '../styles/global.css'
import {useState} from "react";
import Context from "../root/context"
import ErrorWindow from "../root/GlobalComponents/ErrorContext"


function App({Component, pageProps}) {

  return (
    <>
    <ErrorWindow>
        <Component {...pageProps} />
    </ErrorWindow>
    </>
  );
}

export default App
