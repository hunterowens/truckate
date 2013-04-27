exports.init = function (io, db) {

  // TODO: actually secure login
  var initLogin = function (socket, hs) {
    socket.on('operator:login', function(msg) {
      if (!msg.username || !msg.password_hash) {
        socket.emit('operator:loginFailed', {error: "Need a username and password."});
        return;
      }
      db.collection('users').findOne({
          username: msg.username,
          password_hash: msg.password_hash
        }, function (err, user) {
          if (!user) {
            socket.emit('operator:loginFailed', {error: "Username or password incorrect."});
          } else {
            hs.session.user_id = user._id;
            hs.session.authenticated = true;
            console.log('going to send operator:loggedIn', user);
            socket.emit('operator:loggedIn', user);
            initMenuEditor(socket, hs);
          }
      });
    });
  }

  // TODO: automate hs.session.authenticated checks
  var initMenuEditor = function (socket, hs) {
    socket.on('operator:addEntry', function(msg) {
      if (!hs.session.authenticated) {
        socket.emit('operator:notLoggedIn', {error: "Please log in."});
      }
      console.log('operator:newEntry', msg);
    });
    socket.on('operator:getMenu', function(msg) {
      if (!hs.session.authenticated) {
        socket.emit('operator:notLoggedIn', {error: "Please log in."});
      }
      console.log('operator:getMenu', msg);
    });
  };

  LOBBY_ROOM = 'lobby';

  io.sockets.on('connection', function (socket) {
    var hs = socket.handshake;
    initLogin(socket, hs);
  });

}

