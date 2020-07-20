const fs = require( 'fs' ),
      path = require( 'path' ),
      fetch = require('node-fetch'),
      request = require( 'request' ),
      exec  = require( 'child_process' );

module.exports = {
  capitalizeFirstLetter: function( str ){
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();    
  },
  randomFromArray: function( arr ) {
    return arr[Math.floor( Math.random() * arr.length )]; 
  },
  randomFromArrayUnique: function(arr, count) {
    var new_arr = [];
    for (var i = 0; i < count; i++){
      arr.sort(function(){return Math.round(Math.random());});
      new_arr.push(arr.pop());
    }
    return new_arr;
  },  
  getRandomInt: function( min, max ) {
    return Math.floor( Math.random() * ( max - min + 1 ) ) + min;
  },
  getRandomRange: function( min, max, fixed ) {
    return ( Math.random() * ( max - min ) + min ).toFixed( fixed ) * 1;
  },
  getRandomHex: function() {
    return '#' + Math.random().toString( 16 ).slice( 2, 8 ).toUpperCase();
  },
  shadeColor: function( color, percent ) {
    // https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
    let f = parseInt( color.slice( 1 ),16 ),t=percent<0?0:255,p=percent<0?percent*-1:percent,R=f>>16,G=f>>8&0x00FF,B=f&0x0000FF;
    return `#${( 0x1000000+( Math.round( ( t-R )*p )+R )*0x10000+( Math.round( ( t-G )*p )+G )*0x100+( Math.round( ( t-B )*p )+B ) ).toString( 16 ).slice( 1 )}`;
  },
  invertColor: function(hex){
    /* https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color */
    function padZero(str, len) {
      len = len || 2;
      var zeros = new Array(len).join('0');
      return (zeros + str).slice(-len);
    }
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
        throw new Error('Invalid HEX color.');
    }
    var r = (255 - parseInt(hex.slice(0, 2), 16)).toString(16),
        g = (255 - parseInt(hex.slice(2, 4), 16)).toString(16),
        b = (255 - parseInt(hex.slice(4, 6), 16)).toString(16);
    return '#' + padZero(r) + padZero(g) + padZero(b);
  },  
  loadAssets: function( cb ){
    console.log( 'reading assets folder...' )
    let that = this;
    fs.readFile( './.glitch-assets', 'utf8', function ( err, data ) {
      if ( err ) {
        console.log( 'error:', err );
        cb( err );
        return false;
      }
      cb( null, data );
    } );      
  },
  loadImageAssets: function( cb ){
    let helpers = this;

    helpers.loadAssets( function( err, data ){
      /* Filter images in the assets folder */
      data = data.split( '\n' );

      let data_json = JSON.parse( '[' + data.join( ',' ).slice( 0, -1 ) + ']' );
      
      let deleted_images = data_json.reduce( function( filtered, data_img ) {
            if ( data_img.deleted ) {
               let someNewValue = { name: data_img.name, newProperty: 'Foo' }
               filtered.push( data_img.uuid );
            }
            return filtered;
          }, [] ),
          img_urls = [];
    
        for ( let i = 0, j = data.length; i < j; i++ ){
          if ( data[i].length ){
            let img_data = JSON.parse( data[i] ),
                image_url = img_data.url;
  
            if ( image_url && deleted_images.indexOf( img_data.uuid ) === -1 && helpers.extensionCheck( image_url ) ){
              let file_name = helpers.getFilenameFromURL( image_url ).split( '%2F' )[1];
              console.log( `- ${file_name}` );
              img_urls.push( image_url );
            }
          }
        }
        if ( img_urls && img_urls.length === 0 ){
          console.log( 'no images found...' );
        }
        cb( null, img_urls );
    } );
  },
  extensionCheck: function( url ) {
    let file_extension = path.extname( url ).toLowerCase(),
        extensions = ['.png', '.jpg', '.jpeg', '.gif'];
    return extensions.indexOf( file_extension ) !== -1;
  },
  getFilenameFromURL: function( url ) {
    return url.substring( url.lastIndexOf( '/' ) + 1 );
  },
  loadImage: function( url, cb ) {
    console.log( 'loading remote image...', url );
    request( { url: url, encoding: null }, function ( err, res, body ) {
        if ( !err && res.statusCode == 200 ) {
          let b64content = 'data:' + res.headers['content-type'] + ';base64,';
          console.log( 'image loaded...' );
          cb( null, body.toString( 'base64' ) );
        } else {
          console.log( 'ERROR:', err );
          cb( err );
        }
    } );
  },
  removeAsset: function( url, cb ){
    let helpers = this;
    console.log( 'removing asset...' );
    helpers.loadAssets( function( err, data ){
      let data_array = data.split( '\n' ),
          img_data;
      data_array.forEach( function( d ){
        if ( d.indexOf( url ) > -1 ){
            img_data = JSON.parse( d );
            return;
        }
      } );

      data += `{"uuid":"${img_data.uuid}","deleted":true}\n`;
      fs.writeFile( __dirname + '/.glitch-assets', data );
      exec.exec( 'refresh' );
    } );
  },
  downloadFile: function( uri, cb ){
    // request.head( uri, function( err, res, body ){
    //   request( uri ).pipe( fs.createWriteStream( filename ) ).on( 'close', cb );
    // } );
    
    try {
        fetch( uri )
            .then( res => res.buffer() )
            .then( buffer => {
              console.log( buffer )
              if ( cb ){
                cb( null, buffer );
              }
        } );
    } catch ( err ) {
        console.log( err );
    }

  },
  removeFile: function( filePath ){
    setTimeout( function(){
      if ( fs.existsSync( filePath ) ){
        fs.unlinkSync( filePath );
      }
    }, 30000 );
  }
};
