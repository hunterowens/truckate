var SECRET = '6a54oei4ae6u5';

var express = require('express'),
    MemoryStore = express.session.MemoryStore,
    sessionStore = new MemoryStore(),
    Session = require('connect').middleware.session.Session,
    parseCookie = require('connect').cookieParser(SECRET),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server);

app.configure(function () {
  app.use(express.cookieParser());
  app.use(express.session({
    store: sessionStore,
    secret: SECRET,
    key: 'express.sid'
  }));
  app.use(express.static(__dirname + '/client'));
});

io.set('authorization', function (data, accept) {
  // Associate Session objects with sockets
  // (so appropriate info will survive reconnects)
  if (data.headers.cookie) {
    // these properties are needed for Session
    parseCookie(data, null, function (err) {
      data.sessionID = data.signedCookies['express.sid'];
      data.sessionStore = sessionStore;

      sessionStore.get(data.sessionID, function (err, session) {
        if (err) {
          accept('Error getting session', false);
        } else {
          data.session = new Session(data, session);
          accept(null, true);
        }
      });
    });

  } else {
    return accept('No cookie found.', false);
  }
});

LOBBY_ROOM = 'lobby';

io.sockets.on('connection', function (socket) {
  var hs = socket.handshake;
  // joinRoom(socket, LOBBY_ROOM);
  // changeNick(socket, hs.sessionID);
  // socket.emit('newMessage', {
  //   from: 'server',
  //   message: 'Welcome!',
  //   time: (new Date().getTime())
  // });
  // socket.on('sendMessage', function (message) {
  //   console.log(hs);
  //   io.sockets.in(hs.session.room).emit('newMessage', {
  //     from: hs.session.nick,
  //     message: message,
  //     time: (new Date().getTime())
  //   });
  // });
  // socket.on('joinRoom', function (room) {
  //   joinRoom(socket, room);
  // });
  // socket.on('changeNick', function (nick) {
  //   changeNick(socket, nick);
  // });
  socket.on('opSumbit', function() {
    console.log('it works');
  });
});

var changeNick = function(socket, nick, cb) {
  var hs = socket.handshake;
  hs.session.nick = nick;
  socket.emit('changedNick', nick);
}

var joinRoom = function (socket, room, cb) {
  var hs = socket.handshake;
  socket.join(room);
  socket.leave(hs.session.room);
  hs.session.room = room;
  console.log("somebody joined room", room);
  socket.emit('joinedRoom', room);
  if (cb) {
    cb(socket, room);
  }
}

var leaveRoom = function (socket, room, cb) {
  var hs = socket.handshake;
  socket.leave(room, function () {
    joinRoom(socket, LOBBY_ROOM);
  });
}

server.listen(3000);
console.log('Listening on port 3000');