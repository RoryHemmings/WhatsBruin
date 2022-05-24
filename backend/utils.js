const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer')

const EMAIL = process.env.EMAIL;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL,
    pass: process.env.EMAIL_PASSWORD,
  }
});

function sendEmail(recipient, subject, content) {
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
  authenticateToken
}
