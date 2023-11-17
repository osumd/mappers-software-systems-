// MyForm.js


// pages/myPage.js

import React from 'react';
import {useState} from 'react';

function MyForm(){
  const [inputValue, setInputValue] = useState('');
  function onSubmit(value){
    console.log(`Form submitted with value: ${value}`);
    // Add your form submission logic here
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(inputValue);
    setInputValue('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );


};

export default MyForm;
