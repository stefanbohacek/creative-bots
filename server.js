/* Setting things up. */

if ( !process.env.PROJECT_NAME || !process.env.PROJECT_ID ){
  require( 'dotenv' ).config();
}

const path = require( 'path' ),
      express = require( 'express' ),
      app = require(__dirname + '/app.js'),
      CronJob = require( 'cron' ).CronJob,
      cronSchedules = require( __dirname + '/helpers/cron-schedules.js' );

/*
  Load your bots. Check out the cron package documentation for more details https://www.npmjs.com/package/cron#available-cron-patterns.

  You can also use common cron schedules defined inside helpers/cron-schedules.js.
*/

const bots = [
  {
    script: '/bots/basic.js',
    interval: cronSchedules.EVERY_SIX_HOURS
  },
  {
    script: '/bots/random-image.js',
    interval: cronSchedules.EVERY_DAY_MORNING
  },
  {
    script: '/bots/generative.js',
    interval: cronSchedules.EVERY_DAY_AFTERNOON
  },
  {
    script: '/bots/charts.js',
    interval: cronSchedules.EVERY_TWELVE_HOURS
  }
];

/** Your bots will be automatically scheduled. **/

let listener = app.listen( process.env.PORT, function(){
  if ( bots && bots.length > 0 ){
    bots.forEach( function( bot ){
      if ( bot.script && bot.interval ){
        let botInterval;

        for (const schedule in cronSchedules) {
          if ( cronSchedules[schedule] === bot.interval ){
            botInterval = schedule;
          }
        }

        if ( botInterval.length === 0 ){
          botInterval = bot.interval;
        }
        
        console.log( `🕒 scheduling ${ bot.script }: ${ botInterval }` );
        const script = require( __dirname + bot.script );

        ( new CronJob( bot.interval, function() {
          script();
        } ) ).start();        
      }
    } );

    console.log( `🤖 your bot${ bots.length === 1 ? ' has' : 's have' } been scheduled` );
  } else {
    console.log( '🚫 no bots to schedule' );
  }
} );
