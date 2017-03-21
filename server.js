/* Setting things up. */
var path = require('path'),
    express = require('express'),
    app = express(),   
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

app.use(express.static('public'));

/* You can use uptimerobot.com or a similar site to hit your /tweet endpoint to wake up your app and make your Twitter bot tweet. */

app.all("/tweet", function (request, response) {
/* The example below tweets out "Hello world!". */
  T.post('statuses/update', { status: 'hello world 👋' }, function(err, data, response) {
    if (err){
      console.log('Error!');
      console.log(err);
    }
    else{
      // r.sendStatus(200);
    }
  });
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your bot is running on port ' + listener.address().port);
});
