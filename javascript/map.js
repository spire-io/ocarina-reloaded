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
  this.playerStats = {}
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
Map.prototype.drawPlayer = function (playerNumber, x, y, attacking) {
  var playerName = "player-" + playerNumber;
  var playerClass = '.' + playerName;
  var avatarName = "player-" + (playerNumber % 10);

  attacking = attacking || false;

  var isMe = false;

  if (playerNumber === this.myPlayerNumber) {
    isMe = true;
    
    if (attacking) {
      avatarName += '-stab';
    } else {
      avatarName += '-active';
    }
  }

  this.removeDeadPlayer(playerNumber);

  // Check to see if player is already on the board
  if (isMe || $(playerClass).length === 0) {
    this.removePlayer(playerNumber);
    // Add the player
    $('.canvas').append("<img class='" + playerName + "' src='images/sprites/" + avatarName + ".png' style='position:absolute'>");
  }

  $(playerClass).css({
    left: 32*x,
    top: (32*y)
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

  this.removeDeadPlayer(playerNumber);

  delete this.playerLocations[playerNumber];
};

Map.prototype.removeDeadPlayer = function(playerNumber) {
  var playerName = "player-" + playerNumber;
  var playerClass = '.' + playerName + '-dead';
  // Remove any dead player
  $(playerClass).remove();
};

Map.prototype.drawDeadPlayer = function (playerNumber, x, y) {
  var playerName = "player-" + playerNumber;
  var playerClass = '.' + playerName + '-dead';
  var avatarName = "player-" + (playerNumber % 10) + '-dead';

  this.removePlayer(playerNumber);

  $('.canvas').append("<img class='" + playerName + "-dead' src='images/sprites/" + avatarName + ".png' style='position:absolute'>");

  $(playerClass).css({
    left: 32*x,
    top: 32*y
  });
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
  if (stats.playerNumber === this.myPlayerNumber){
    $('.stats').html('<img src="images/sprites/kill-stat.png" alt="kill-stat" width="26" height="21" /> You have killed ' + stats.kills + ' people</br>');
    $('.stats').append('<img src="images/sprites/dead-stat.png" alt="kill-stat" width="26" height="21" /> You have been killed ' + stats.deaths + ' times</br>');
  }
  this.playerStats[stats.playerNumber] = {
    kills: stats.kills,
    deaths: stats.deaths,
    playerName: stats.playerName
  }
  this.updatePlayerList();
};

Map.prototype.updatePlayerList = function () {
  $('.playerList').html("");
  
  for(var player in this.playerStats){
    $('.playerList').append(this.playerStats[player].playerName.toUpperCase() + ": " + this.playerStats[player].kills + " / " + this.playerStats[player].deaths + "</br>");
  }
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
