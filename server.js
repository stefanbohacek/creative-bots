/* Setting things up. */
var path = require('path'),
    express = require('express'),
    app = express(),   
    helpers = require(__dirname + '/helpers.js'),
    twitter = require(__dirname + '/twitter.js');

app.use(express.static('public'));


/* You can use uptimerobot.com or a similar site to hit your /BOT_ENDPOINT to wake up your app and make your Twitter bot tweet. */

app.all("/" + process.env.BOT_ENDPOINT, function (req, res) {
  
  /* The example below tweets out "Hello world 👋". */
  
  twitter.tweet('Hello world 👋', function(err, data){
    if (err){
      console.log(err);     
      res.sendStatus(500);
    }
    else{
      console.log('tweeted');
      res.sendStatus(200);
    }
  });
  
  /* Or we can pick a random image from the assets folder and tweet it. */
  
  helpers.load_image_assets(function(err, asset_urls){
    if (err){
      console.log(err);     
      res.sendStatus(500);
    }
    else{
      helpers.load_remote_image(helpers.random_from_array(asset_urls), function(err, img_data){
        if (err){
          console.log(err);     
          res.sendStatus(500);
        }
        else{
          twitter.post_image('Hello 👋', img_data, function(err, data){
            if (err){
              console.log(err);     
              res.sendStatus(500);
            }
            else{
              res.sendStatus(200);
            }            
          });
        }
      });
    }
  });  
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your bot is running on port ' + listener.address().port);
});
