var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket){
  console.log(socket);
  
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });

  socket.on('new join', function(msg) {
    io.emit('new join', msg);
  });

  socket.on('response online', function(msg) {
    io.emit('response online', msg);
  });

  
});

http.listen(port, function(){
  console.log('listening on *:' + port);
});
