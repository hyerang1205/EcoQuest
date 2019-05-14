#!/usr/bin/env node

/**
 * Module dependencies.
 */
var app = require("../app");
var debug = require("debug")("comp2930-team2:server");
var http = require("http");

const self = this;
const maxPlayers = 4;
const players = [];

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */

var server = http.Server(app);
var io = require("socket.io").listen(server);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
}

//on the new user connection do the following
/// /////////
/// A1
/// server is up and running
/// server is made here.
/// //////

/// Connected A901

io.on("connection", function(socket) {
  //number of current sockets

  // hmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm
  //   if (Object.keys(io.sockets.sockets).length <= numberOfPlayers) {
  //     self.EcoQuest_numberOfCurrentPlayers = Object.keys(
  //       io.sockets.sockets
  //     ).length;
  //   }

  // cancel if at max capacity
  if (players.length >= maxPlayers) {
    return socket.close();
  }

  console.log("a user connected: " + socket.id);

  players.push({
    playerId: socket.id
  });

  //   if (self.EcoQuest_numberOfCurrentPlayers <= numberOfPlayers) {
  //     for (let i = 0; i < Game1_players.length; i++) {
  //       if (!Game1_players[i].isTaken) {
  //         self.playerNo = i;
  //         players[socket.id] = {
  //           playerNo: self.playerNo,
  //           playerId: socket.id
  //         };
  //         Game1_players[i].isTaken = true;
  //         console.log(
  //           "new player added, current players: ",
  //           self.EcoQuest_numberOfCurrentPlayers
  //         );
  //         printPlayers(Game1_players);
  //         break;
  //       }
  //     }
  //   } else {
  //     console.log("The room is full");
  //     disconnectPlayer(socket.id);
  //     console.log(
  //       "deleted attempted connect, current players: ",
  //       self.EcoQuest_numberOfCurrentPlayers
  //     );
  //   }

  // send the players to requesting user
  socket.on("currentPlayers", () => {
    socket.emit("currentPlayers", players);
    console.log("currentPlayers: " + JSON.stringify(players));
  });

  // update all other players of the new player
  socket.broadcast.emit(
    "newPlayer",
    players.find(player => player.id === socket.id)
  );

  //user disconnected, broadcast to all other users and remove from list
  socket.on("disconnect", function() {
    socket.broadcast.emit(
      "removedPlayer",
      players.find(player => player.id === socket.id)
    );
    delete players.find(player => player.id === socket.id);
    socket.close();
  });

  socket.on("me", function() {
    socket.emit("me", players.find(player => player.id === socket.id));
  });

  // when a player moves, update the player data
  //then sends it to the other players in socket.broadcast.emit*'playermoved'

  // client side code
  //   socket.on("playerMovement", function(movementData) {
  //     if (players[socket.id] != undefined) {
  //       players[socket.id].platformX = movementData.platformX;
  //       players[socket.id].platformY = movementData.platformY;
  //       players[socket.id].avatarX = movementData.avatarX;
  //       players[socket.id].avatarY = movementData.avatarY;
  //     }
  // emit a message to all players about the player that moved
  //     socket.broadcast.emit("playerMoved", players[socket.id]);
  //   });
  //Kicks the user out when he's not doing anything for 2 min.

  // setTimeout(() => disconnectPlayer(socket.id), 120000);

  socket.on("playerAnswered", function(data) {
    Game1_players[players[socket.id].playerNo].answeredQuestion = data.data;
    if (allPlayerAnswered(self.EcoQuest_numberOfCurrentPlayers)) {
      io.sockets.emit("allPlayerAnswered", { data: true });
      for (let i = 0; i < numberOfPlayers; i++) {
        Game1_players[i].answeredQuestion = false;
      }
      console.log("server.js allPlayerAnswered fired.");
    }
  });
}); ///////////io.on ends here

function printPlayers(coordinates) {
  for (let i = 0; i < coordinates.length; i++) {
    // ???????????????
    console.log(coordinates[i].isTaken);
  }
}

// function disconnectPlayer(id) {
//   console.log("user ", id, " attempts to disconnect..");
//   if (players[id] != undefined) {
//     // console.log("disc: ", players[id].playerNo);
//     Game1_players[players[id].playerNo].isTaken = false;
//     delete players[id];
//     io.emit("disconnect", id);
//     if (self.EcoQuest_numberOfCurrentPlayers > 0) {
//       self.EcoQuest_numberOfCurrentPlayers--;
//     }
//     console.log(
//       "current number of players ",
//       self.EcoQuest_numberOfCurrentPlayers
//     );
//     printPlayers(Game1_players);
//   } else {
//     console.log("User not exist, deleted already or never created");
//     console.log(
//       "current number of players ",
//       self.EcoQuest_numberOfCurrentPlayers
//     );
//   }
// }

function allPlayerAnswered(number) {
  console.log("allPlayerAnswered called ", number);
  // console.log(players," list of players");
  // console.log(Object.keys(io.sockets.sockets)[0].playerNo);

  for (let i = 0; i < number; i++) {
    let num = players[Object.keys(io.sockets.sockets)[i]].playerNo;
    console.log("current playerNumbers...: ", num);
    console.log(i, " hi");
    if (!Game1_players[num].answeredQuestion) {
      console.log("all player answered return false");
      return false;
    }
  }
  console.log("all player answered return true");
  return true;
}
