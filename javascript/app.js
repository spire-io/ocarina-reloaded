// This is the core of the app. This is where magic happens

var channel;
var moveData;

$(document).ready(function(){
  //We load Spire and instantiate it
  var Spire = require('./spire.io.js');
  var spire = new Spire();
  
  //We start the service
  spire.start('Ac-gN0gFRN1CDOc6uyV4SP5SA-gdtw', function (err, session) {
    // Get the channel and the subscription previously created
    var subscriptionName = "ocarinaGameSubscription";
    var channelName = "ocarinaGameChannel";
    spire.session.channelByName(channelName, function (err, chan) {
      if (!err) {
        channel = chan;
        spire.session.subscriptionByName(
          subscriptionName, 
          function (err, subscription) {
            if (!err) {
              //TODO: checkAvailability();
              // We add the listener to get every incoming message
              subscription.addListener('message', function (message) {
                console.log('Message received: ' + message.content);
                // If someone asks for our position, we send it.
                // Players ask for everyone else's position when they start playing.
                if (message.content === "Send me your positions"){
                  // We add a "Welcome" item at the end so other players can count us
                  channel.publish("player-" + myPlayerNumber + "/" + posX + "/" + posY + "/Welcome");
                } else {
                  // We transform the message into an array that stores the move data
                  moveData = message.content.split('/');
                  
                  // We count the players currently online, counting all welcome messages
                  // but we don't count undefined players and we don't count the current user.
                  if ((moveData[3] === "Welcome") && (moveData[0] != "player-undefined") && (moveData[0] != "player-" + myPlayerNumber)){
                    players++;
                    drawPlayer();
                  }
                  // If the message wasn't sent by current user, we move the player
                  if (moveData[0] != "player-" + myPlayerNumber){
                    movePlayer();
                  }
                }
              });
              
              // We need to startListening to get the messages
              subscription.startListening({ min_timestamp: 'now' });
              // And let everyone we're here. We need to know where they are.              
              channel.publish("Send me your positions");
              drawMap();
              // We put a delay here to have time to draw everyone else before we start.
              setTimeout('drawMe()', 5000);
            }
          }
        );
      }
    });    
  });
  
  // Listener for keydown. We move our avatar and send our position
  // The structure of the move message is "playerName/axisXposition/axisYposition"
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