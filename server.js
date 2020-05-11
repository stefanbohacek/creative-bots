/* Setting things up. */

const path = require( 'path' ),
      express = require( 'express' ),
      app = require(__dirname + '/app.js'),
      CronJob = require( 'cron' ).CronJob,
      cronSchedules = require( __dirname + '/helpers/cron-schedules.js' );

/* Load your bots from the "bots" folder. */

let bot1 = require( __dirname + '/bots/basic.js' ),
    bot2 = require( __dirname + '/bots/random-image.js' ),
    bot3 = require( __dirname + '/bots/generative.js' ),
    bot4 = require( __dirname + '/bots/api-windy.js' ),
    bot5 = require( __dirname + '/bots/api-socrata.js' ),
    bot6 = require( __dirname + '/bots/tracery.js' ),
    bot7 = require( __dirname + '/bots/charts.js' );

let listener = app.listen( process.env.PORT, function(){
  console.log( `your bot is running on port ${ listener.address().port }` );

  /*
    Schedule your bots. Check out the cron package documentation for more details https://www.npmjs.com/package/cron#available-cron-patterns.

    You can also use common cron schedules defined inside helpers/cron-schedules.js.
  */

  // ( new CronJob( cronSchedules.EVERY_HOUR, function() {
  //   bot1();
  // } ) ).start();

  // ( new CronJob( cronSchedules.EVERY_THIRTY_SECONDS, function() {
  //   bot2();
  // } ) ).start();
} );
