/* Setting things up. */

let path = require( 'path' ),
    express = require( 'express' ),
    app = express(),
    CronJob = require( 'cron' ).CronJob;

/* Load your bots */

let bot1 = require( __dirname + '/bots/basic.js' ),
    bot2 = require( __dirname + '/bots/random-image.js' );

app.use( express.static( 'public' ) );

let listener = app.listen( process.env.PORT, function(){
  console.log( `your bot is running on port ${ listener.address().port }` );
  
  const cronSchedules = {
    'every_minute': '* * * * *',
    'every_hour': '0 * * * *'
  };

  /* Schedule your bots */

  // Check out the cron package documentation for more details on how to set up cron jobs: https://www.npmjs.com/package/cron

//   ( new CronJob( cronSchedules.every_minute, function() {
//     bot1.run();
//   } ) ).start();
  
  
//   ( new CronJob( cronSchedules.every_hour, function() {
//     bot1.run();
//   } ) ).start();
  
//   ( new CronJob( cronSchedules.every_hour, function() {
//     bot2.run();
//   } ) ).start();
  
} );
