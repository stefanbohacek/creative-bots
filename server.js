/* Setting things up. */
var path = require('path'),
    Twit = require('twit'),
    config = {
/* Be sure to update the .env file with your API keys. See how to get them: https://botwiki.org/tutorials/make-an-image-posting-twitter-bot/#creating-a-twitter-app*/      
      twitter: {
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
      }
    },
    T = new Twit(config.twitter),
    stream = T.stream('statuses/sample');


/* The example below tweets out "Hello world!". */
T.post('statuses/update', { status: 'Hello world!' }, function(err, data, response) {
  if (err){
    console.log('Error!');
    console.log(err);
  }
});



/**********************************************************************************************/
/* The code below takes care of serving the index.html file, no need to change anything here. */

var express = require('express');
var app = express();
app.use(express.static('public'));
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
