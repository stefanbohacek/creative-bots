const request = require( 'request' ),
      helpers = require(__dirname + '/../helpers/helpers.js');

module.exports = {
  getRandomDataSet: function( options, cb ){
    if ( options.domain ){
      const socrataURL = `https://api.us.socrata.com/api/catalog/v1?domains=${ options.domain }&offset=${ options.offset || 0 }&limit=${ options.limit || 10000 }`;

      console.log( 'loading datasets...', socrataURL );

      request( socrataURL, function( error, response, body ){
        const data = JSON.parse( body );
        // console.log( data );

        if ( data && data.results ){

          let datasets = data.results,
              dataset;

          if ( options.onlyPreview ){
            datasets = datasets.filter( function( item ){
              return item.preview_image_url && typeof item.preview_image_url !== undefined;
            } );
          }


          if ( options.dataTypes ){
            dataset = helpers.randomFromArray( datasets.filter( function( item ){
              return options.dataTypes.indexOf( item.resource.lens_view_type ) !== -1;
            } ) );
          } else {
            dataset = helpers.randomFromArray( datasets );
          }

          if ( cb ){
            cb( null, dataset );
          }
        } else {
          if ( cb ){
            cb( 'unable to fetch data', null );
          }
        }
      } );
    } else {
      if ( cb ){
        cb( 'missing domain', null );
      }
    }
  }
};
