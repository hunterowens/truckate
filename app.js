var SECRET = '6a54oei4ae6u5';

var express = require('express'),
    MemoryStore = express.session.MemoryStore,
    sessionStore = new MemoryStore(),
    Session = require('connect').middleware.session.Session,
    parseCookie = require('connect').cookieParser(SECRET),
    app = express(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server)
    operator = require('./server/operator');


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

operator.init(io);

server.listen(3000);
console.log('Listening on port 3000');
