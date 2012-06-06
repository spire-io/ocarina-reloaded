function Ocarina (member) {
  this.member = member;

  this.profile = member.profile();

  this.myPlayerNumber = this.profile.myPlayerNumber;
  this.deaths = this.profile.deaths;
  this.kills = this.profile.kills;

  this.posY = 0;
  this.posX = 0;
}

Ocarina.prototype.start = function (channel, sub) {
  this.channel = channel;
  this.sub = sub;

  // Draw the map
  this.map = new Map();
  this.map.draw();

  var ocarina = this;
  // We add the listener to get every incoming message
  sub.addListener('message', function (e) { ocarina.messageListener(e); });
  sub.addListener('join', function (e) { ocarina.joinListener(e); });
  sub.addListener('part', function (e) { ocarina.partListener(e); });

  // We need to startListening to get the messages
  sub.startListening({ min_timestamp: 'now' });

  document.addEventListener('keydown', function (e) { ocarina.keyListener(e); });

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
    this.channel.publish({
      playerNumber: this.myPlayerNumber,
      type: 'move',
      x: this.posX,
      y: this.posY
    });
  }
};

Ocarina.prototype.attack = function () {
  this.channel.publish({
    playerNumber: this.myPlayerNumber,
    type: 'attack',
    x: this.posX,
    y: this.posY
  });

  var playersAttacked = this.map.getPlayersAtPosition(this.posX, this.posY);

  if (playersAttacked.length >= 2) {
    this.killings += (playersAttacked.length -1)
    this.updateMyStats();
  }
};

Ocarina.prototype.updateMyStats = function () {
  this.updateProfile();
  this.map.updateStats({
    kills: this.kills,
    deaths: this.deaths
  });
};

// The messageListener runs for every message received.
Ocarina.prototype.messageListener = function (message) {
  if (message.content.type === 'move'){
    // We transform the message into an array that stores the move data
    var moveData = message.content;
    
    // We count the players currently online, counting all welcome messages
    // but we don't count undefined players and we don't count the current user.
    var playerNumber = moveData.playerNumber;
    if (playerNumber !== this.myPlayerNumber) {
      this.map.drawPlayer(playerNumber, moveData.x, moveData.y);
    }
  }
  
  if ((message.content.type === 'attack') && (message.content.playerNumber !== this.myPlayerNumber)){
    if ((message.content.x === this.posX) && (message.content.y === this.posY)){
      this.deaths++;
      this.updateMyStats();
      this.moveToRandomPosition();
    }
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


