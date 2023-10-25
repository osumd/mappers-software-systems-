
import React, { Component } from 'react';

import styles from "./ErrorMessage.module.css"


class ErrorComponent extends Component
{
    constructor(props){
        super(props);
        this.state = {
            errorString: "",
            errorStatus: false,
        };
    }

    raiseError = (ErrorString) => {
        this.state = ({errorString: ErrorString, errorStatus: true});
    };

    render()
    {
        
        if(this.state.errorStatus == false)
        {
            return null;
        }
        return (
            <div className = {styles.ErrorMessageStyle}>
                {this.state.errorString}
            </div>
        );
    }

};

var ErrorStatus = new ErrorComponent();

export default ErrorStatus;






