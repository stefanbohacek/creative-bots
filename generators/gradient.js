const fs = require( 'fs' ),
      Canvas = require( 'canvas' ),
      img_path_png = './.data/temp.png',
      helpers = require( __dirname + '/../helpers/helpers.js' );

module.exports = function( options, cb ) {
  /* 
    Random gradient generator. See more examples at https://github.com/Automattic/node-canvas/tree/master/examples.
  */
  let width = options.width || 1200,
      height = options.height || 500;

  console.log( 'making gradient...' );
  let canvas = Canvas.createCanvas( width, height ),
      ctx = canvas.getContext( '2d' );

  let lingrad = ctx.createLinearGradient( helpers.getRandomInt( 0, height ), helpers.getRandomInt( 0, height ), helpers.getRandomInt( 0, width ), helpers.getRandomInt( 0, width ) )

  let colors = [];
  for ( let i = 0; i<3; i++ ){
      if ( options.colors.length >= i+1 ){
          colors.push( `#${options.colors[i]}` );
      }
      else{
          colors.push( helpers.get_random_hex(  ) );
      }
  }

  lingrad.addColorStop( 0, colors[0] );
  lingrad.addColorStop( 0.5, colors[1] );
  lingrad.addColorStop( 1, colors[2] );
  
  ctx.fillStyle = lingrad;
  ctx.fillRect( 0, 0, width, height );

  const out = fs.createWriteStream( img_path_png );
  const stream = canvas.createPNGStream(  );
  stream.pipe( out );

  out.on( 'finish', function(){
    if ( cb ){
      cb( null, canvas.toBuffer().toString( 'base64' ) );
    }
  } );    
}