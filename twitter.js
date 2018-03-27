var config = {
      twitter: {
        username: process.env.BOT_USERNAME,
     /* Be sure to update the .env file with your API keys.
        See how to get them: https://botwiki.org/tutorials/how-to-create-a-twitter-app */
        consumer_key: process.env.CONSUMER_KEY,
        consumer_secret: process.env.CONSUMER_SECRET,
        access_token: process.env.ACCESS_TOKEN,
        access_token_secret: process.env.ACCESS_TOKEN_SECRET
      }
    },
    Twit = require('twit'),
    T = new Twit(config.twitter);

module.exports = {
  tweet: function(text, cb){
    T.post('statuses/update', { status: text }, function(err, data, response) {
      cb(err, data, response);
    });    
  },
  post_image: function(text, image_base64, cb) {
   T.post('media/upload', { media_data: image_base64 }, function (err, data, response) {
      if (err){
        console.log('ERROR:\n', err);
        if (cb){
          cb(err);
        }
      }
      else{
        console.log('tweeting the image...');
        T.post('statuses/update', {
          status: text,
          media_ids: new Array(data.media_id_string)
        },
        function(err, data, response) {
          if (err){
            console.log('ERROR:\n', err);
            if (cb){
              cb(err);
            }
          }
          else{
            console.log('tweeted');
            if (cb){
              cb(null);
            }
          }
        });
      }
    });
  },  
  update_profile_image: function(image_base64, cb) {
    console.log('updating profile image...');
    T.post('account/update_profile_image', {
      image: image_base64
    },
    function(err, data, response) {
      if (err){
        console.log('ERROR:\n', err);
        if (cb){
          cb(err);
        }
      }
      else{
        if (cb){
          cb(null);
        }
      }
    });
  },
  delete_last_tweet: function(cb){
    console.log('deleting last tweet...');
    T.get('statuses/user_timeline', { screen_name: process.env.BOT_USERNAME }, function(err, data, response) {
      if (err){
        if (cb){
          cb(err, data);
        }
        return false;
      }
      if (data && data.length > 0){
        var last_tweet_id = data[0].id_str;
        T.post(`statuses/destroy/${last_tweet_id}`, { id: last_tweet_id }, function(err, data, response) {
          if (cb){
            cb(err, data);
          }
        });
      } else {
        if (cb){
          cb(err, data);
        }
      }
    });
  }  
};