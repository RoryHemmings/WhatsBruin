const express = require('express');
const router = express.Router();
const db = require('../queries');
const getEvent = (request, response) => {
    const id = request.query.id;
    db.query(`SELECT * FROM events WHERE id='${id}'`, (error, results) => {
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    })
  };
  
  const getEventsByTag = (request, response) => {
    var tags = request.query.tags;
    const arr = tags.split(',');
    db.query(`SELECT * FROM events WHERE ARRAY[${arr}] && CAST(tags AS text[])`, (error, results) => {
      if (error) {
        throw error;
      }
        response.status(200).json(results.rows);
    });
  };
  module.exports = router;