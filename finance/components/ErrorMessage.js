
import React, { useState, useEffect, Component} from "react";
import styles from './ErrorMessage.module.css';




function ErrorComponent(Error)
{

  const [open, setOpen] = useState(true);

  function closeBox()
  {
    setOpen(false);
  }

  if(Error == "" || !open)
  {
      return null;
  }
  return (
            <div className={styles.ErrorMessageStyle}>
              {Error}
              <div className={styles.CloseErrorMessage} onClick = {closeBox}></div>
            </div>
        );
}


export default ErrorComponent;


// class ErrorComponent extends Component
// {

//   constructor(props)
//   {
//     super(props);

//     this.state = 
//     {
//         error: "",
//         open: false,
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


