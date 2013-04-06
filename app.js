var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);

app.use(express.static(__dirname + '/client'));

server.listen(3000);
console.log('Listening on port 3000');


io.sockets.on("connection", function (socket) {
  socket.join("chat");
  socket.emit("newMessage", {message: "Welcome!", time: (new Date().getTime())});
  socket.on("sendMessage", function (message) {
    console.log(message);
    io.sockets.in("chat").emit("newMessage", {message: message, time: (new Date().getTime())});
  });
});

