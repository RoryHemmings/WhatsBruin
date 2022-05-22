const express = require('express');
const router = express.Router();
const db = require('../queries');
const { v4: uuidv4 } = require('uuid');
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
  
const getEventsByTags = async (request, response) => {
  //tags MUST be an array wrapped in {}
    const tags = request.query.tags;
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
  const id = request.query.id;
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
const getEventsByDate = async (request, response) => {
  const date = request.query.date;
  if(date == null){
      response.status(500).json({'database error': 'no query'});
      return;
  }
  db.query(`SELECT * FROM events WHERE date='${date}'`, (error, results) => {
      if (error) {
          console.log(error);
          throw error;
      }
    response.status(200).json(results.rows);
  })
};
const getEventsByWeekDay = async (request, response) => {
  const  date = request.query.date;
  const weekday = request.query.weekday;
  if(weekday == null || date == null){
      response.status(500).json({'database error': 'no query'});
      return;
  }
  db.query(`SELECT * FROM events WHERE weekday='${weekday}'`, (error, results) => {
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
        description: request.body.description,
        date: request.body.date,
        weekday: request.body.weekday,
        starttime: request.body.starttime,
        endtime: request.body.endtime,
        location: request.body.location,
        organizer: request.body.organizer,
        organizeruser: request.body.organizeruser,
        tags: request.body.tags,
        picture: request.body.picture,
        num_attendee: 0
    };
    if(!(event.title && event.description && event.date && event.weekday && event.starttime && event.endtime && event.location)){
      return response.status(400).json({message: "bad request; make sure nothing is null"});
    }
    db.query(`INSERT INTO events (id, title, description, date, weekday, starttime, endtime, location, organizer, organizeruser, tags, picture, num_attendee) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
    [event.id, event.title, event.description, event.date, event.weekday, event.starttime, event.endtime, event.location, event.organizer, event.organizeruser, event.tags, event.picture, event.num_attendee],
        (error, results) => {
      if (error) {
        return response.status(400).json({message : "event could not be added"});
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
    response.status(200).send({response: 'removed'});
  };
router.post('/create', postCreateEvent);
router.post('/delete', postDeleteEvent);
router.get('/', getEvent);
router.get('/byUser', getEventsByUser);
router.get('/byTags', getEventsByTags);
router.get('/byDate', getEventsByDate);
router.get('/byWeekDay', getEventsByWeekDay);
module.exports = router;