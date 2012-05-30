var channel;
var moveData;

$(document).ready(function(){
  var Spire = require('./spire.io.js');
  var spire = new Spire();
  
  spire.start('Ac-gN0gFRN1CDOc6uyV4SP5SA-gdtw', function (err, session) {
    var subscriptionName = "ocarinaGameSubscription";
    var channelName = "ocarinaGameChannel";
    spire.session.channelByName(channelName, function (err, chan) {
      if (!err) {
        channel = chan;
        spire.session.subscriptionByName(
          subscriptionName, 
          function (err, subscription) {
            if (!err) {
              //checkAvailability();
              subscription.addListener('message', function (message) {
                console.log('Message received: ' + message.content);
                if (message.content === "Send me your positions"){
                  channel.publish("player-" + myPlayerNumber + "/" + posX + "/" + posY + "/Welcome");
                } else {
                  moveData = message.content.split('/');
                  
                  if ((moveData.length === 4) && (moveData[0] != "player-undefined") && (moveData[0] != "player-" + myPlayerNumber)){
                    players++;
                    drawPlayer(moveData);
                    console.log(players);
                  }
                  if (moveData[0] != "player-" + myPlayerNumber){
                    movePlayer(moveData);
                  }
                }
              });
              subscription.startListening({ min_timestamp: 'now' });              
              channel.publish("Send me your positions");
              drawMap();
              setTimeout('drawMe()', 5000);
            }
          }
        );
      }
    });    
  });
  
  document.onkeydown = function(evt) {
    evt = evt || window.event;
    switch (evt.keyCode) {
      case 37:
        leftArrowPressed();
        channel.publish("player-" + myPlayerNumber + "/" + posX + "/" + posY);
        break;
      case 38:
        upArrowPressed();
        channel.publish("player-" + myPlayerNumber + "/" + posX + "/" + posY);
        break;
      case 39:
        rightArrowPressed();
        channel.publish("player-" + myPlayerNumber + "/" + posX + "/" + posY);
        break;
      case 40:
        downArrowPressed();
        channel.publish("player-" + myPlayerNumber + "/" + posX + "/" + posY);
        break;
    }
  };
});