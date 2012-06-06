// This is the core of the app. This is where magic happens

//We load Spire and instantiate it
var Spire = require('./spire.io.js');
var spire = new Spire();

var APP_KEY = "Ap-rEYB";

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

function init() {
  // Authentication Form elements
  var authenticationForm = $('#authenticationForm')
    , loginInput = authenticationForm.find('#login')
    , passwordInput = authenticationForm.find('#password')
    , loginButton = authenticationForm.find('#loginButton')
    , joinButton = authenticationForm.find('#joinButton')
    , gameBox = $('.gameBox')
    ;

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
        startGame(member);
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

      app.createMember({
        login: login,
        password: password
      }, function (err, member) {
        if (err && err.status === 409) return alert("User already exists!")
        if (err) return alert("Problem creating user!");
        console.log('Registration Successful');
        startGame(member);
      });
    });
  });

  function startGame (member) {
    authenticationForm.hide();
    gameBox.show();
    ocarina = new Ocarina(member);

    spire.api.channelFromUrlAndCapabilities(channelUrlAndCaps, function (err, channel) {
      if (err) {
        console.error("Error getting channel.");
        console.error(err);
        return;
      }

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
          name: ocarina.myPlayerNumber,
          channelUrls: [channel.url()],
          expiration: 60000
        }, function (err, sub) {
          if (err) {
            console.error("Error getting subscription.");
            console.error(err);
            return;
          }

          ocarina.start(channel, sub);
        });
      });
    });
  }
}

$(document).ready(init);

