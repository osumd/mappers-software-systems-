import '../styles/global.css'
import {useState} from "react";
import Context from "../root/context"
import ErrorWindow from "../root/GlobalComponents/ErrorContext"
import { UserLoggedIn } from './User/verification';


function App({Component, pageProps}) {

  UserLoggedIn();

  return (
    <>
    <ErrorWindow>
        <Component {...pageProps} />
    </ErrorWindow>
    </>
  );
}

export default App
