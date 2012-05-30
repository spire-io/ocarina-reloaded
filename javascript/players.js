var players = 0;
var myPlayerNumber;

function movePlayer(moveData){
    $('.' + moveData[0] + '').css('left', moveData[1] * 32);    
    $('.' + moveData[0] + '').css('top', moveData[2] * 32);
}

function drawPlayer(moveData){
  $('.canvas').append("<img class='" + moveData[0] + "' src='images/sprites/" + moveData[0] + ".png'>");
  $('.' + moveData[0] + '').css('position', 'absolute');
  $('.' + moveData[0] + '').css('left', moveData[1] * 32);    
  $('.' + moveData[0] + '').css('top', moveData[2] * 32);
}

function drawMe(moveData){
  // Positions to place the character randomly
  do {
    posX = Math.floor(Math.random()*20);
    posY = Math.floor(Math.random()*20);  
  } while ((map[posY][posX] == 0) || (map[posY][posX] == 7));
  
  myPlayerNumber = players;
  
  $('.canvas').append("<img class='player-" + myPlayerNumber + "' src='images/sprites/player-" + myPlayerNumber + ".png'>");
  
  $('.playerList').append('Player ' + myPlayerNumber + '(YOU)');
  
  $('.player-' + myPlayerNumber).css('position', 'absolute');
  $('.player-' + myPlayerNumber).css('top', posY * 32);
  $('.player-' + myPlayerNumber).css('left', posX * 32);
  
  channel.publish("player-" + myPlayerNumber + "/" + posX + "/" + posY + "/Welcome");
}