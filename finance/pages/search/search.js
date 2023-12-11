import React, { useState, useEffect } from "react";
import {Layout} from "../../components/header";
import {UserId} from "../User/verification";
import { useRouter } from 'next/router';

import styles from "../../styles/User.module.css";

var SearchError = "";
var user_id = "";

export function TransactionsTable({ transactions }) {

  if(transactions == 0)
  {
    return;
  }
  return (
    <div>
      <h1>Transaction Table</h1>
      <table>
        <thead>
          <tr>
            <th>Date</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Category</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map((transaction, index) => (
            <tr key={index}>
              <td>{transaction.date}</td>
              <td>{transaction.description}</td>
              <td>{transaction.amount}</td>
              <td>{transaction.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function SearchPath() {



    const router = useRouter();

    useEffect(() => {
      async function checkLoginStatus() {
          const userLoggedIn = await UserId();

          if(userLoggedIn.LoginStatus == false)
          {
              router.push('/');
          }else
          {
            user_id = userLoggedIn.user_id;
          }
      }
    
      checkLoginStatus(); // Call the function to check login status when the component mounts
    });

    const [form, setForm] = useState({
        keywords: "",
        amount_from: "",
        amount_to: "",
        categories: [],
        date_from: "",
        date_to: "",

    });

    const [currentTransactions, setTransactions] = useState({
      transactions:0,
    });
        // const navigate = useNavigate();
        // These methods will update the state properties.
    function updateForm(value) {
        return setForm((prev) => {
        return { ...prev, ...value };
        });
    }

    const handleCheckboxChange = (category) => {
      // Check if the category is already in the array
      const isCategorySelected = form.categories.includes(category);
      console.log("changed: " + form.categories);
      // Update the form state based on checkbox state
      setForm((prevForm) => {
        if (isCategorySelected) {
          // If category is selected, remove it from the array
          return { ...prevForm, categories: prevForm.categories.filter((c) => c !== category) };
        } else {
          // If category is not selected, add it to the array
          return { ...prevForm, categories: [...prevForm.categories, category] };
        }
      });
    };

    function checkDate(formData)
    {
    
      if(formData.date_to == "")
      {
        formData.date_to = formData.date_from;
      }

      return {validated: true, formData: formData, message: "none"};
    }

    function checkCategories(formData)
    {
      if(formData.categories.length == 0)
      {
        formData.categories = [
          'Department Stores',
          'Restaurants',
          'Payments and Credits',
          'Merchandise',
          'Supermarkets',
          'Travel/ Entertainment',
          'Entertainment',
          'Services'
        ];
      }

      return {validated: true, formData: formData, message: "none"};
    }

    function checkAmount(formData)
    {
        const numPattern = /[\d]+/;
        console.log(formData);
        if(numPattern.test(formData.amount_to) == false)
        {
          return {validated:false, formData: formData, message: "amount contains inproper formatting."};
        }

        if(formData.amount_to == "")
        {
          formData.amount_to = formData.amount_from;
        }

        return {validated: true, formData: formData, message: "none"};
    }

    function displayTransactions(transactions)
    {
      setTransactions({transactions: transactions});
      console.log(transactions.length);
    }


    async function fetchTransactions(query)
    {
      var debugMode = true;
      query.user_id = user_id;

      function msg(message)
      {
        if(debugMode == true)
        {
          console.log(message);
        }

      }

      try{
        const response = await fetch("http://localhost:5000/transaction/search", {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify(query),
          })
            .catch(error => {
            window.alert(error);
            return;
          });

        if(response.ok)
        {
          msg("Response was okay");
          const data = await response.json();
          displayTransactions(data.transactions);
        }else
        {
          console.error("Error:", response.status);
          return false;
        }
      } catch (error)
      {
          console.error("Network error:", error.message);
          return false;
      }
    }

    async function onSubmit(e) {

        // Set up timeout functionality.
        SearchError = "";
        e.preventDefault();
        var formData = { ...form };

        var checkingIndex = checkAmount(formData);
        if(checkingIndex.validated == false){
          SearchError = checkingIndex.message;
          setForm(
            {
              keywords: "",
              amount_from: "",
              amount_to: "",
              categories: [],
              date_from: "",
              date_to: "",
      
            }
          );

          return;
        }
        
        formData = checkingIndex.formData;

        checkingIndex = checkCategories(formData);
        if(checkingIndex.validated == false){
          SearchError = checkingIndex.message;
          setForm(
            {
              keywords: "",
              amount_from: 0,
              amount_to: 0,
              categories: [],
              date_from: "",
              date_to: "",
      
            }
          );

          return;
        }

        checkingIndex = checkDate(formData);
        if(checkingIndex.validated == false){
          SearchError = checkingIndex.message;
          setForm(
            {
              keywords: "",
              amount_from: 0,
              amount_to: 0,
              categories: [],
              date_from: "",
              date_to: "",
      
            }
          );

          return;
        }
        
        formData = checkingIndex.formData;


        await fetchTransactions(formData);

    }

    return (
    
    <Layout>
       
        <div>
          <p>{SearchError}</p>
          <h3>Search bar</h3>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label htmlFor="keywords">Keywords: </label>
              <input
                type="text"
                className="form-control"
                id="keywords"
                value={form.keywords}
                onChange={(e) => updateForm({ keywords: e.target.value })}
              />
            </div>
            <div className="form-group">
            <label htmlFor="amount">Amount: </label>
            <br></br>
              <label htmlFor="amount_from">From: </label>
              <input
                type="text"
                className="form-control"
                id="amount_from"
                value={form.amount_from}
                onChange={(e) => updateForm({ amount_from: e.target.value })}
              />
              <label htmlFor="amount_to">To: </label>
              <input
                type="text"
                className="form-control"
                id="amount_to"
                value={form.amount_to}
                onChange={(e) => updateForm({ amount_to: e.target.value })}
              />
            </div>

            <div className="form-group">
            <label htmlFor="categories">Categories: </label>
              <label htmlFor="work">Work: </label>
              <input
                type="checkbox"
                className="form-control"
                id="work"
                value={form.categories.includes('Work')}
                onChange={() => handleCheckboxChange('Work')}
              />
              <label htmlFor="Department Stores">Department Stores: </label>
              <input
                type="checkbox"
                className="form-control"
                id="Department Stores"
                value={form.categories.includes('Department Stores')}
                onChange={() => handleCheckboxChange('Department Stores')}
              />
              <label htmlFor="Restaurants">Restaurants: </label>
              <input
                type="checkbox"
                className="form-control"
                id="Restaurants"
                value={form.categories.includes('Restaurants')}
                onChange={() => handleCheckboxChange('Restaurants')}
              />
              <br></br>
              <label htmlFor="Payments and Credits">Payments and Credits: </label>
              <input
                type="checkbox"
                className="form-control"
                id="Payments and Credits"
                value={form.categories.includes('Payments and Credits')}
                onChange={() => handleCheckboxChange('Payments and Credits')}
              />
              <label htmlFor="Merchandise">Merchandise: </label>
              <input
                type="checkbox"
                className="form-control"
                id="Merchandise"
                value={form.categories.includes('Merchandise')}
                onChange={() => handleCheckboxChange('Merchandise')}
              />
              <label htmlFor="Supermarkets">Supermarkets: </label>
              <input
                type="checkbox"
                className="form-control"
                id="Supermarkets"
                value={form.categories.includes('Supermarkets')}
                onChange={() => handleCheckboxChange('Supermarkets')}
              />

              <label htmlFor="Travel/ Entertainment">Travel/ Entertainment: </label>
              <input
                type="checkbox"
                className="form-control"
                id="Travel/ Entertainment"
                value={form.categories.includes('Travel/ Entertainment')}
                onChange={() => handleCheckboxChange('Travel/ Entertainment')}
              />
              <br></br>
              <label htmlFor="Services">Services: </label>
              <input
                type="checkbox"
                className="form-control"
                id="Services"
                value={form.categories.includes('Services')}
                onChange={() => handleCheckboxChange('Services')}
              />
            </div>


            <div className="form-group">
            <label htmlFor="date">Date: </label>
            <br></br>
              <label htmlFor="date_from">From: </label>
              <input
                type="date"
                className="form-control"
                id="date_from"
                value={form.date_from}
                onChange={(e) => updateForm({ date_from: e.target.value })}
              />
              <label htmlFor="date_to">To: </label>
              <input
                type="date"
                className="form-control"
                id="date_to"
                value={form.date_to}
                onChange={(e) => updateForm({ date_to: e.target.value })}
              />
            </div>

            

            <div className="form-group">
              <input
                type="submit"
                value="Search"
                className="btn btn-primary"
              />
            </div>

          </form>
        </div>
        <TransactionsTable transactions={currentTransactions.transactions} />
        </Layout>
        );
}

