// Make sure you https://codedamn.com/news/javascript/fix-require-is-not-defined
// Main nodejs render variables
//const require = '';  // resolves the require issue

import express from 'express';
const app = express();
import bodyParser from 'body-parser';

import { writeFile } from 'fs';
import { Client, Connection } from 'pg';
import { resolve } from 'path';
import { json } from 'express';


/*const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const fs = require('fs');
const { Client, Connection } = require('pg');
const { resolve } = require('path');
const { json } = require('express');*/

// Connect to Database
const client = new Client({
    user: "postgres",
    password: "v780X!Jaguar2023",
    host: "localhost",
    port: 5432,
    database: "thesisDevDB"
});

client.connect();

// Query Data from PostgreSQL with Javascript
//let predStudentSQL = "SELECT id_student, gender, tma, exam, cma, is_banked, date, num_of_prev_attempts, sum_click, studied_credits,login_frequency, cluster, forum_post, TO_TIMESTAMP(time_created) AS time_created,TO_TIMESTAMP(time_modified) AS time_modified, TO_TIMESTAMP(last_access) AS last_access FROM predStudentAnalysis";
//let studentloginSQL = "SELECT id_student, login_date FROM studentVle";
let dataSQL = "SELECT * FROM final_data ORDER BY created_at ASC, student_id ASC;";
//let loginData = "SELECT * FROM student_login;";


/* Query promise */
client.query(dataSQL)
    .then(res => {

        // Write query results to JSON FILE

        let stringfyRes = JSON.stringify(res);

        fs.writeFile('json/sfldData.json', stringfyRes, (err) => {
            if (err) {
                throw err;
                console.log(res);
            }
            console.log("Saved Information to JSON");
        });
        //console.log(res.rows[8])
    }).catch(e => console.error(e.stack));