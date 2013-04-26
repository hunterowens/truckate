var initMenuEditor = function (socket, hs) { 
  socket.on('operator:newEntry', function(msg) {
    console.log('it works: ', msg);
  });
};

exports.init = function (io) {

  LOBBY_ROOM = 'lobby';

  io.sockets.on('connection', function (socket) {
    var hs = socket.handshake;
    initMenuEditor(socket, hs);
  });

}
