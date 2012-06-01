// This is the players file. We control the players here.
// NOTE: When do 'posX * 32' we do it because every square in the map is 32x32
// That way, we move the player 32px on any direction when we press the keys.

var players = 0; //Number of players currently playing
var myPlayerNumber; //Player number assigned to the user
// User's position on the X and Y axis
var posX = 0;
var posY = 0;

//Moves any player (except the user). Receives an array where:
function movePlayer(playerName, x, y){
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
function drawMe(){
  // Positions to place the character randomly. 
  // We make sure not to place the character over rocks or water.
  do {
    posX = Math.floor(Math.random()*20);
    posY = Math.floor(Math.random()*20); 
  } while ((map[posY][posX] == 0) || (map[posY][posX] == 7));
  
  // We assign the player a number based on how many players are online
  myPlayerNumber = players;
  
  // Every player's avatar is an image which class is the player's name
  $('.canvas').append("<img class='player-" + myPlayerNumber + "' src='images/sprites/player-" + myPlayerNumber + ".png'>");
  
  // This is the list of players
  $('.playerList').append('Player ' + myPlayerNumber + '(YOU)');
  
  // Finally, we place the avatar wherever the character is placed.
  $('.player-' + myPlayerNumber).css('position', 'absolute');
  drawMyPosition();
  
  // We send a Welcome message to let everyone else where we are.
  channel.publish("player-" + myPlayerNumber + "/" + posX + "/" + posY + "/Welcome");
}

// Returns true iff the position is on the map, and is not fire or water.
// First we check we're not reaching the limits
// Then we check we're not going to step on rocks or water if we move
function isValidPos(x, y) {
  var mapType = map[y][x];
  return (
    (mapType !== 0) && (mapType !== 7) &&
    (x >= 0) && (x <= 19) &&
    (y >= 0) && (y <= 19)
  );
}

// Draws our charactor on the map.
function drawMyPosition () {
  $('.player-' + myPlayerNumber).css('left', posX * 32);
  $('.player-' + myPlayerNumber).css('top', posY * 32);
}

// These are the methods that move the user's avatar when they press a direction key
// After that, we update the position and move the player.
function moveMyPosition (deltaX, deltaY) {
  var newPosX = posX + deltaX;
  var newPosY = posY + deltaY;

  if (isValidPos(newPosX, newPosY)) {
    posX = newPosX;
    posY = newPosY;
    drawMyPosition();
  }
}

function leftArrowPressed() {
  moveMyPosition(-1, 0);
}

function rightArrowPressed() {
  moveMyPosition(1, 0);
}

function upArrowPressed() {
  moveMyPosition(0, -1);
}

function downArrowPressed() {
  moveMyPosition(0, 1);
}
