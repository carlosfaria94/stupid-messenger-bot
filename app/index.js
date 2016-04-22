var express = require('express');
var body = require('body-parser');
var request = require('request');
var allSenders = {};
var token = process.env.VALIDATION_TOKEN;

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
  if (req.query['hub.verify_token'] === token) {
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
    var event = req.body.entry[0].messaging[i];
    var senderId = event.sender.id;
    allSenders[senderId] = true;
    
    if (event.message && event.message.text) {
      var text = event.message.text;
      console.log(senderId + " : " + text);
      Object.keys(allSenders).forEach(function(senderId) {
      if (text ===  'Hi') {
        sendTextMessage(senderId, "Hi! Nice to meet you! I'm a stupid boot!");
      } else {
        sendTextMessage(senderId, "I would like to " + text.substring(0, 200));
      }
      });
    }
  }
  res.sendStatus(200);
});

function sendTextMessage(sender, text) {
  messageData = {
    text:text
  }
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {access_token:token},
    method: 'POST',
    json: {
      recipient: {id:sender},
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.nerror) {
      console.log('Error: ', response.body.error);
    }
  });
}

app.listen(process.env.PORT || 3000);