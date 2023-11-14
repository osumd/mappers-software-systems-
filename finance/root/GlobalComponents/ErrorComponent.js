
import React, { useState, useEffect, Component} from "react";
import styles from './ErrorComponent.module.css';

import CurrentSystemErrors from "./ErrorProccessing"

function errorComponent({ Error })
{

  function closeBox()
  {

  }

  if(Error == "")
  {
      return null;
  }
  
  return (
            <div className={styles.ErrorMessageStyle}>
              {Error}
              <div className={styles.CloseErrorMessage} onClick={closeBox}></div>
            </div>
        );
}


export default errorComponent;


// class ErrorWindow extends Component
// {

//   constructor(props)
//   {
//     super(props);

//     this.state = 
//     {
//         WindowOpen: false,
//         AmountOfErrors: 0,
//         CurrentError: 0,
//     };
//   }

//   raiseError(errorString)
//   {
//     this.setState({error: errorString, open:true});
//   }

//   closeBox()
//   {
//     this.state.open = false;
//   }

//   render()
//   {
//     if(this.error = "" || this.state.open == false)
//     {
//         return null;
//     }
//     return (
//         <div className={styles.ErrorMessageStyle}>
//           {this.error}
//           <div id="ErrorComponentCloseButton" className={styles.CloseErrorMessage} onClick={this.closeBox}></div>
//         </div>
//     );
//   } 
// };


