const express = require('express');
const router = express.Router();
const db = require('../queries');

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
    })
};
const postAddEvent = async (request, response) => {
};
const postAddLike = async (request, response) => {
};
const postRemoveLike = async (request, response) => {
};

router.get('/', getUser);
router.post('/addevent', postAddEvent);
router.post('/addlike', postAddLike);
router.post('/removelike', postRemoveLike);
module.exports = router;