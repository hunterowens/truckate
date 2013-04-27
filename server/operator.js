var mongoskin = require('mongoskin');

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
            socket.emit('operator:loggedIn', user);
          }
      });
    });
  }

  // TODO: automate hs.session.authenticated checks
  var initMenuEditor = function (socket, hs) {
    socket.on('operator:addEntry', function(msg) {
      console.log('operator:addEntry', msg);
      db.collection('menus').updateById(msg.menu_id, {$push: {entries: msg.entry}});
    });
    socket.on('operator:listMenus', function(msg) {
      console.log('operator:listMenus', msg);
      if (!msg.truck_id) {
        socket.emit('operator:requestError');
        return;
      } else {
        db.collection('trucks').findById(msg.truck_id, function (err, truck) {
          if (err) {
            socket.emit('operator:requestError');
          } else {
            db.collection('menus').find({_id: {$in: truck.menus}}).toArray(function (err, menus) {
              socket.emit('operator:menuList', {menus: menus});
            });
          }
        });
      }
    });
  };

  LOBBY_ROOM = 'lobby';

  io.sockets.on('connection', function (socket) {
    var hs = socket.handshake;
    initLogin(socket, hs);
    initMenuEditor(socket, hs);
  });

}

