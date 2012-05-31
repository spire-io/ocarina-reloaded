// This is the players file. We control the players here.
// NOTE: When do 'posX * 32' we do it because every square in the map is 32x32
// That way, we move the player 32px on any direction when we press the keys.

var players = 0; //Number of players currently playing
var myPlayerNumber; //Player number assigned to the user
// User's position on the X and Y axis
var posX = 0;
var posY = 0;

//Moves any player (except the user). Receives an array where:
// moveData[0] is the player name
// moveData[1] is the position of the X axis
// moveData[2] is the position of the Y axis
function movePlayer(){
    $('.' + moveData[0] + '').css('left', moveData[1] * 32);    
    $('.' + moveData[0] + '').css('top', moveData[2] * 32);
}

//Draws any player (except the user) when they start playing. Receives an array where:
// moveData[0] is the player name
// moveData[1] is the position of the X axis
// moveData[2] is the position of the Y axis
function drawPlayer(){
  $('.canvas').append("<img class='" + moveData[0] + "' src='images/sprites/" + moveData[0] + ".png'>");
  $('.' + moveData[0] + '').css('position', 'absolute');
  $('.' + moveData[0] + '').css('left', moveData[1] * 32);    
  $('.' + moveData[0] + '').css('top', moveData[2] * 32);
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
  $('.player-' + myPlayerNumber).css('top', posY * 32);
  $('.player-' + myPlayerNumber).css('left', posX * 32);
  
  // We send a Welcome message to let everyone else where we are.
  channel.publish("player-" + myPlayerNumber + "/" + posX + "/" + posY + "/Welcome");
}

// These are the methods that move the user's avatar when they press a direction key
// First we check we're not reaching the limits
// Then we check we're not going to step on rocks or water if we move
// After that, we update the position and move the player.
function leftArrowPressed() {
  if (posX == 0){
    return;
  }
  
  if ((map[posY][posX - 1] == 0) || (map[posY][posX - 1] == 7)){
    return;
  }
  
  posX -= 1;
  $('.player-' + myPlayerNumber).css('left', posX * 32);
}

function rightArrowPressed() {
  if (posX == 19){
    return;
  }
  
  if ((map[posY][posX + 1] == 0) || (map[posY][posX + 1] == 7)){
    return;
  }
  
  posX += 1; 
  $('.player-' + myPlayerNumber).css('left', posX * 32);
}

function upArrowPressed() {
  if (posY == 0){
    return;
  }
  
  if ((map[posY - 1][posX] == 0) || (map[posY - 1][posX] == 7)){
    return;
  }
  
  posY -= 1; 
  $('.player-' + myPlayerNumber).css('top', posY * 32);
}

function downArrowPressed() {
  if (posY == 19){
    return;
  }
  
  if ((map[posY + 1][posX] == 0) || (map[posY + 1][posX] == 7)){
    return;
  }
  
  posY += 1;
  $('.player-' + myPlayerNumber).css('top', posY * 32);
}