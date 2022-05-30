const express = require('express');
const router = express.Router();
const db = require('../queries');
const utils = require('../utils');

function compareTime(a, b) {
  if (a.date == b.date) {
    if (a.time > b.time)
      return 1;
    else if (a.time < b.time)
      return -1;
    else
      return 0;
  }
  if (a.date < b.date)
    return -1;
  else
    return 1;
}

function getEvent(eventid) {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM events WHERE id=$1', [eventid], (err, data) => {
      if (err)
        reject(err);

      const event = data.rows[0];
      resolve(event);
    });
  });
}

function queryEvents(id) {
  return new Promise((resolve, reject) => {
    if (id == null)
      return reject({ status: 400, message: 'no user id provided' });

    db.query('SELECT * FROM users WHERE id=$1', [id], async (err, data) => {
      if (err) {
        console.log(err);
        return reject({ status: 500, message: 'database error' });
      }

      if (data.rowCount < 1)
        return reject({ status: 400, message: 'no user with that id exists' });

      let createdEvents = [];
      let addedEvents = [];
      const addedEventIds = data.rows[0].addedevents;
      const createdEventIds = data.rows[0].createdevents;
      try {
        for (let i = 0; i < addedEventIds.length; i++)
          addedEvents.push(await getEvent(addedEventIds[i]));

        for (let i = 0; i < createdEventIds.length; i++)
          createdEvents.push(await getEvent(createdEventIds[i]));

        addedEvents.sort(compareTime);
        createdEvents.sort(compareTime);

        return resolve({
          addedEvents: addedEvents,
          createdEvents: createdEvents,
        });
      }
      catch (err) {
        return reject({ status: 500, message: 'invalid event id' });
      }
    });
  });
}

const getUser = async (req, res, next) => {
  try {
    let events = await queryEvents(req.query.userid);
    res.status(200).json({
      events: events.addedEvents.concat(events.createdEvents)
    });
  } catch (err) {
    next(err);
  }
};

const getUserAddedEvents = async (req, res) => {
  try {
    let events = await queryEvents(req.query.userid);
    res.status(200).json({
      events: events.addedEvents
    });
  } catch (err) {
    next(err);
  }
}

const getUserCreatedEvents = async (req, res) => {
  try {
    let events = await queryEvents(req.query.userid);
    res.status(200).json({
      events: events.createdEvents
    });
  } catch (err) {
    next(err);
  }
}

const getUserTags = async (request, response) => {
  let userid = request.query.userid;
  db.query('SELECT likes FROM users WHERE id=$1', [userid], async (error, results) => {
    if (error) {
      console.log(error);
      return results.status(500).json({ message: 'database error' });
    }
    if (results.rowCount < 1) {
      return response.status(400).json({ message: 'no user with that id exists' });
    }
    response.status(200).json({ likes: results[0].rows });
  });
}

const postAddEvent = async (request, response) => {
  let eventid = request.body.eventid;
  let userid = request.body.userid;
  db.query('UPDATE users SET addedevents = ARRAY_APPEND(addedevents, $1) WHERE id=$2 AND NOT ($3 = ANY (addedevents))',
    [eventid, userid, eventid], (error, results) => {
      if (error) {
        console.log(error);
        return response.status(500).send({ message: 'database error' });
      }
    });
  db.query('UPDATE events SET num_attendee = num_attendee + 1 WHERE id=$1', [eventid], (error, results) => {
    if (error) {
      console.log(error);
      return response.status(500).send({ message: 'database error' });
    }
  });
  response.status(201).send({ add: eventid });

};

const postRemoveEvent = async (request, response) => {
  let eventid = request.body.eventid;
  let userid = request.body.userid;
  db.query('UPDATE users SET addedevents = ARRAY_REMOVE(addedevents, $1) WHERE id=$2 AND ($3 = ANY (addedevents))',
    [eventid, userid, eventid], (error, results) => {
      if (error) {
        console.log(error);
        return response.status(500).send({ message: 'database error' });
      }
    });
  db.query('UPDATE events SET num_attendee = num_attendee - 1 WHERE id=$1', [eventid], (error, results) => {
    if (error) {
      console.log(error);
      return response.status(500).send({ message: 'database error' });
    }
  });
  response.status(201).send({ remove: eventid });
};

const postAddLike = async (request, response) => {
  let tagid = request.body.tagid;
  let userid = request.body.userid;
  db.query('UPDATE users SET likes = ARRAY_APPEND(likes, $1) WHERE id=$2 AND NOT ($3 = ANY (likes))',
    [tagid, userid, tagid], (error, results) => {
      if (error) {
        throw error;
      }
    });
  response.status(201).send({ add: tagid });
};

const postRemoveLike = async (request, response) => {
  let tagid = request.body.tagid;
  let userid = request.body.userid;
  db.query('UPDATE users SET likes = ARRAY_REMOVE(likes, $1) WHERE id=$2 AND ($3 = ANY (likes))',
    [tagid, userid, tagid], (error, results) => {
      if (error) {
        throw error;
      }
    });
  response.status(201).send({ response: 'removed' });
};

router.get('/', utils.authenticateToken, getUser);
router.get('/addedevents', getUserAddedEvents)
router.get('/createdevents', getUserCreatedEvents);
router.get('/tags', getUserTags);
router.post('/addevent', postAddEvent);
router.post('/removeevent', postRemoveEvent);
router.post('/addlike', postAddLike);
router.post('/removelike', postRemoveLike);

module.exports = router;
