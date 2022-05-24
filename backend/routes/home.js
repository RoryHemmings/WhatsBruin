const express = require('express');
const router = express.Router();
const db = require('../queries');
const getCalendar = async (req, res) => {
  let date = req.query.date;
  if (date == null)
    return res.status(400).json({ message: 'no date provided' });
  date = date.substring(0, 7);
  db.query('SELECT * FROM events WHERE SUBSTRING(date FROM 1 FOR 7)=$1 ORDER BY date ASC', [date], async (err, data) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ message: 'database error' });
    }
    console.log(data.rows);
    if (data.rowCount < 1)
      return res.status(400).json({message: 'no events in this month'});

    let events = data.rows;
    events.sort((a,b) => {
        if(a.date == b.date){
          if(a.time > b.time){
            return 1;
          }
          if(a.time < b.time){
            return -1;
          }
          return 0;
        }  
        if(a.date < b.date)
              return -1;
        if(a.date > b.date)
            return 1;
      });
      res.status(200).json({
        events: events,
      });
  });
};

router.get('/', getCalendar);
module.exports = router;