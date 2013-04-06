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
      data.sessionID = data.cookies['express.sid'];
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
  joinRoom(socket, LOBBY_ROOM, function () {
    socket.emit('newMessage', {
      from: 'server',
      message: 'Welcome!',
      time: (new Date().getTime())
    });
    socket.on('sendMessage', function (message) {
      var hs = socket.handshake;
      console.log(message);
      io.sockets.in(hs.room).emit('newMessage', {
        from: hs.sessionID,
        message: message,
        time: (new Date().getTime())
      });
    });
  });
});

var joinRoom = function (socket, room, cb) {
  var hs = socket.handshake;
  socket.join(room, function () {
    hs.session.room = room;
    if (cb) {
      cb(socket, room);
    }
  });
}

var leaveRoom = function (socket, room, cb) {
  var hs = socket.handshake;
  socket.leave(room, function () {
    joinRoom(socket, LOBBY_ROOM);
  });
}

server.listen(3000);
console.log('Listening on port 3000');

