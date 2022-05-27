const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('./queries');
require('dotenv').config();

const EMAIL = process.env.EMAIL;

const transporter = nodemailer.createTransport({
  service: 'yahoo',
  auth: {
    user: EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  }
});

function getRecommendations(email) {
  return new Promise((resolve, reject) => {
    db.query('SELECT likes FROM users WHERE email=$1', [email], (err, data) => {
      if (err)
        return reject(err);

      const tags = data.rows;
      let events = [];
      let numRecs = process.env.NUM_RECOMMENDATIONS;
      db.query(`SELECT * FROM events WHERE tags && $1`, [tags], (err, data) => {
        if (err)
          return reject(err);

        events = events.concat(data.rows);
        db.query(`SELECT * FROM events WHERE NOT (tags && $1) LIMIT $2`, [tags, numRecs - events.length], (err, data) => {
          if (err)
            return reject(err);

          events = events.concat(data.rows);
          if (data.rows.length < 1)
            console.log("Recommendation error: No recommendations were found");

          resolve(events);
        });
      });
    });
  });
}

function getHTMLForEvents(events) {
  let ret = '';


  ret +=
    `<head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <meta http-equiv="X-UA-Compatible" content="ie=edge">
      <title>WhatsBruin Recommendations</title>
      <link rel="stylesheet" href="./emailStyle.css">
      <style>
        * {
          margin: 0;
          padding: 0;
          border: 0;
        }
    
        body {
          font-family: Futura, "Trebuchet MS", Arial, sans-serif;
        }
    
        .margin {
          margin: 2rem;
        }
    
        .italic {
          font-style: italic;
        }
    
        ol {
          margin: 1rem;
        }
    
      .header {
        background: #022a68;
        color: white;
        text-align: center;
        padding: 3rem 0;
      }
    
      .orange {
        color: #f68c3e;
      }
    
      h1 {
        font-size: 2.5rem;
      }
    
      h3 {
        font-size: 1.5rem;
      }
    
      li {
        margin-bottom: 2rem;
      }
    
      .outlined {
        border: 2px dashed #FFEEAE;
        padding: 2rem;
        text-align: center;
      }
    
      button {
        border-radius: 5px;
        background-color: #FCBA63;
        padding: 15px;
      }
    
      button:hover {
        background-color: #F68C3E
      }
    </style>
  </head>
  
  <body>
      <div class="header">
          <h1>Event Recommendations</h1>
          <p class="italic">Powered by WhatsBruin</p>
      </div>
      <div class="margin">
          <p>Based on your preferences, you might be interested in the following events:</p>
          <br />
          <ol>`;

  for (let i = 0; i < events.length; i++) {
    ret +=
      `<li>
      <h3 class="orange">${events[i].title}</h3>
      <p class="itallic">${events[i].date} ${events[i].starttime}-${events[i].endtime}</p>
      <p>${events[i].description}</p>
    </li>`
  }

  ret += `</ol>
          <br />
          <div class="outlined">
              <p>For more information, click the button below to visit our application:</p>
              <br/>
              <button><b>Visit WhatsBruin!</b></button>
          </div>
      </div>
  </body>
  `
  return ret;
}

async function sendEmail(recipient, subject, content) {
  const options = {
    from: EMAIL,
    to: recipient,
    subject: subject,
    html: content,
  }

  transporter.sendMail(options, (err, info) => {
    if (err) {
      console.log("Email failed to send: ", err)
    } else {
      console.log(`Email sent to: ${options.to} `, info.response);
    }
  });
}

async function sendRecommendationEmail(email, subject) {
  try {
    const events = await getRecommendations(email);
    const content = getHTMLForEvents(events);

    sendEmail(email, subject, content);
  } catch (err) {
    console.log("recommendation email error: ", err);
  }
}

/* Authentication Middleware */
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) { return res.sendStatus(401); }   // No Authorization

  // Make sure that authorization token is valid
  jwt.verify(token, process.env.JWT_ACCESS_SECRET, (err, user) => {
    if (err) { return res.sendStatus(403); }  // Authorization invalid

    // If so, set user
    req.user = user;
    next();
  });
}

module.exports = {
  authenticateToken,
  sendRecommendationEmail
}
