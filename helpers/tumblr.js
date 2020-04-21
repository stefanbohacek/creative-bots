const fs = require( 'fs' ),
      helpers = require(__dirname + '/../helpers/helpers.js'),
      tumblr = require( 'tumblr.js' );

class TumblrClient {
  constructor( keys ) {
    let tumblrClientInstance = {};

    if ( keys && keys.consumer_key && keys.consumer_secret && keys.token && keys.token_secret ){
      tumblrClientInstance = tumblr.createClient( keys );
      tumblrClientInstance.tumblr_name = keys.tumblr_name;
    } else {
      console.log( 'missing Tumblr API keys and/or blog name' );
    }
    this.client = tumblrClientInstance;
  }
  post( title, body, cb ) {
    if ( this.client ){
      let client = this.client;
      
      console.log( 'tumblring...' );
      this.client.createTextPost( this.client.tumblr_name, {
        title: title,
        body: body
      }, function( err, data ){
        console.log( 'tumblrd', `https://${ client.tumblr_name }.tumblr.com/post/${ data.id_string }` )
        if ( cb ){
          cb( err, data );
        }
      });  
    }
  }
  postImage( text, imageBase64, cb ){
    if ( this.client ){
      let client = this.client;
      
      console.log( 'tumblring...' );
      this.client.createPhotoPost( this.client.tumblr_name, {
        caption: text,
        data64: imageBase64
      }, function( err, data ){
        console.log( 'tumblrd', `https://${ client.tumblr_name }.tumblr.com/post/${ data.id_string }` )
        if ( cb ){
          cb( err, data );
        }
      });
    }
  }
}

module.exports = TumblrClient;
