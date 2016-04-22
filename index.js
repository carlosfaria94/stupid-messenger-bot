var express = require('express');
var body = require('body-parser');

var app = express();

app.use(body.json());

// Ping
app.get('/ping', function(req, res) {
  res.send('Pong');
});

/**
 * Verify your bot
 */
app.get('/webhook/', function (req, res) {
  // Setup your token as a environment variable
  if (req.query['hub.verify_token'] === process.env.VALIDATION_TOKEN) {
    res.send(req.query['hub.challenge']);
  }
  res.send('Error, wrong validation token');
});

/**
 * Receive the message from the user
 * Listen for POST calls. We're specifically listening for a callback when a message is sent to a Page.
 */
app.post('/webhook/', function (req, res) {
  messaging_events = req.body.entry[0].messaging;
  for (i = 0; i < messaging_events.length; i++) {
    event = req.body.entry[0].messaging[i];
    sender = event.sender.id;
    if (event.message && event.message.text) {
      text = event.message.text;
      console.log(text);
    }
  }
  res.sendStatus(200);
});

app.listen(process.env.PORT || 3000);