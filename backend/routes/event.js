const express = require('express');
const router = express.Router();
const db = require('../queries');
const { v4: uuidv4 } = require('uuid');

const getEvent = async (request, response) => {
    const id = request.query.eventid;
    if(id == null){
        response.status(500).json({'database error': 'no query'});
        return;
    }
    db.query('SELECT * FROM events WHERE id=$1', [id], (error, results) => {
        if (error) {
            console.log(error);
            throw error;
        }
      response.status(200).json(results.rows);
    })
};
  
const getEventsByTags = async (request, response) => {
  //tags MUST be an array
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
  const id = request.query.userid;
  if(id == null){
      response.status(500).json({'database error': 'no query'});
      return;
  }
  db.query('SELECT * FROM events WHERE organizer=$1', [id], (error, results) => {
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
  db.query('SELECT * FROM events WHERE date=$1', [date], (error, results) => {
      if (error) {
          console.log(error);
          throw error;
      }
    response.status(200).json(results.rows);
  })
};
const getEventsByWeekDay = async (request, response) => {
  const date = request.query.date.substring(0, 7);
  const weekday = request.query.weekday;
  if(weekday == null || date == null){
      response.status(500).json({'database error': 'no query'});
      return;
  }
  db.query('SELECT * FROM events WHERE weekday=$1 AND SUBSTRING(date FROM 1 FOR 7)=$2', [weekday, date], (error, results) => {
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
    db.query(`UPDATE users SET createdevents = ARRAY_APPEND(createdevents, $1) 
            WHERE id=$2 AND NOT ($3 = ANY (createdevents))`,
            [event.id, event.organizer, event.id], (error, results) => {
        if (error) {
          throw error;
        }
      });
      response.status(201).send({ event: event });

};

const postEditEvent = async (request, response) => {
  //tags is already an array!
  let event = {
      eventid: request.body.eventid,
      title: request.body.title,
      description: request.body.description,
      date: request.body.date,
      weekday: request.body.weekday,
      starttime: request.body.starttime,
      endtime: request.body.endtime,
      location: request.body.location,
      tags: request.body.tags,
      picture: request.body.picture,
  };
  if(!(event.eventid && event.title && event.description && event.date && event.weekday && event.starttime && event.endtime && event.location)){
    // return response.status(400).json({message: "bad request; make sure nothing is null"});
  }
  db.query(`UPDATE events SET title = $2, description = $3, date = $4, weekday = $5, starttime = $6, endtime = $7, location = $8, tags = $9, picture = $10 
         WHERE id=$1`,
  [event.eventid, event.title, event.description, event.date, event.weekday, event.starttime, event.endtime, event.location, event.tags, event.picture],
      (error, results) => {
    if (error) {
      // return response.status(400).json({message : "event could not be edited"});
    }
  });
  return response.status(201).send({ event: event });

};



const postDeleteEvent = async (request, response) => {
    let eventid = request.body.eventid;
    let userid = request.body.userid;
    db.query(`UPDATE users SET createdevents = ARRAY_REMOVE(createdevents, $1) 
            WHERE id=$2 AND ($1 = ANY (createdevents))`, 
            [eventid, userid], (error, results) => {
      if (error) {
        throw error;
      }
    });
    db.query(`DELETE FROM events WHERE id=$1`, [eventid], (error, results) => {
        if (error) {
          throw error;
        }
      });
    db.query(`UPDATE users SET addedevents = ARRAY_REMOVE(addedevents, $1) 
            WHERE ($1 = ANY (addedevents))`, 
            [eventid], (error, results) => {
        if (error) {
          throw error;
        }
    });
    response.status(200).send({response: 'removed'});
  };
router.post('/create', postCreateEvent);
router.post('/delete', postDeleteEvent);
router.post('/edit', postEditEvent);
router.get('/', getEvent);
router.get('/byUser', getEventsByUser);
router.get('/byTags', getEventsByTags);
router.get('/byDate', getEventsByDate);
router.get('/byWeekDay', getEventsByWeekDay);
module.exports = router;