// This is the core of the app. This is where magic happens

//We load Spire and instantiate it
var Spire = require('./spire.io.js');
var spire = new Spire();

var APP_KEY = "Ap-rEYB";

// We assign the player a number based on the timestamp
var myPlayerNumber = Date.now();

// Url and caps for channel and subscription
var channelUrlAndCaps = {
  url: "https://api.spire.io/account/Ac-qy8B/channel/Ch-qzgC",
  capabilities: {
    publish: "VKMKDDiMY9ARQSkmeGrem0A"
  }
};

var subscriptionsUrlAndCaps = {
  url: "https://api.spire.io/account/Ac-qy8B/subscriptions",
  capabilities: {
    'create': "pot2U9GfBHDiMKWfVpBi55A"
  }
};

// Actually channel and subscription that we will get from Spire with the above capabilities
var channel = null;
var subscription = null;

// The messageListener runs for every message received.
function messageListener (message) {
  if (!myPlayerNumber) {
    return;
  }

  // If someone asks for our position, we send it.
  // Players ask for everyone else's position when they start playing.
  if (message.content === "Send me your positions"){
    // We add a "Welcome" item at the end so other players can count us
    channel.publish({ playerNumber: myPlayerNumber, type: 'welcome', x: posX, y: posY });
    return;
  }
  
  if (message.content.type === 'move'){
    // We transform the message into an array that stores the move data
    var moveData = message.content;
    
    // We count the players currently online, counting all welcome messages
    // but we don't count undefined players and we don't count the current user.
    var playerNumber = moveData.playerNumber;
    if (playerNumber !== myPlayerNumber) {
      drawPlayer(playerNumber, moveData.x, moveData.y);
    }
  }
  
  if ((message.content.type === 'attack') && (message.content.playerNumber !== myPlayerNumber)){
    if ((message.content.x === posX) && (message.content.y === posY)){
      deaths++;
      refreshStats();
      relocatePlayer();
    }
  }
}

function joinListener (joinEvent) {
  console.log('join detected');
}

function partListener (partEvent) {
  console.log('part detected');

  removePlayer(partEvent.subscription_name);
}

function refreshStats() {
  $('.stats').html("You have killed " + killings + " people</br>");
  $('.stats').append("You have been killed " + deaths + " times</br>");
}

function startGame() {
  // Start by drawing the map
  drawMap();

  toggleViews();

  spire.api.channelFromUrlAndCapabilities(channelUrlAndCaps, function (err, chan) {
    if (err) {
      console.error("Error getting channel.");
      console.error(err);
      return;
    }

    channel = chan;

    spire.api.sessionFromUrlAndCapabilities({
      resources: {
        subscriptions: subscriptionsUrlAndCaps
      },
      capabilities: {}
    }, function (err, session) {
      if (err) {
        console.error("Error getting session.");
        console.error(err);
        return;
      }

      session.createSubscription({
        name: myPlayerNumber,
        channelUrls: [channel.url()],
        expiration: 60000
      }, function (err, sub) {
        if (err) {
          console.error("Error getting subscription.");
          console.error(err);
          return;
        }
        subscription = sub;

        //TODO: checkAvailability();
        // We add the listener to get every incoming message
        subscription.addListener('message', messageListener);

        subscription.addListener('join', joinListener);

        subscription.addListener('part', partListener);

        // We need to startListening to get the messages
        subscription.startListening({ min_timestamp: 'now' });

        // And let everyone we're here. We need to know where they are.              
        channel.publish("Send me your positions");

        // Start my player
        initializeMyPlayer();
      });
    });
    
    refreshStats();
  });
}

$(document).ready(function(){
  // Authentication Form elements
  var authenticationForm = $('#authenticationForm')
    , loginInput = authenticationForm.find('#login')
    , passwordInput = authenticationForm.find('#password')
    , loginButton = authenticationForm.find('#loginButton')
    , joinButton = authenticationForm.find('#joinButton')
    , gameBox = $('.gameBox')
    ;

  // Toggle between login form and note view
  function toggleView () {
    loginInput.val('');
    passwordInput.val('');

    authenticationForm.toggle();
    gameBox.toggle();
  }

  // Login button listener
  loginButton.click(function (e) {
    e.preventDefault();

    var login = loginInput.val();
    var password = passwordInput.val();

    if (!login.length || !password.length) {
      alert("Please enter a valid login and password.");
      return;
    }

    spire.getApplication(APP_KEY, function (err, app) {
      if (err) return console.error(err);
      app.authenticateMember(login, password, function (err, member) {
        if (err) return alert("Unauthorized!");
        console.log('Authentication Successful');

        myMember = member;
        toggleView();
        showNotes();
      });
    });
  });

  // Join button listener
  joinButton.click(function (e) {
    e.preventDefault();

    var login = loginInput.val();
    var password = passwordInput.val();

    if (!login.length || !password.length) {
      alert("Please enter a valid login and password.");
      return;
    }

    spire.getApplication(APP_KEY, function (err, app) {
      if (err) return console.error(err);

      app.createMember(login, password, function (err, member) {
        if (err && err.status === 409) return alert("User already exists!")
        if (err) return alert("Problem creating user!");
        console.log('Registration Successful');

        myMember = member;
        toggleView();
        showNotes();
      });
    });
  });
});

function keyListener(evt) {
  evt = evt || window.event;
  switch (evt.keyCode) {
    case 32:
      evt.preventDefault();
      // Space bar
      attack();
      break;
    case 37:
      evt.preventDefault();
      // Left arrow
      moveMyPosition(-1, 0);
      break;
    case 38:
      evt.preventDefault();
      // Up arrow
      moveMyPosition(0, -1);
      break;
    case 39:
      evt.preventDefault();
      // Right arrow
      moveMyPosition(1, 0);
      break;
    case 40:
      evt.preventDefault();
      // Down arrow
      moveMyPosition(0, 1);
      break;
  }
}


