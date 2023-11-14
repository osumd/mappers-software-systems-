import { createContext, useState } from "react";
export const Message_data = createContext(null);

function Context({ children }) {

  const [message, setMessage] = useState("michael");
  const [error, setError] = useState("");

  return (
    <Message_data.Provider value={{ message, setMessage}}>
      
      {message}
      {children}


    </Message_data.Provider>
  );
}

export default Context;