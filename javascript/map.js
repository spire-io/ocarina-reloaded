// This is the map file. We control the map here. 
// Every number is a square in the map.
// Every square will be represented by a 32x32 image.
// We have different types of terrains. we are using:
// 0 for water
// 1 for sand
// 7 for rocks
// The numbers will be part of the image name: terrain-0, terrain-1, ...

// Map constructor
function Map(myPlayerNumber) {
  this.playerLocations = {};
  this.myPlayerNumber = myPlayerNumber;
};

// We initialize the map matrix drawing whatever we want
Map.data = [
  [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7],
  [7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7],
  [7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7],
  [7, 1, 1, 1, 1, 7, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 7],
  [7, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 7],
  [7, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 7],
  [7, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 7],
  [7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 7],
  [7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7],
  [7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7],
  [7, 1, 1, 0, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7],
  [7, 7, 7, 7, 7, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7],
  [7, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7],
  [7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 1, 7],
  [7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7],
  [7, 1, 1, 1, 1, 1, 1, 7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7],
  [7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7],
  [7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7],
  [7, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 7],
  [7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7, 7]
];

Map.prototype.draw = function () {
  // We draw the map changing every number for it corresponding image.
  for(var i in Map.data){
    for(var j in Map.data[i]){
      $('.canvas').append("<img id='terrain' src='images/tiles/terrain-" + Map.data[i][j] + ".png'>");
    }
    $('.canvas').append("<br />");
  }
};

//Moves any player.
Map.prototype.drawPlayer = function (playerNumber, x, y) {
  var playerName = "player-" + playerNumber;
  var playerClass = '.' + playerName;
  var avatarName = "player-" + (playerNumber % 10);

  if (playerNumber === this.myPlayerNumber) {
    avatarName += '-active';
  }

  // Check to see if player is already on the board
  if ($(playerClass).length === 0) {
    // Add the player
    $('.canvas').append("<img class='" + playerName + "' src='images/sprites/" + avatarName + ".png' style='position:absolute'>");
  }

  $(playerClass).css({
    left: 32*x,
    top: 32*y
  });

  this.playerLocations[playerNumber] = {
    x: x,
    y: y
  };
};

// Remove a player from the map.
Map.prototype.removePlayer = function(playerNumber) {
  var playerName = "player-" + playerNumber;
  var playerClass = '.' + playerName;
  $(playerClass).remove();
  delete this.playerLocations[playerNumber];
};

Map.prototype.getPlayerPosition = function (playerNumber) {
  return this.playerLocations[playerNumber];
};

Map.prototype.getPlayersAtPosition = function (x, y) {
  var players = [];
  for (var playerNumber in this.playerLocations) {
    var playerLocation = this.getPlayerPosition(playerNumber);
    if ((playerLocation.x === x) && (playerLocation.y === y)) {
      players.push(playerNumber);
    }
  }
  return players;
};

Map.prototype.updateStats = function (stats) {
  $('.stats').html("You have killed " + stats.kills + " people</br>");
  $('.stats').append("You have been killed " + stats.deaths + " times</br>");
};

// Returns true if the position is on the map, and is not rocks or water.
// First we check we're not reaching the limits
// Then we check we're not going to step on rocks or water if we move
Map.prototype.isValidPosition = function (x, y) {
  var mapType = Map.data[y][x];
  return (
    (mapType !== 0) && (mapType !== 7) &&
    (x >= 0) && (x <= 19) &&
    (y >= 0) && (y <= 19)
  );
};

// We make sure not to place the character over rocks or water.
Map.prototype.getRandomValidPosition = function () {
  var x, y;
  do {
    x = Math.floor(Math.random()*20);
    y = Math.floor(Math.random()*20);
  } while (!this.isValidPosition(x, y))

  return {
    x: x,
    y: y
  };
}
