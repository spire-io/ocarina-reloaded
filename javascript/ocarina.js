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

  this.sendPositionRequest();
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
  this.moveMyPosition(randomPosition.x, randomPosition.y);
};

Ocarina.prototype.moveMyPositionBy = function (deltaX, deltaY) {
  this.moveMyPosition(this.posX + deltaX, this.posY + deltaY);
};

Ocarina.prototype.moveMyPosition = function (x, y) {
  if (this.map.isValidPosition(x, y)) {
    this.posX = x;
    this.posY = y;
    this.map.drawPlayer(this.myPlayerNumber, this.posX, this.posY);
    this.sendMyPosition();
  }
};

Ocarina.prototype.sendMyPosition = function () {
  this.channel.publish({
    playerNumber: this.myPlayerNumber,
    type: 'move',
    x: this.posX,
    y: this.posY
  });
};

Ocarina.prototype.sendPositionRequest = function () {
  this.channel.publish({
    playerNumber: this.myPlayerNumber,
    type: 'position_request'
  });
};

Ocarina.prototype.sendDeath = function () {
  this.channel.publish({
    playerNumber: this.myPlayerNumber,
    type: 'death',
    x: this.posX,
    y: this.posY
  });
};

Ocarina.prototype.sendAttack = function () {
  this.channel.publish({
    playerNumber: this.myPlayerNumber,
    type: 'attack',
    x: this.posX,
    y: this.posY
  });
};

Ocarina.prototype.attack = function () {
  this.sendAttack();

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
  // Ignore our own messages
  if (message.content.playerNumber == this.myPlayerNumber) {
    return;
  }

  if (message.content.type === "position_request") {
    this.sendMyPosition();
    return;
  }

  if (message.content.type === 'move'){
    // We transform the message into an array that stores the move data
    var moveData = message.content;
    
    // We count the players currently online, counting all welcome messages
    // but we don't count undefined players and we don't count the current user.
    var playerNumber = moveData.playerNumber;
    if (playerNumber !== this.myPlayerNumber) {
      this.map.drawPlayer(playerNumber, moveData.x, moveData.y);
    }
    return;
  }
  
  if (message.content.type === 'attack') {
    if (this.isDead) {
      return;
    }

    if ((message.content.x == this.posX) && (message.content.y == this.posY)){
      this.profile.deaths++;
      this.updateMyStats();

      this.map.drawDeadPlayer(this.myPlayerNumber, this.posX, this.posY);

      this.isDead = true;

      // Wait 5 seconds before respawning
      var t = this;
      setTimeout(function () {
        t.isDead = false;
        t.moveToRandomPosition();
      }, 5000);
    }
    return;
  }

  if (message.content.type === 'death') {
    var deathData = message.content;
    var playerNumber = deathData.playerNumber;
    this.map.drawDeadPlayer(playerNumber, deathData.x, deathData.y);

    return;
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


