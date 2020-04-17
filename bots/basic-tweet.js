let helpers = require(__dirname + '/../helpers/helpers.js'),
    twitterConfig = {
        consumer_key: process.env.TWITTER_CONSUMER_KEY_BOT_1,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET_BOT_1,
        access_token: process.env.TWITTER_ACCESS_TOKEN_BOT_1,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET_BOT_1
    },
    Twit = require( 'twit' ),
    T = new Twit( twitterConfig );

module.exports = {
  tweet: function(){
    const text = helpers.randomFromArray( [
      'Hello!',
      'Hi!',
      'Hi there!'
    ] );

    T.post( 'statuses/update', { status: text }, function( err, data, response ) {
      if ( err ){
        console.log( err );
      } else {
        if ( data && data.id_str && data.user && data.user.screen_name ){
          console.log( 'tweeted', `https://twitter.com/${ data.user.screen_name }/status/${ data.id_str }` );
        }
      }
    } );    
  }
};