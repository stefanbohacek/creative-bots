/* Setting things up. */

if ( !process.env.PROJECT_NAME || !process.env.PROJECT_ID ){
  require( 'dotenv' ).config();
}

const path = require( 'path' ),
      express = require( 'express' ),
      app = require(__dirname + '/app.js'),
      helpers = require(__dirname + '/helpers/helpers.js'),
      CronJob = require( 'cron' ).CronJob,
      cronSchedules = require( __dirname + '/helpers/cron-schedules.js' );

/*
  To load your bots, update the "bots" array below. Each bot needs "script" (path to the bot's source code), and "interval", which can either be one of the values inside helpers/cron-schedules.js.
  
  You can also use custom cron schedules, see https://www.npmjs.com/package/cron#available-cron-patterns for more details.
*/

const bots = [
  {
    script: 'bots/basic.js',
    interval: cronSchedules.EVERY_SIX_HOURS,
    /* Optionally you can also fill out these: */
    // name: 'Name your bot',
    // description: 'What does your bot do?',
    // thumbnail: 'https://botwiki.org/wp-content/uploads/2019/02/hello--world-.png',
    // about_url: 'https://botwiki.org/bot/hello-world/'
  },
  {
    script: 'bots/random-image.js',
    interval: cronSchedules.EVERY_DAY_MORNING
  },
  {
    script: 'bots/generative.js',
    interval: cronSchedules.EVERY_DAY_AFTERNOON
  },
  {
    script: 'bots/charts.js',
    interval: cronSchedules.EVERY_TWELVE_HOURS
  }
];

/** Your bots will be automatically scheduled. **/

console.log( '🕒 server time: ', ( new Date() ).toTimeString() );

/** For testing. **/
// const bot = require( __dirname + '/bots/emoji__polls.js' );
// bot();

if ( bots && bots.length > 0 ){
  bots.forEach( function( bot ){
    if ( !bot.name ){
      bot.name = bot.script.replace( 'bots/', '' ).replace( '.js', '' );
    }
    
    if ( bot.interval ){
      let botInterval;

      for (const schedule in cronSchedules) {
        if ( cronSchedules[schedule] === bot.interval ){
          botInterval = schedule;
        }
      }
      
      if ( botInterval.length === 0 ){
        botInterval = bot.interval;
      } else {
        botInterval = helpers.capitalizeFirstLetter( botInterval.replace( /_/g, ' ' ) );
      }
      
      bot.interval_human = botInterval;

      console.log( `⌛ scheduling ${ bot.script }: ${ botInterval }` );
      const script = require( __dirname + '/' + bot.script );

      const job = new CronJob( bot.interval, function() { script() } );
      bot.cronjob = job;

      job.start();
      console.log( '📅 next run:', job.nextDates().fromNow() );
    }
  } );

  console.log( `🤖 your bot${ bots.length === 1 ? ' has' : 's have' } been scheduled` );
} else {
  console.log( '🚫 no bots to schedule' );
}

app.set( 'bots', bots );

let listener = app.listen( process.env.PORT || 3000, function(){
  console.log( 'server is running' );
} );
