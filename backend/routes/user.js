const express = require('express');
const router = express.Router();
const db = require('../queries');
const utils = require('../utils');

/*FETCHING DATA*/

const getUser = async (request, response) => {
    //how to get username
    //const userid = request.body.userid;
    const id = request.query.id;
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
  let eventid = request.query.eventid;
  let userid = request.query.userid;
  db.query(`UPDATE users SET addedevents = ARRAY_APPEND(addedevents, '${eventid}') WHERE id='${userid}' AND NOT ('${eventid}' = ANY (addedevents))`, (error, results) => {
    if (error) {
      throw error;
    }
  });
  response.status(201).send({add: eventid});

};
const postRemoveEvent = async (request, response) => {
  let eventid = request.query.eventid;
  let userid = request.query.userid;
  db.query(`UPDATE users SET addedevents = ARRAY_REMOVE(addedevents, '${eventid}') WHERE id='${userid}' AND ('${eventid}' = ANY (addedevents))`, (error, results) => {
    if (error) {
      throw error;
    }
  });
  response.status(201).send({remove: eventid});

};

const postAddLike = async (request, response) => {
  let tagid = request.query.tagid;
  let userid = request.query.userid;
  db.query(`UPDATE users SET likes = ARRAY_APPEND(likes, '${tagid}') WHERE id='${userid}' AND NOT ('${tagid}' = ANY (likes))`, (error, results) => {
    if (error) {
      throw error;
    }
  });
  response.status(201).send({add: tagid});

};
const postRemoveLike = async (request, response) => {
  let tagid = request.query.tagid;
  let userid = request.query.userid;
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


//event/tag id 54c5be59-325b-4be2-8f2f-afca235a2a74
//user 8d6dc244-e2b4-4feb-9f80-9c1df5bfbdcb

router.get('/private', utils.authenticateToken, (req, res) => {
  res.status(200).json("private test");
});

module.exports = router;