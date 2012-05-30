var map = [
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
var posX = 0;
var posY = 0;

function drawMap() {
  for(var i in map){
    for(var j in map[i]){
      $('.canvas').append("<img id='terrain' src='images/tiles/terrain-" + map[i][j] + ".png'>");
    }
    $('.canvas').append("<br />");
  }
}

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