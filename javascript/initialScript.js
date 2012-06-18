$(document).ready(function(){
  var Spire = require('./spire.io.js')
  spire = new Spire();

  spire.start("YOUR-ACCOUNT-SECRET", function (err) {
    if (!err) {
      // You now have a spire session.
      // Start creating channels and subscripions.
      
      spire.session.applications$(function (err, applications) {
        if (!err) {
         
        }
      });
      
      // Create our app
      // You can name the application anything you like
      spire.session.createApplication("ocarinaReloaded", function (err, app) {
        if (!err){
          createChannels(app);
        } else {
          spire.session.applicationByName("ocarinaReloaded", function (err, app) {
            if (!err) {
              createChannels(app);
            } else {
              $('h1').append('There has been some kind of error');
              return;
            }
          });
        }
      }); //createApplication      
    } //error
  }); //login
}); //ready

function createChannels (app) {
  // Create our main chat channel
  var channelName = "ocarinaGameChannel";
  app.createChannel(channelName, function (err, gameChannel) {
    if (!err){
      // Create a subscription for the newly created channel so our users can read messages
      var subscriptionName = 'ocarinaGameSubscription'
      gameChannel.subscription(subscriptionName, function (err, gameSubscription) {
        if (!err) {
          // `subscription` is the new named subscription.
        } else {
          $('h1').append('A subscription named ' + subscriptionName + 'already exists');
          return;
        }
      }); //subscription
    } else {
      $('h1').append('A channel named ' + channelName + 'already exists');
      return;
    }
  }); //create_channel
         
  var channelName = "ocarinaChatChannel";
  app.createChannel(channelName, function (err, chatChannel) {
    if (!err){
      // Create a subscription for the newly created channel so our users can read messages
      var subscriptionName = 'ocarinaChatSubscription'
      chatChannel.subscription(subscriptionName, function (err, gameSubscription) {
        if (!err) {
          // `subscription` is the new named subscription.
        } else {
          $('h1').append('A subscription named ' + subscriptionName + 'already exists');
          return;
        }
      }); //subscription
    } else {
      $('h1').append('A channel named ' + channelName + 'already exists');
      return;
    }
  }); //create_channel
  
  $('h1').append('Done! Ready to go');
}
