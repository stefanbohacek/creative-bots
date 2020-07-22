const helpers = require(__dirname + '/../helpers/helpers.js'),
      cronSchedules = require( __dirname + '/../helpers/cron-schedules.js' ),
      windyAPI = require(__dirname + '/../helpers/windy.js'),
      TwitterClient = require(__dirname + '/../helpers/twitter.js'),    
      mastodonClient = require(__dirname + '/../helpers/mastodon.js'), 
      tumblrClient = require(__dirname + '/../helpers/tumblr.js');

const twitter = new TwitterClient( {
  consumer_key: process.env.BOT_1_TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.BOT_1_TWITTER_CONSUMER_SECRET,
  access_token: process.env.BOT_1_TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.BOT_1_TWITTER_ACCESS_TOKEN_SECRET
} );

const mastodon = new mastodonClient( {
   access_token: process.env.BOT_1_MASTODON_ACCESS_TOKEN,
   api_url: process.env.BOT_1_MASTODON_API
} );

const tumblr = new tumblrClient( {
  tumblr_name: process.env.BOT_1_TUMBLR_BLOG_NAME,
  consumer_key: process.env.BOT_1_TUMBLR_CONSUMER_KEY,
  consumer_secret: process.env.BOT_1_TUMBLR_CONSUMER_SECRET,
  token: process.env.BOT_1_TUMBLR_CONSUMER_TOKEN,
  token_secret: process.env.BOT_1_TUMBLR_CONSUMER_TOKEN_SECRET
} );

module.exports = {
  active: false,
  name: 'Windy API Bot',
  description: 'An example of using the Windy API.',
  thumbnail: 'https://botwiki.org/wp-content/uploads/2020/03/views-from-new-york-1585658499.png',
  about_url: 'https://botwiki.org/bot/views-from-new-york/',
  interval: cronSchedules.EVERY_SIX_HOURS,
  script: function(){
    const location = {
      /*
        Latitude and longitude of your city. 
        You can use https://www.latlong.net/convert-address-to-lat-long.html to get this information for your city.
      */
      lat: 40.712776,
      long: -74.005974,
      radius: 15 /* search for webcams in a 15 mile radius from the specified location */
    };
    console.log( location );
    
    windyAPI.getWebcamPicture( location, function( err, data ){

      if ( data && data.title && data.location){
        console.log( data )
        const webcamTitle = data.title;
        const windyWebcamUrl = `https://www.windy.com/-Webcams/United-States/Minnesota/Delhi/New-York/webcams/${data.id}`;
        const googleMapsUrl = `https://www.google.com/maps/search/${data.location.latitude},${data.location.longitude}`;

        let text = `${webcamTitle}\n${windyWebcamUrl}\n${googleMapsUrl}`;

        helpers.loadImage( data.image.current.preview, function( err, imgData ){
          if ( err ){
            console.log( err );     
          }
          else{
            twitter.postImage( text, imgData );
            mastodon.postImage( text, imgData );
            tumblr.postImage( text, imgData );
          }
        } ); 
      }
    } ); 
  } 
};