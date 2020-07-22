const helpers = require(__dirname + '/../helpers/helpers.js'),
      cronSchedules = require( __dirname + '/../helpers/cron-schedules.js' ),
      emoji = require( __dirname + '/../data/emoji.js' ),
      TwitterClient = require(__dirname + '/../helpers/twitter.js'),    
      mastodonClient = require(__dirname + '/../helpers/mastodon.js');

const mastodon = new mastodonClient( {
   access_token: process.env.BOT_1_MASTODON_ACCESS_TOKEN,
   api_url: process.env.BOT_1_MASTODON_API
} );

module.exports = {
  active: false,
  name: 'Poll bot',
  description: 'A bot that makes polls.',
  thumbnail: 'https://botwiki.org/wp-content/uploads/2018/02/emoji__polls-v3.png',
  about_url: 'https://botwiki.org/bot/emoji__polls/',
  interval: cronSchedules.EVERY_SIX_HOURS,
  script: function(){
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

  }
};
