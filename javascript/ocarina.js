function Ocarina (member) {
  this.member = member;

  this.profile = member.profile();

  this.myPlayerNumber = this.profile.myPlayerNumber;
  this.profile.deaths = this.profile.deaths || 0;
  this.profile.kills = this.profile.kills || 0;

  this.map = new Map(this.myPlayerNumber);

  this.updateMyStats();

  this.posY = 0;
  this.posX = 0;

  this.isDead = false;
}

Ocarina.prototype.start = function (channel, sub) {
  this.channel = channel;
  this.sub = sub;

  this.map.draw();

  var ocarina = this;
  // We add the listener to get every incoming message
  sub.addListener('message', function (e) { ocarina.messageListener(e); });
  sub.addListener('join', function (e) { ocarina.joinListener(e); });
  sub.addListener('part', function (e) { ocarina.partListener(e); });

  // We need to startListening to get the messages
  sub.startListening({ min_timestamp: 'now' });

  document.addEventListener('keydown', function (e) { ocarina.keyListener(e); });

  this.send('position_request');
  this.moveToRandomPosition();
};

Ocarina.prototype.updateProfile = function () {
  this.member.update({
    profile: this.profile
  }, function (err) {
    if (err) console.error ("Error updating profile.")
  });
};

Ocarina.prototype.moveToRandomPosition = function () {
  var randomPosition = this.map.getRandomValidPosition();

  // Draws our position and sends to all players
  this.moveMyPositionTo(randomPosition.x, randomPosition.y);
};

Ocarina.prototype.moveMyPositionBy = function (deltaX, deltaY) {
  this.moveMyPositionTo(this.posX + deltaX, this.posY + deltaY);
};

Ocarina.prototype.moveMyPositionTo = function (x, y) {
  if (this.map.isValidPosition(x, y)) {
    this.posX = x;
    this.posY = y;
    this.map.drawPlayer(this.myPlayerNumber, this.posX, this.posY);
    this.send('move');
  }
};

Ocarina.prototype.send = function (eventType) {
  this.channel.publish({
    playerNumber: this.myPlayerNumber,
    type: eventType,
    x: this.posX,
    y: this.posY
  });
};

Ocarina.prototype.attack = function () {
  this.send('attack');

  this.map.drawPlayer(this.myPlayerNumber, this.posX, this.posY, true);

  // Remove the attack avatar
  var t = this;
  setTimeout(function () {
    if (!t.isDead) {
      t.map.drawPlayer(t.myPlayerNumber, t.posX, t.posY, false);
    }
  }, 300);

  var playersAttacked = this.map.getPlayersAtPosition(this.posX, this.posY);

  // We are the only player attacked.
  if (playersAttacked.length <= 1) {
    return;
  }

  for (var i = 0; i < playersAttacked.length; i++) {
    var playerNumber = playersAttacked[i];
    if (playerNumber == this.myPlayerNumber) {
      continue;
    }
    this.profile.kills++
    this.map.drawDeadPlayer(playerNumber, this.posX, this.posY);
  }

  this.updateMyStats();
};

Ocarina.prototype.updateMyStats = function () {
  this.updateProfile();
  this.map.updateStats({
    kills: this.profile.kills,
    deaths: this.profile.deaths
  });
};

// The messageListener runs for every message received.
Ocarina.prototype.messageListener = function (message) {
  var messageData = message.content;
  var messageType = messageData.type;

  // Ignore our own messages
  if (messageData.playerNumber == this.myPlayerNumber) {
    return;
  }

  if (messageType === "position_request") {
    this.send('move');
  }

  if (messageType === 'move'){
    if (messageData.playerNumber !== this.myPlayerNumber) {
      this.map.drawPlayer(messageData.playerNumber, messageData.x, messageData.y);
    }
  }

  if (messageType === 'attack') {
    if (this.isDead) {
      return;
    }

    if ((messageData.x == this.posX) && (messageData.y == this.posY)){
      this.profile.deaths++;
      this.updateMyStats();

      this.map.drawDeadPlayer(this.myPlayerNumber, this.posX, this.posY);

      this.isDead = true;

      this.send('death');

      // Wait 5 seconds before respawning
      var t = this;
      setTimeout(function () {
        t.isDead = false;
        t.moveToRandomPosition();
      }, 5000);
    }
  }

  if (messageType === 'death') {
    this.map.drawDeadPlayer(messageData.playerNumber, messageData.x, messageData.y);
  }
};

Ocarina.prototype.joinListener = function (joinEvent) {
  console.log('join detected');
};

Ocarina.prototype.partListener = function (partEvent) {
  console.log('part detected');
  this.map.removePlayer(partEvent.subscription_name);
};

Ocarina.prototype.keyListener = function (evt) {
  evt = evt || window.event;

  if (this.isDead) {
    evt.preventDefault();
    return;
  }

  switch (evt.keyCode) {
    case 32:
      // Space bar
      evt.preventDefault();
      this.attack();
      break;
    case 37:
      // Left arrow
      evt.preventDefault();
      this.moveMyPositionBy(-1, 0);
      break;
    case 38:
      // Up arrow
      evt.preventDefault();
      this.moveMyPositionBy(0, -1);
      break;
    case 39:
      // Right arrow
      evt.preventDefault();
      this.moveMyPositionBy(1, 0);
      break;
    case 40:
      // Down arrow
      evt.preventDefault();
      this.moveMyPositionBy(0, 1);
      break;
  }
};


