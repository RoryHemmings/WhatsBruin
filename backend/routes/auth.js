const express = require('express');
const db = require('../queries');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();


const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

function checkEmailFormat(email) {
  // check if email has a valid format
  return emailRegex.test(email);
}

async function createNewUser(body, callback) {
  if (!body.email || !body.username || !body.password)
    return callback({ status: 400, message: "Invalid email, username, or password" }, null);

  if (!checkEmailFormat(body.email))
    return callback({ status: 400, message: "Invalid email format" }, null);

  try {
    const passwordHash = await bcrypt.hash(body.password, 10);

    let user = {
      id: uuidv4(),
      email: body.email,
      username: body.username,
      passwordHash: passwordHash,
    };

    return callback(null, user);
  }
  catch {
    // Misc error
    return callback({ status: 500, message: "Internal server error" }, null);
  }
}

router.post('/register', async (req, res, next) => {
  createNewUser(req.body, (err, user) => {
    if (err) return next(err);

    db.query(
      'SELECT * FROM users WHERE email=$1 LIMIT 1',
      [user.email], (err, data) => {
        if (err) {
          console.log(err);
          return next({ status: 500, message: "database error" });
        }

        if (data.rows.length > 0) {
          return next({ status: 400, message: `user with email ${user.email} already exists` });
        }

        db.query(
          'INSERT INTO users (id, email, username, passwordhash, addedevents, createdevents, profile, settings, likes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
          [user.id, user.email, user.username, user.passwordHash, [], [], "", "", []],
          (err, data) => {
            if (err) {
              console.log(err);
              return next({ status: 500, message: "database error" });
            }

            const ret = {
              email: user.email,
              username: user.username,
            };

            // Created new user
            res.status(201).send({ user: ret });
          });
      }
    );
  });
});

/* Authenticate the user */
passport.use(new LocalStrategy((email, password, callback) => {
  db.query(
    'SELECT * FROM users WHERE email=$1 LIMIT 1', [email],
    async (err, data) => {

      /* Make sure query was sucessful */
      if (err) return callback(err);
      if (data.rows.length < 1) return callback(null, null, { message: `User with that email does not exist` });

      const user = data.rows[0];
      /* Confirm that password is correct */
      if (await bcrypt.compare(password, user.passwordhash)) {
        return callback(null, user);  // success
      } else {
        return callback(null, null, { message: 'Incorrect password' })
      }
    });
}));

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, message) => {
    if (err) { 
      console.log(err);
      return next({status: 500, message: "authentication error"}); 
    }

    if (!user) return next({ status: 401, message: message });

    const userInfo = {
      userid: user.id,
      username: user.username,
      email: user.email,
    }

    const accessToken = jwt.sign(userInfo, process.env.JWT_ACCESS_SECRET, { expiresIn: '24h'});
    res.status(200).json({ user: userInfo, accessToken: accessToken });
  })(req, res, next);
});

module.exports = router;