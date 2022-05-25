const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const db = require('./queries');
require('dotenv').config();

const EMAIL = process.env.EMAIL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
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

        events.concat(data.rows);
        db.query(`SELECT * FROM events WHERE NOT tags && $1 LIMIT $2`, [tags, numRecs - events.length], (err, data) => {
          if (err)
            return reject(err);

          events.concat(data.rows);
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
  ret += '<h1>Here are your recommended events</h1>'
  for (let i = 0; i < events.length; i++) {
    ret += `<p>${events.title}</p>` 
  }

  return ret;
}

async function sendEmail(recipient, subject, content) {
  const options = {
    from: EMAIL,
    to: recipient,
    subject: subject,
    text: content,
  }

  transporter.sendMail(options, (err, info) => {
    if (error) {
      console.log("Email failed to send: ", err)
    } else {
      console.log(`Email sent to: ${options.recipient}` + info.response);
    }
  });
}

async function sendRecommendationEmail(email, subject) {
  try {
    const events = await getRecommendations(email);
    const content = getHTMLForEvents(events);

    console.log(content);
    // sendEmail(email, subject, content);
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
