const express = require('express');
const router = express.Router();
const db = require('../queries');
const utils = require('../utils');

/*FETCHING DATA*/

const getUser = async (request, response) => {
    //how to get username
    //const userid = request.body.userid;
    const id = request.body.id;
    if(id == null){
      response.status(500).json({'database error': 'no query'});
      return;
    }
    db.query(`SELECT * FROM users WHERE id='${id}'`, (error, results) => {
      //console.log(results.rows);
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    });
};
const postAddEvent = async (request, response) => {
  let eventid = request.body.eventid;
  let userid = request.body.userid;
  db.query(`UPDATE users SET addedevents = ARRAY_APPEND(addedevents, '${eventid}') WHERE id='${userid}' AND NOT ('${eventid}' = ANY (addedevents))`, (error, results) => {
    if (error) {
      throw error;
    }
  });
  db.query(`UPDATE events SET num_attendee = num_attendee + 1 WHERE id='${eventid}'`, (error, results) => {
    if (error) {
      throw error;
    }
  });
  response.status(201).send({add: eventid});

};
const postRemoveEvent = async (request, response) => {
  let eventid = request.body.eventid;
  let userid = request.body.userid;
  db.query(`UPDATE users SET addedevents = ARRAY_REMOVE(addedevents, '${eventid}') WHERE id='${userid}' AND ('${eventid}' = ANY (addedevents))`, (error, results) => {
    if (error) {
      throw error;
    }
  });
  db.query(`UPDATE events SET num_attendee = num_attendee - 1 WHERE id='${eventid}'`, (error, results) => {
    if (error) {
      throw error;
    }
  });
  response.status(201).send({remove: eventid});

};

const postAddLike = async (request, response) => {
  let tagid = request.body.tagid;
  let userid = request.body.userid;
  db.query(`UPDATE users SET likes = ARRAY_APPEND(likes, '${tagid}') WHERE id='${userid}' AND NOT ('${tagid}' = ANY (likes))`, (error, results) => {
    if (error) {
      throw error;
    }
  });
  response.status(201).send({add: tagid});

};
const postRemoveLike = async (request, response) => {
  let tagid = request.body.tagid;
  let userid = request.body.userid;
  db.query(`UPDATE users SET likes = ARRAY_REMOVE(likes, '${tagid}') WHERE id='${userid}' AND ('${tagid}' = ANY (likes))`, (error, results) => {
    if (error) {
      throw error;
    }
  });
  response.status(201).send({response: 'removed'});
  
};

router.get('/', getUser);
router.post('/addevent', postAddEvent);
router.post('/removeevent', postRemoveEvent);
router.post('/addlike', postAddLike);
router.post('/removelike', postRemoveLike);

// router.post('/removelike', utils.authenticateToken, postRemoveLike);

// router.get('/private', utils.authenticateToken, (req, res) => {
//   res.status(200).json("private test");
// });

module.exports = router;