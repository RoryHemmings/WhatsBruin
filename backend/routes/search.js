const express = require('express');
const router = express.Router();
const db = require('../queries');
const utils = require('../utils');

function getEvents(title) {
  return new Promise((resolve, reject) => {
      db.query('SELECT * FROM events WHERE title=$1', [title], (err, data) => {
        if (err)
          reject(err);

        const events = data.rows;
        resolve(events);
      });
  });
}

async function searchEvents(res, req, next) {
  const title = req.query.title;
  if (!title)
    return next({ status: 400, message: "no title provided" });

  const events = await getEvents(title);
  res.status(200).json(events);
}

router.get('/', searchEvents);

module.exports = router;