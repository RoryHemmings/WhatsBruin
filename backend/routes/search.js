const express = require('express');
const router = express.Router();
const db = require('../queries');
const utils = require('../utils');

function getEvents(title) {
  title = title.toLowerCase();
  return new Promise((resolve, reject) => {
      let keywords = title.split(' ');
      let query = "SELECT * FROM events WHERE SIMILARITY(LOWER(title), LOWER($1)) > 0.3 OR SIMILARITY(LOWER(organizeruser), LOWER($1)) > 0.8 ";
      for (let i = 0; i < keywords.length; i++) {
        keywords[i] = `%${keywords[i]}%`;
        query += `OR LOWER(title) LIKE $${i+2} `;
        query += `OR LOWER(description) LIKE $${i+2} `;
      }
      query += 'ORDER BY SIMILARITY(LOWER(title), LOWER($1)) DESC'; 

      db.query(query, [title].concat(keywords), (err, data) => {
        if (err) {
          console.log(err);
          return reject(err);
        }

        resolve(data.rows);
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
