const express = require('express');
const router = express.Router();
const db = require('../queries');
const { v4: uuidv4 } = require('uuid');
const getEvent = async (request, response) => {
    const id = request.body.id;
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
    var tags = request.body.tags;
    if(tags == null){
        response.status(500).json({'database error': 'no query'});
        return;
    }
    db.query(`SELECT * FROM events WHERE tags && $1`, [tags], (error, results) => {
        if (error) {
            throw error;
        }
        response.status(200).json(results.rows);
    });
};
const getEventsByUser = async (request, response) => {
  const id = request.body.id;
  if(id == null){
      response.status(500).json({'database error': 'no query'});
      return;
  }
  db.query(`SELECT * FROM events WHERE organizer='${id}'`, (error, results) => {
      if (error) {
          console.log(error);
          throw error;
      }
    response.status(200).json(results.rows);
  })
};


const postCreateEvent = async (request, response) => {
    //tags is already an array!
    let event = {
        id: uuidv4(),
        title: request.body.title,
        date: request.body.date,
        time: request.body.time,
        location: request.body.location,
        organizer: request.body.organizer,
        organizeruser: request.body.organizeruser,
        tags: request.body.tags,
        picture: request.body.picture,
        num_attendee: 0
    };
    db.query(`INSERT INTO events (id, title, date, time, location, organizer, organizeruser, tags, picture, num_attendee) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
    [event.id, event.title, event.date, event.time, event.location, event.organizer, event.organizeruser, event.tags, event.picture, event.num_attendee],
        (error, results) => {
      if (error) {
        throw error;
      }
    });
    db.query(`UPDATE users SET createdevents = ARRAY_APPEND(createdevents, '${event.id}') WHERE id='${event.organizer}' AND NOT ('${event.id}' = ANY (createdevents))`, (error, results) => {
        if (error) {
          throw error;
        }
      });
      response.status(201).send({ event: event });

};
const postDeleteEvent = async (request, response) => {
    let eventid = request.body.eventid;
    let userid = request.body.userid;
    db.query(`UPDATE users SET createdevents = ARRAY_REMOVE(createdevents, '${eventid}') WHERE id='${userid}' AND ('${eventid}' = ANY (createdevents))`, (error, results) => {
      if (error) {
        throw error;
      }
    });
    db.query(`DELETE FROM events WHERE id='${eventid}'`, (error, results) => {
        if (error) {
          throw error;
        }
      });
    db.query(`UPDATE users SET addedevents = ARRAY_REMOVE(addedevents, '${eventid}') WHERE ('${eventid}' = ANY (addedevents))`, (error, results) => {
        if (error) {
          throw error;
        }
    });
    response.status(201).send({response: 'removed'});
  };
router.post('/create', postCreateEvent);
router.post('/delete', postDeleteEvent);
router.get('/', getEvent);
router.get('/byUser', getEventsByUser);
router.get('/tags', getEventsByTag);
module.exports = router;