/* Setting things up. */
var path = require('path'),
    express = require('express'),
    app = express(),   
    helpers = require(__dirname + '/helpers.js'),
    twitter = require(__dirname + '/twitter.js');

app.use(express.static('public'));


/* You can use uptimerobot.com or a similar site to hit your /BOT_ENDPOINT to wake up your app and make your Twitter bot tweet. */

app.all("/" + process.env.BOT_ENDPOINT, function (req, res) {

  /* See EXAMPLES.js for some example code you can use. */

});

var listener = app.listen(process.env.PORT, function () {
  console.log('your bot is running on port ' + listener.address().port);
});
