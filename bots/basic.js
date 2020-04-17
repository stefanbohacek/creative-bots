let helpers = require(__dirname + '/../helpers/helpers.js'),
    twitter = require(__dirname + '/../helpers/twitter.js'),    
    mastodon = require(__dirname + '/../helpers/mastodon.js'),    
    Twit = require( 'twit' ),
    T = new Twit( {
        consumer_key: process.env.TWITTER_CONSUMER_KEY_BOT_1,
        consumer_secret: process.env.TWITTER_CONSUMER_SECRET_BOT_1,
        access_token: process.env.TWITTER_ACCESS_TOKEN_BOT_1,
        access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET_BOT_1
    } ),
    Mastodon = require( 'mastodon' ),
    M = new Mastodon( {
     'access_token': process.env.MASTODON_ACCESS_TOKEN_BOT_1,
     'api_url': process.env.MASTODON_API_BOT_1
    } );

module.exports = {
  run: function(){
    const text = helpers.randomFromArray( [
      'Hello!',
      'Hi!',
      'Hi there!'
    ] );
    
    twitter.tweet( T, text );
  }
};