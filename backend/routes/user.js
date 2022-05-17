const express = require('express');
const router = express.Router();
const db = require('../queries');

/*FETCHING DATA*/

const getUser = (request, response) => {
    //how to get username
    //const userid = request.body.userid;
    const uid = request.query.uid;
    db.query(`SELECT * FROM users WHERE userid='${uid}'`, (error, results) => {
      //console.log(results.rows);
      if (error) {
        throw error;
      }
      response.status(200).json(results.rows);
    })
};
router.get('/', getUser);
module.exports = router;