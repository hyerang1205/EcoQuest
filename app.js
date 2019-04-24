const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const debug = require("debug")("comp2930-team2:server");
const consolidate = require("consolidate");

var indexRouter = require("./routes/index");
var gameRouter = require("./routes/game");
var usersRouter = require("./routes/users");

var app = express();

// Set the rendering engine to mustache
app.engine("html", consolidate.mustache);
app.set("view engine", "html");

// Setting the console color to include time and color
require("console-stamp")(console, {
  pattern: "ddd mmm dd HH:MM:ss",
  colors: {
    stamp: "yellow"
  }
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Not sure if we are going to use cookies
app.use(cookieParser());

// public will hold static basic files
// game/public will hold static files for games

// Remove the public static folder if handling all UI with Phaser
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static(path.join(__dirname, "game/public")));

// / - route basic windows such as logging in and stuff
// /game - route to game files
app.use("/", indexRouter);
app.use("/game", gameRouter);

module.exports = app;