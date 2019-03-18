var app = require('express')();
var http = require('http').Server(app);
var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://192.168.0.3:1883', {
  username: "bernstein7",
  password: "superSecure"
});

client.on('connect', function () {
  console.log('Connected')
  client.subscribe('garage/front-door', function (err) {
    if (!err) {
      const msg = `data: ${JSON.stringify({subscribed: true})} \n\n`
      console.log('Init message' + msg)
    }
  })
})

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

app.get('/sse', function(req, res) {
  res.status(200).set({
    "connection": "keep-alive",
    "cache-control": "no-cache",
    "content-type": "text/event-stream"
  });

  let data = {
    message: "Hello world"
  }

  client.on('message', function (topic, message) {
    // message is Buffer
    console.log(message.toString())
    data.timestamp = Date.now()
    data.value = JSON.parse(message.toString()).value;
    const msg = `data: ${JSON.stringify(data)} \n\n`
    console.log('Sending message' + msg)
    res.write(msg)
    // client.end()
  })
});

http.listen(3333, function() {
  console.log('listening on *:3333');
});
