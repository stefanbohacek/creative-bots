/* Setting things up. */
let path = require( 'path' ),
    express = require( 'express' ),
    app = express(),
    CronJob = require( 'cron' ).CronJob;

app.use( express.static( 'public' ) );

let listener = app.listen( process.env.PORT, function(){
  console.log( `your bot is running on port ${ listener.address().port }` );
  // Check out the cron package documentation for more details: https://www.npmjs.com/package/cron

  let job = new CronJob( '*/1 * * * *', function() {
    console.log( 'Time to tweet!' );
    /* See EXAMPLES.js for some example code you can use here */
  } );
  
} );
