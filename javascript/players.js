// This is the players file. We control the players here.
// NOTE: When do 'posX * 32' we do it because every square in the map is 32x32
// That way, we move the player 32px on any direction when we press the keys.

var players = 0; //Number of players currently playing
var myPlayerNumber; //Player number assigned to the user
// User's position on the X and Y axis
var posX = 0;
var posY = 0;

//Moves any player. playerName is of the form "player-X" for some number X.
function drawPlayer(playerName, x, y){
  var playerClass = '.' + playerName;

  // Check to see if player is already on the board
  if ($(playerClass).length === 0) {
    // Add the player
    $('.canvas').append("<img class='" + playerName + "' src='images/sprites/" + playerName + ".png' style='position:absolute'>");
  }

  $(playerClass).css({
    left: 32*x,
    top: 32*y
  });
}

//Draws the user when they start playing
function initializeMyPlayer(){
  // Positions to place the character randomly. 
  // We make sure not to place the character over rocks or water.
  do {
    posX = Math.floor(Math.random()*20);
    posY = Math.floor(Math.random()*20);
  } while ((map[posY][posX] == 0) || (map[posY][posX] == 7));
  
  // We assign the player a number based on how many players are online
  myPlayerNumber = players;

  drawPlayer('player-' + myPlayerNumber, posX, posY);

  // We send a Welcome message to let everyone else where we are.
  channel.publish("player-" + myPlayerNumber + "/" + posX + "/" + posY + "/Welcome");
}

// Returns true iff the position is on the map, and is not fire or water.
// First we check we're not reaching the limits
// Then we check we're not going to step on rocks or water if we move
function isValidPosition(x, y) {
  var mapType = map[y][x];
  return (
    (mapType !== 0) && (mapType !== 7) &&
    (x >= 0) && (x <= 19) &&
    (y >= 0) && (y <= 19)
  );
}

// These are the methods that move the user's avatar when they press a direction key
// After that, we update the position and move the player.
function moveMyPosition (deltaX, deltaY) {
  var newPosX = posX + deltaX;
  var newPosY = posY + deltaY;

  if (isValidPosition(newPosX, newPosY)) {
    posX = newPosX;
    posY = newPosY;
    drawPlayer('player-' + myPlayerNumber, posX, posY);
    channel.publish("player-" + myPlayerNumber + "/" + posX + "/" + posY);
  }
}
