const helpers = require(__dirname + '/../helpers/helpers.js'),
      emoji = require( __dirname + '/../data/emoji.js' ),
      TwitterClient = require(__dirname + '/../helpers/twitter.js'),    
      mastodonClient = require(__dirname + '/../helpers/mastodon.js');

const mastodon = new mastodonClient( {
   access_token: process.env.BOT_1_MASTODON_ACCESS_TOKEN,
   api_url: process.env.BOT_1_MASTODON_API
} );

module.exports = function(){
  let options = [];

  for (let i = 0; i < 4; i++){
    emoji.sort(function(){return Math.round(Math.random());});
    options.push(emoji.pop());
  }
  
  const text = options.join(' ');
  console.log( { text, options } );
  
  // twitter.poll( text, options ); // coming soon
  mastodon.poll( text, options );
  
  /* For more control, pass an options object: */

  // const optionsObj = {
  //   status: text,
  //   poll: {
  //     options: options, // a list of options
  //     expires_in: 3600, // duration in seconds
  //     multiple: false, // allow multiple answers
  //     hide_totals: false // hide vote counts until the poll ends
  //   }, 
  // };
  // mastodon.poll( optionsObj );
};
