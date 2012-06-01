// This is the core of the app. This is where magic happens

var channel;

// The messageListener runs for every message received.
function messageListener (message) {
  console.log('Message received: ' + message.content);

  // If someone asks for our position, we send it.
  // Players ask for everyone else's position when they start playing.
  if (message.content === "Send me your positions"){
    if (myPlayerNumber >= 0) {
      // We add a "Welcome" item at the end so other players can count us
      channel.publish("player-" + myPlayerNumber + "/" + posX + "/" + posY + "/Welcome");
    }
  } else {
    // We transform the message into an array that stores the move data
    var moveData = message.content.split('/');
    
    // We count the players currently online, counting all welcome messages
    // but we don't count undefined players and we don't count the current user.
    var playerNumber = moveData[0].match(/player-(.*)/)[1];
    if (playerNumber !== myPlayerNumber) {
      // Set the player number to true, so we don't use it for ourselves
      drawPlayer(playerNumber, moveData[1], moveData[2]);
    }
  }
}

$(document).ready(function(){
  //We load Spire and instantiate it
  var Spire = require('./spire.io.js');
  var spire = new Spire();

  // Start by drawing the map
  drawMap();

  //We start the service
  spire.start('Ac-gN0gFRN1CDOc6uyV4SP5SA-gdtw', function (err, session) {
    // Get the channel and the subscription previously created
    var subscriptionName = "ocarinaGameSubscription";
    var channelName = "ocarinaGameChannel";

    spire.session.channelByName(channelName, function (err, chan) {
      if (err) {
        console.error("Error getting channel.");
        console.error(err);
        return;
      }

      channel = chan;
      spire.session.subscriptionByName(subscriptionName, function (err, subscription) {
        if (err) {
          console.error("Error getting subscription.");
          console.error(err);
          return;
        }

        //TODO: checkAvailability();
        // We add the listener to get every incoming message
        subscription.addListener('message', messageListener);

        // We need to startListening to get the messages
        subscription.startListening({ min_timestamp: 'now' });

        // And let everyone we're here. We need to know where they are.              
        channel.publish("Send me your positions");

        // We put a delay here to have time to draw everyone else before we start.
        setTimeout(initializeMyPlayer, 5000);
      });
    });
  });
  
  // Listener for keydown. We move our avatar and send our position
  // The structure of the move message is "playerName/axisXposition/axisYposition"
  document.onkeydown = function(evt) {
    evt = evt || window.event;
    switch (evt.keyCode) {
      case 37:
        // Left arrow
        moveMyPosition(-1, 0);
        break;
      case 38:
        // Up arrow
        moveMyPosition(0, -1);
        break;
      case 39:
        // Right arrow
        moveMyPosition(1, 0);
        break;
      case 40:
        // Down arrow
        moveMyPosition(0, 1);
        break;
    }
  };
});
