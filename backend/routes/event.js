const express = require('express');
const router = express.Router();
const db = require('../queries');
const getEvent = async (request, response) => {
    const id = request.query.id;
    if(id == null){
        response.status(500).json({'database error': 'no query'});
        return;
    }
    db.query(`SELECT * FROM events WHERE id='${id}'`, (error, results) => {
        if (error) {
            console.log(error);
            throw error;
        }
      response.status(200).json(results.rows);
    })
};
  
const getEventsByTag = async (request, response) => {
    var tags = request.query.tags;
    const arr = tags.split(',');
    if(tags == null){
        response.status(500).json({'database error': 'no query'});
        return;
    }
    db.query(`SELECT * FROM events WHERE ARRAY[${arr}] && CAST(tags AS text[])`, (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};
const postCreateEvent = (request, response) => {
    var tags = request.query.tags;
    const arr = tags.split(',');
    db.query(`SELECT * FROM events WHERE ARRAY[${arr}] && CAST(tags AS text[])`, (error, results) => {
      if (error) {
        throw error;
      }
        response.status(200).json(results.rows);
    });
};
//router.get('/:id', (req, res) =>)
router.post('/create', postCreateEvent);
router.get('/', getEvent);
router.get('/tags', getEventsByTag);
module.exports = router;