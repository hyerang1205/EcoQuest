const router = require("express").Router();
const debug = require("debug")("comp2930-team2:server");
const { User, validate } = require("../src/models/user");
const _ = require("lodash");

/*

This file is the router for handling user connections (creating, updating, removing, validating/login)

*/

// Creates a user off of the req body, this call will return the username and email of the new user.
// If an error occurs due to invalid req body or requirements, this call will return code 400.
router.post("/", (req, res) => {
  var user = _.pick(req.body, ["username", "email", "password"]);
  debug("Request to create user: " + JSON.stringify(user));

  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  // TODO: check if user is in the database

  user = new User(user);
  // TODO: insert user into the database, salt password using bcrypt

  debug("Creating user: " + JSON.stringify(user));
  res.send(_.pick(user, ["username", "email"]));
});

// TODO: update user

// TODO: delete user

// TODO: login/validate

module.exports = router;
