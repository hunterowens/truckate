var mongodb = require('mongodb');

exports.init = function (io, db) {

  // TODO: actually secure login
  var initLogin = function (socket, hs) {
    socket.on('operator:login', function(msg) {
      console.log(msg);
      if (!msg.username || !msg.password_hash) {
        socket.emit('operator:loginFailed', {error: "Need a username and password."});
        return;
      }
      db.collection('users', function (err, users) {
        users.findOne({
            username: msg.username,
            password_hash: msg.password_hash
          },
          function (err, user) {
            console.log(err)
            if (err) {
              socket.emit('operator:loginFailed', {error: "Username or password wrong."});
            } else {
              hs.user_id = user._id;
              hs.username = user.username;
              hs.truck_id = user.truck_id;
              hs.authenticated = true;
            }
        });
      });
    });
  }

  var initMenuEditor = function (socket, hs) {
    socket.on('operator:newEntry', function(msg) {
      console.log('operator:newEntry', msg);
    });
    socket.on('operator:getMenu', function(msg) {
      console.log('operator:getMenu', msg);
    });
  };

  LOBBY_ROOM = 'lobby';

  io.sockets.on('connection', function (socket) {
    var hs = socket.handshake;
    initLogin(socket, hs);
  });

}

