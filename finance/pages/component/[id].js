import React, { useState, useEffect } from "react";
import { Layout } from "../../components/header";
import { useRouter } from 'next/router';

import {BudgetForm} from '../budgetForm';

import styles from '../../styles/component/component.module.css';

import * as ComponentList from './componentList';


export default function Id() {
    
    
    const router = useRouter();
    const { id } = router.query;
    
    // Now 'id' contains the value of the 'id' parameter from the URL

    // Use 'id' in your MongoDB query or function
    useEffect(() => {
        // Fetch data from MongoDB using 'id'
        // For example, you can make an API call to your server
        // and pass 'id' as a parameter to get the corresponding data
        if (id) {
            // fetchDataFromMongoDB(id);
        }
    }, [id]);

    
    return ComponentList.Components[1];
}