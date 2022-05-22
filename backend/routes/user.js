const express = require('express');
const { response } = require('../app');
const router = express.Router();
const db = require('../queries');
const utils = require('../utils');

function getEvent(eventid) {
  return new Promise((resolve, reject) => {
      db.query('SELECT * FROM events WHERE id=$1', [eventid], (err, data) => {
        if (err)
          reject(err);

        resolve(data);
      })
  });
}

const getUser = async (req, res) => {
  const id = req.body.userid;
  if (id == null)
    return res.status(400).json({ message: 'no user id provided' });

  db.query('SELECT * FROM users WHERE id=$1', [id], (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'database error' });
    }

    if (data.rowCount < 1)
      return res.status(400).json({message: 'no user with that id exists'});

    let events = [];
    const eventids = data.rows[0].addedevents.concat(data.rows[0].createdevents);
    eventids.forEach(async eventid => {
      try {
        events.push(await getEvent(eventid));
      } catch (err) {
        return res.status(500).json({message: 'invalid event id'});
      }
    });

    res.status(200).json({
      events: events,
    });
  });
};

const postAddEvent = async (request, response) => {
  let eventid = request.body.eventid;
  let userid = request.body.userid;
  db.query('UPDATE users SET addedevents = ARRAY_APPEND(addedevents, $1) WHERE id=$2 AND NOT ($3 = ANY (addedevents))',
    [eventid, userid, eventid], (error, results) => {
      if (error) {
        throw error;
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
        throw error;
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
router.post('/addevent', postAddEvent);
router.post('/removeevent', postRemoveEvent);
router.post('/addlike', postAddLike);
router.post('/removelike', postRemoveLike);

// router.post('/removelike', utils.authenticateToken, postRemoveLike);

// router.get('/private', utils.authenticateToken, (req, res) => {
//   res.status(200).json("private test");
// });

module.exports = router;