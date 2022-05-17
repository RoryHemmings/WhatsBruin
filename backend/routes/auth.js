const express = require('express');
const db = require('../queries');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();

const emailRegex = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/

/* Authenticate the user */
passport.use(new LocalStrategy((email, password, callback) => {
  db.query(
    'SELECT * FROM users WHERE email=(email), VALUES($1)', [email],
    (err, user) => {

      /* Make sure query was sucessful */
      if (err) { return callback(err); }
      if (!user) { return callback(null, false, { message: 'User does not exist' }); }

      /* Confirm that password is correct */
      const storedHash = user.passwordHash;
      if (bcrypt.compare(password, storedHash)) {
        return callback(null, user);  // success
      } else {
        return callback(null, false, { message: 'Incorrect password' })
      }
    });
}));

function checkEmailFormat(email) {
  // check if email has a valid format
  return emailRegex.test(email);
}

async function createNewUser(body, callback) {
  // TODO check for valid email, username, and password formatting
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
  // TODO create user id, make sure user isn't already in the database
  createNewUser(req.body, (err, user) => {
    if (err) {
      return next(err);
    }

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
          'INSERT INTO users (id, email, username, passwordhash, events, createdevents, profile, settings, likes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
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
            res.status(201).send(ret);
          });
      }
    );
  });
});

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, message) => {
    if (err) { return next(err); }
    if (!user) {
      res.json(message);
    }

    console.log(user);

    // Create jwt
    // return jwt
    // probably res.cookie() to set cookie
  })(req, res, next);
});

module.exports = router;