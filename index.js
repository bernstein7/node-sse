var app = require('express')();
var http = require('http').Server(app);

app.get('/', function(req, res) {
  // res.send('<h1>Hello world</h1>');
  res.sendFile(__dirname + '/index.html');
});

app.get('/sse', function(req, res) {
  res.status(200).set({
    "connection": "keep-alive",
    "cache-control": "no-cache",
    "content-type": "text/event-stream"
    // "content-type": "application/json"
  });

  let data = {
    message: "Hello world"
  }

  setInterval(() => {
    data.timestamp = Date.now()
    const msg = `data: ${JSON.stringify(data)} \n\n`
    console.log(msg)
    res.write(msg)
  }, 3000)
});

http.listen(3333, function() {
  console.log('listening on *:3333');
});
