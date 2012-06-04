// This is the core of the app. This is where magic happens

// Url and caps for channel and subscription
var channelUrlAndCaps = {
  url: "https://api.spire.io/account/Ac-qy8B/channel/Ch-qzgC",
  capabilities: {
    publish: "VKMKDDiMY9ARQSkmeGrem0A"
  }
};

var subscriptionUrlAndCaps = {
  url: "https://api.spire.io/account/Ac-qy8B/subscription/Su-qnQB",
  capabilities: {
    events: "7UNgwKv1AFuSCFzpPt2AjPw"
  }
};

// Actually channel and subscription that we will get from Spire with the above capabilities
var channel = null;
var subscription = null;

// The messageListener runs for every message received.
function messageListener (message) {
  console.log('Message received: ' + message.content);

  // If someone asks for our position, we send it.
  // Players ask for everyone else's position when they start playing.
  if (message.content === "Send me your positions"){
    if (myPlayerNumber >= 0) {
      // We add a "Welcome" item at the end so other players can count us
      channel.publish({ playerNumber: myPlayerNumber, type: 'welcome', x: posX, y: posY });
    }
  } else {
    // We transform the message into an array that stores the move data
    var moveData = message.content;
    
    // We count the players currently online, counting all welcome messages
    // but we don't count undefined players and we don't count the current user.
    var playerNumber = moveData.playerNumber;
    if (playerNumber !== myPlayerNumber) {
      console.log('HERE')
      // Set the player number to true, so we don't use it for ourselves
      drawPlayer(playerNumber, moveData.x, moveData.y);
    }
  }
}

$(document).ready(function(){
  //We load Spire and instantiate it
  var Spire = require('./spire.io.js');
  var spire = new Spire();

  // Start by drawing the map
  drawMap();

  spire.api.channelFromUrlAndCapabilities(channelUrlAndCaps, function (err, chan) {
    if (err) {
      console.error("Error getting channel.");
      console.error(err);
      return;
    }

    channel = chan;
    spire.api.subscriptionFromUrlAndCapabilities(subscriptionUrlAndCaps, function (err, subscription) {
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

      // Start my player
      initializeMyPlayer();
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
