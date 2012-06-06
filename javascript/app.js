// This is the core of the app. This is where magic happens

//We load Spire and instantiate it
var Spire = require('./spire.io.js');
var spire = new Spire();

var APP_KEY = "Ap-rEYB";

// Url and publish cap for channel.
// Allows uses to publish their movements and attacks.
var channelUrlAndCaps = {
  url: "https://api.spire.io/account/Ac-qy8B/channel/Ch-qzgC",
  capabilities: {
    publish: "VKMKDDiMY9ARQSkmeGrem0A"
  }
};

// Url and creation cap for subscriptions.
// Allows members to create their own subscriptions.
var subscriptionsUrlAndCaps = {
  url: "https://api.spire.io/account/Ac-qy8B/subscriptions",
  capabilities: {
    'create': "pot2U9GfBHDiMKWfVpBi55A"
  }
};

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

    spire.api.channelFromUrlAndCapabilities(channelUrlAndCaps, function (err, channel) {
      if (err) {
        console.error("Error getting channel.");
        console.error(err);
        return;
      }

      function createSubscription(cb) {
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

          var profile = member.profile();
          profile.myPlayerNumber = profile.myPlayerNumber || Date.now();

          session.createSubscription({
            name: profile.myPlayerNumber,
            channelUrls: [channel.url()],
            expiration: 10000
          }, cb);
        });
      }

      if (member.profile().subscriptionUrlAndCaps) {
        spire.api.subscriptionFromUrlAndCapabilities(member.profile().subscriptionUrlAndCaps, function (err, sub) {
          if (err) {
            console.error("Error getting subscription.");
            console.error(err);
            return;
          }

          // Try to get the subscription to make sure it still exists
          sub.retrieveEvents({limit: 1, last: 0, timeout: 0}, function (err) {
            if (err) {
              // Subscription has expired on us
              createSubscription(function (err, sub) {
                ocarina = new Ocarina(member);
                ocarina.member.profile().subscriptionUrlAndCaps = sub.data;
                ocarina.updateProfile();
                ocarina.start(channel, sub);
              });
            } else {
              // Subscription is good to go
              ocarina = new Ocarina(member);
              ocarina.start(channel, sub);
            }
          });
        });
      } else {
        createSubscription(function (err, sub) {
          if (err) {
            console.error("Error getting subscription.");
            console.error(err);
            return;
          }

          ocarina = new Ocarina(member);
          ocarina.member.profile().subscriptionUrlAndCaps = sub.data;
          ocarina.updateProfile();
          ocarina.start(channel, sub);
        });
      }
    });
  }
}

$(document).ready(init);

