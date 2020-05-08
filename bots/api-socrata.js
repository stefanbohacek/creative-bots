const helpers = require(__dirname + '/../helpers/helpers.js'),
      socrata = require(__dirname + '/../helpers/socrata.js'),
      TwitterClient = require(__dirname + '/../helpers/twitter.js'),    
      mastodonClient = require(__dirname + '/../helpers/mastodon.js'), 
      tumblrClient = require(__dirname + '/../helpers/tumblr.js');

const twitter = new TwitterClient( {
  consumer_key: process.env.BOT_1_TWITTER_CONSUMER_KEY,
  consumer_secret: process.env.BOT_1_TWITTER_CONSUMER_SECRET,
  access_token: process.env.BOT_1_TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.BOT_1_TWITTER_ACCESS_TOKEN_SECRET
} );

// const mastodon = new mastodonClient( {
//    access_token: process.env.BOT_1_MASTODON_ACCESS_TOKEN,
//    api_url: process.env.BOT_1_MASTODON_API
// } );

// const tumblr = new tumblrClient( {
//   tumblr_name: process.env.BOT_1_TUMBLR_BLOG_NAME,
//   consumer_key: process.env.BOT_1_TUMBLR_CONSUMER_KEY,
//   consumer_secret: process.env.BOT_1_TUMBLR_CONSUMER_SECRET,
//   token: process.env.BOT_1_TUMBLR_CONSUMER_TOKEN,
//   token_secret: process.env.BOT_1_TUMBLR_CONSUMER_TOKEN_SECRET
// } );

module.exports = function(){
  socrata.getRandomDataSet( {
    domain: 'data.cityofnewyork.us',
    offset: 0,
    limit: 10000,
    // dataTypes: ['tabular', 'geo']
    dataTypes: ['geo'],
    onlyPreview: true
  }, function( err, dataset ){
      console.log( {
        'resource name': dataset.resource.name,
        'resource description': dataset.resource.description,
        // 'dataset.resource.id': dataset.resource.id,
        // 'dataset.resource.lens_view_type': dataset.resource.lens_view_type,
        'preview_image_url': dataset.preview_image_url,
        'link': dataset.link,
        // 'dataset': dataset
      } );

      const text = `${ dataset.resource.name } ${ dataset.link } #nyc #opendata` ;

      helpers.loadImage( dataset.preview_image_url, function( err, imgData ){
        if ( err ){
          console.log( err );     
        }
        else{
          twitter.postImage( text, imgData );
          // mastodon.postImage( text, imgData );
          // tumblr.postImage( text, imgData );
        }
      } );        
  } );  
  
};