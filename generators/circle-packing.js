const fs = require( 'fs' ),
      Canvas = require( 'canvas' ),
      concat = require( 'concat-stream' ),
      GIFEncoder = require( 'gifencoder' ),
      helpers = require( __dirname + '/../helpers/helpers.js' );

module.exports = function( options, cb ) {
  /* 
    Based on https://generativeartistry.com/tutorials/circle-packing/
  */
  console.log( 'packing circles...' );

  let width = options.width || 1184,
      height = options.height || 506,
      size = width,
      colors = options.colors || ['000', 'fff'],
      canvas = Canvas.createCanvas( width, height ),
      ctx = canvas.getContext( '2d' ),
      encoder = new GIFEncoder( width, height );
  
  if ( options.animate ){
    encoder.createReadStream().pipe( concat( ( data ) => {
      if ( cb ){
        cb( null, data.toString( 'base64' ) );
      }
    } ) );

    encoder.start();
    encoder.setRepeat( -1 );   // 0 for repeat, -1 for no-repeat
    encoder.setDelay( 100 );   // frame delay in milliseconds
    encoder.setQuality( 10 ); // image quality, 10 is default.
  }

  ctx.lineWidth = helpers.getRandomInt( 1,4 );
  ctx.fillStyle = colors[0];
  ctx.strokeStyle = colors[1];
  ctx.fillRect( 0, 0, canvas.width, canvas.height );

  if ( options.animate ){
    encoder.addFrame( ctx );
  }

  let circles = [],
      minRadius = 2,
      maxRadius = 100,
      totalCircles = 500;
  
  if ( options.animated === true ){
    // totalCircles = 250;
    totalCircles = 230;
  }

  let createCircleAttempts = 500;

  function doesCircleHaveACollision( circle ) {
    for ( let i = 0; i < circles.length; i++ ) {
      let otherCircle = circles[i];
      let a = circle.radius + otherCircle.radius;
      let x = circle.x - otherCircle.x;
      let y = circle.y - otherCircle.y;

      if ( a >= Math.sqrt( ( x*x ) + ( y*y ) ) ) {
        return true;
      }
    }

    if ( circle.x + circle.radius >= size ||
       circle.x - circle.radius <= 0 ) {
      return true;
    }

    if ( circle.y + circle.radius >= size ||
        circle.y-circle.radius <= 0 ) {
      return true;
    }

    return false;
  }

  function createAndDrawCircle() {
    let newCircle;
    let circleSafeToDraw = false;
    for ( let tries = 0; tries < createCircleAttempts; tries++ ) {
      newCircle = {
        x: Math.floor( Math.random() * size ),
        y: Math.floor( Math.random() * size ),
        radius: minRadius
      }

      if ( doesCircleHaveACollision( newCircle ) ) {
        continue;
      } else {
        circleSafeToDraw = true;
        break;
      }
    }

    if ( !circleSafeToDraw ) {
      return;
    }

    for ( let radiusSize = minRadius; radiusSize < maxRadius; radiusSize++ ) {
      newCircle.radius = radiusSize;
      if ( doesCircleHaveACollision( newCircle ) ){
        newCircle.radius--
        break;
      } 
    }

    circles.push( newCircle );
    ctx.beginPath();
    ctx.arc( newCircle.x, newCircle.y, newCircle.radius, 0, 2*Math.PI );
    ctx.stroke(); 
  }

  for ( let i = 0; i < totalCircles; i++ ) {  
    createAndDrawCircle();
    if ( options.animate ){
      encoder.addFrame( ctx );
    }
  }

  if ( options.animate ){
    encoder.setDelay( 2000 );
    encoder.addFrame( ctx );
    encoder.finish();
  }
  else{
    cb( null, canvas.toBuffer().toString( 'base64' ) );
  }
}
