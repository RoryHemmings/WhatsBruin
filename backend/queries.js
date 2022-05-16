const { query } = require('express');

const Pool = require('pg').Pool;
require('dotenv').config();
console.log(process.env);

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});

/*FETCHING DATA*/

const getUser = (request, response) => {
  //how to get username
  //const userid = request.body.userid;
  const uid = request.query.uid;
  pool.query(`SELECT * FROM users WHERE userid='${uid}'`, (error, results) => {
    //console.log(results.rows);
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  })
};
const getEvent = (request, response) => {
  const eid = request.query.eid;
  pool.query(`SELECT * FROM events WHERE eventid='${eid}'`, (error, results) => {
    if (error) {
      throw error;
    }
    response.status(200).json(results.rows);
  })
};

const getEventsByTag = (request, response) => {
  var tags = request.query.tags;
  const arr = tags.split(',');
  pool.query(`SELECT * FROM events WHERE ARRAY[${arr}] && CAST(tags AS text[])`, (error, results) => {
    if (error) {
      throw error;
    }
      response.status(200).json(results.rows);
  });
};

module.exports = {
  getUser,
  getEvent,
  getEventsByTag
};