const fs = require( 'fs' ),
      Canvas = require( 'canvas' );

module.exports = function( imgData, options, cb ) {
  let Image = Canvas.Image;

  const img = new Image;

  img.onload = function(){
    const sourceWidth = img.width,
          sourceHeight = img.height;
    
    let canvas = Canvas.createCanvas( sourceWidth, sourceHeight ),
        ctx = canvas.getContext( '2d' );

    ctx.drawImage(img, 0, 0)

    var size = ( options.size || 10 ) / 100,
        w = canvas.width * size,
        h = canvas.height * size;

    ctx.drawImage( img, 0, 0, w, h );

    ctx.msImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    ctx.drawImage( canvas, 0, 0, w, h, 0, 0, canvas.width, canvas.height );
    if ( cb ){
      cb( null, canvas.toBuffer().toString( 'base64' ) );
    }
  }

  img.onerror = err => { console.log(  err ) }
  img.src = 'data:image/png;base64,' + imgData;
}
