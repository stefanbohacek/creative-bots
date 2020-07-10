/*
  Based on https://github.com/dustinbarnes/pixel-sorting
*/

const fs = require( 'fs' ),
      png = require( 'pngjs' ).PNG,
      path = require( 'path' ),
      imgPathPNG = './.data/temp.png',
      pixel_sorter = {
        invert: require( __dirname + '/../.pixel-sorting/lib/invert.js' ),
        blackAndWhite: require( __dirname + '/../.pixel-sorting/lib/black-and-white.js' ),
        pixelSortBlack: require( __dirname + '/../.pixel-sorting/lib/pixel-sort-black.js' ),
        pixelSortBlackHoriz: require( __dirname + '/../.pixel-sorting/lib/pixel-sort-black-horiz.js' ),
        pixelSortBlackVert: require( __dirname + '/../.pixel-sorting/lib/pixel-sort-black-vert.js' ),
        pixelSortWhite: require( __dirname + '/../.pixel-sorting/lib/pixel-sort-white.js' ),
        pixelSortBrightness: require( __dirname + '/../.pixel-sorting/lib/pixel-sort-brightness.js' ),
        pixelSortGreenChannel: require( __dirname + '/../.pixel-sorting/lib/pixel-sort-green-channel.js' ),
        pixelSortRedChannel: require( __dirname + '/../.pixel-sorting/lib/pixel-sort-red-channel.js' ),
        pixelSortBlueChannel: require( __dirname + '/../.pixel-sorting/lib/pixel-sort-blue-channel.js' ),
        redBlueSwitch: require( __dirname + '/../.pixel-sorting/lib/red-blue-switch.js' ),
        redGreenSwitch: require( __dirname + '/../.pixel-sorting/lib/red-green-switch.js' ),
        blueGreenSwitch: require( __dirname + '/../.pixel-sorting/lib/blue-green-switch.js' ),
        purePixelSort: require( __dirname + '/../.pixel-sorting/lib/pure-pixel-sort.js' ),
        purePixelSortVertical: require( __dirname + '/../.pixel-sorting/lib/pure-pixel-sort-vertical.js' ),
        purePixelSortHorizontal: require( __dirname + '/../.pixel-sorting/lib/pure-pixel-sort-horizontal.js' ),
        pixelSortGrayout: require( __dirname + '/../.pixel-sorting/lib/pixel-sort-grayout.js' ),
        pixelSortBlackHi: require( __dirname + '/../.pixel-sorting/lib/pixel-sort-black-hi.js' ),
        //normalizeBrightness: require( __dirname + '/../.pixel-sorting/lib/normalize-brightness.js' )
      }, 
      helpers = require( __dirname + '/../helpers/helpers.js' );

module.exports = function( img_data, cb ){
  console.log( 'sorting pixels...' );

  fs.writeFile( imgPathPNG, img_data, 'base64', function( err ) {
    fs.createReadStream( imgPathPNG )
      .pipe( new png( {
          checkCRC: false
      } ) )
      .on( 'parsed', function() {
        var image = this;
        // pixel_sorter.pixelSortBlackHoriz.draw( image );
        // pixel_sorter.invert.draw( image );
        // pixel_sorter.blackAndWhite.draw( image );
        // pixel_sorter.pixelSortBlack.draw( image );
        // pixel_sorter.pixelSortBlackHoriz.draw( image );
        // pixel_sorter.pixelSortBlackVert.draw( image );
        pixel_sorter.pixelSortWhite.draw( image );
        // pixel_sorter.pixelSortBrightness.draw( image );
        // pixel_sorter.pixelSortGreenChannel.draw( image );
        pixel_sorter.pixelSortRedChannel.draw( image );
        // pixel_sorter.pixelSortBlueChannel.draw( image );
        // pixel_sorter.redBlueSwitch.draw( image );
        // pixel_sorter.redGreenSwitch.draw( image );
        // pixel_sorter.blueGreenSwitch.draw( image );
        // pixel_sorter.purePixelSort.draw( image );
        // pixel_sorter.purePixelSortVertical.draw( image );
        // pixel_sorter.purePixelSortHorizontal.draw( image );
        // pixel_sorter.pixelSortGrayout.draw( image );
        pixel_sorter.pixelSortBlackHi.draw( image );

        this.pack().pipe( fs.createWriteStream( imgPathPNG ).on( 'finish', function(){
          var imgData = fs.readFileSync( imgPathPNG, { encoding: 'base64' } );
          cb( null, imgData );
        } ) );
      } );
  } );
}