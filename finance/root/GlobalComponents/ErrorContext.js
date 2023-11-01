import { createContext, useState } from "react";



import errorComponent from "./ErrorComponent";
import CurrentSystemErrors from "./ErrorProccessing"


var currentSystemErrors = new CurrentSystemErrors();
var ErrorWindowOpen = false;

export const Error_Data = createContext(null);

function ErrorWindow({ children }) {

    function setWindowOpen(value)
    {
        setErrorWindowStatus({EmptyState:value});
        ErrorWindowOpen = value;
    }

    const [error, raiseError] = useState("");
    
    return (
        <Error_Data.Provider value={{error,raiseError}}>
        {errorComponent({ Error: error})}
        {children}
        </Error_Data.Provider>
    );
}

export default ErrorWindow;