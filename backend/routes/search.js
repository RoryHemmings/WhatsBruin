const express = require('express');
const router = express.Router();
const db = require('../queries');
const utils = require('../utils');

function getEvents(title) {
  return new Promise((resolve, reject) => {
      let keywords = title.split(' ');
      let query = "SELECT * FROM events WHERE SIMILARITY(title, $1) > 0.3 OR title LIKE $2 ";
      for (let i = 0; i < keywords.length; i++) {
        keywords[i] = `%${keywords[i]}%`;
        query += `OR description LIKE $${i+2} `;
      }
      query += 'ORDER BY SIMILARITY(title, $1) DESC'; 

      db.query(query, [title].concat(keywords), (err, data) => {
        if (err) {
          console.log(err);
          return reject(err);
        }

        if (data.rowCount < 1)
          return resolve({status: 200, message: "no results were found"});

        const events = data.rows;
        resolve(events);
      });
  });
}

async function searchEvents(req, res, next) {
  const title = req.query && req.query.title;
  if (!title)
    return next({ status: 400, message: "no title provided" });

  try {
    const events = await getEvents(title);
    res.status(200).json(events);
  } catch (err) {
    console.log(err);
    next({status: 500, message: 'Database Error'});
  }
}

router.get('/', searchEvents);

module.exports = router;
