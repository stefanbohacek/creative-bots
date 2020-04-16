/* Setting things up. */
let path = require( 'path' ),
    express = require( 'express' ),
    app = express(),
    CronJob = require( 'cron' ).CronJob;

/* Load your bots */

let bot1 = require( __dirname + '/bots/basic-tweet.js' ),
    bot2 = require( __dirname + '/bots/random-image.js' );

app.use( express.static( 'public' ) );

let listener = app.listen( process.env.PORT, function(){
  console.log( `your bot is running on port ${ listener.address().port }` );

  // Check out the cron package documentation for more details on how to set up cron jobs: https://www.npmjs.com/package/cron

  // let job1 = new CronJob( '0 * * * *', function() {
  let job1 = new CronJob( '* * * * *', function() {  
    bot1.tweet();
  } );
  
  // let job2 = new CronJob( '0 * * * *', function() {
  let job2 = new CronJob( '*/2 * * * *', function() {
    bot2.postImage();
  } );
  
  job1.start();
  job2.start();
} );
