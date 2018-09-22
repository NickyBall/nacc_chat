var app = require('express')();
var JsonDB = require('node-json-db');
var db = new JsonDB("./db/myDataBase", true, false);
var http = require('http').Server(app);
var io = require('socket.io')(http);
var port = process.env.PORT || 3000;

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.post('/:sender/:receiver', function(req, res) {
  res.json(db.getData('/'+req.params.sender+'/'+req.params.receiver));
});

io.on('connection', function(socket){
  
  socket.on('chat message', function(msg) {
    var json = JSON.parse(msg);
    var from = json.from;
    var to = json.to;
    if (from && to) {
      db.push('/'+from+'/'+to+'/chat[]', json);
      db.push('/'+to+'/'+from+'/chat[]', json);
    }
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
