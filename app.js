const express = require( 'express' ),
      session = require( 'express-session' ),
      bodyParser = require( 'body-parser' ),
      MemoryStore = require( 'memorystore' )( session ),
      Grant = require( 'grant-express' ),
      tumblr = require( 'tumblr.js' );

const app = express();

app.use( bodyParser.json() );

const grant = new Grant( {
  server: {
    protocol: 'https',
    host: `${process.env.PROJECT_DOMAIN}.glitch.me`,
    callback: '/callback',
    transport: 'session'
  },
  tumblr: {
    request_url: 'https://www.tumblr.com/oauth/request_token',
    authorize_url: 'https://www.tumblr.com/oauth/authorize',
    access_url: 'https://www.tumblr.com/oauth/access_token',
    oauth: 1,
    /* Change these based on which bot you need to authenticate. */
    key: process.env.BOT_1_TUMBLR_CONSUMER_KEY,
    secret: process.env.BOT_1_TUMBLR_CONSUMER_SECRET,
  }
} );

app.use( session( {
  store: new MemoryStore( {
    checkPeriod: 86400000
  } ),
  secure: true,
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET,
} ) );

app.use( grant );

/* Route used to read a generated GIF. */

app.use( '/images', express.static( __dirname + '/.data/' ) );


app.get( '/', function( req, res ) {
  if ( req.session && req.session.grant ) {
    if ( req.session.grant.response ){
      console.log( 'grant', req.session.grant.response );
    }
  }
  res.sendFile( __dirname + '/views/index.html' );

} );

app.get( '/connect-tumblr', function( req, res ) {
  res.sendFile( __dirname + '/views/connect-tumblr.html' )
} );

app.get( '/callback', function( req, res ) {
  res.redirect( '/' );
} );

app.get( '/disconnect', function( request, res ) {
  request.session.destroy( function( err ) {
    res.redirect( '/' );
  } );
} );

app.use( express.static( 'public' ) );

module.exports = app;
