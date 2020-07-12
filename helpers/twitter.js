const helpers = require(__dirname + '/../helpers/helpers.js'),
      Twit = require( 'twit' ),
      Q = require( 'q' );

class TwitterClient {
  constructor( keys, useAltClient ) {
    let twitterClientInstance = {};

    if ( keys && keys.consumer_key && keys.consumer_secret && keys.access_token && keys.access_token_secret ){
      twitterClientInstance = new Twit( keys );  
    } else {
      console.log( 'missing Twitter API keys' );
    }
    
    if ( useAltClient ){
      twitterClientInstance._buildReqOpts = function (method, path, params, isStreaming, callback) {
        var helpers = require('twit/lib/helpers');
        var endpoints = require('twit/lib/endpoints');
        var FORMDATA_PATHS = [];
        var self = this
        if (!params) {
            params = {}
        }
        // clone `params` object so we can modify it without modifying the user's reference
        var paramsClone = JSON.parse(JSON.stringify(params))
        // convert any arrays in `paramsClone` to comma-seperated strings
        var finalParams = this.normalizeParams(paramsClone)
        delete finalParams.twit_options

        // the options object passed to `request` used to perform the HTTP request
        var reqOpts = {
          headers: {
            'Accept': '*/*',
            'User-Agent': 'Twitter-iPhone/6.45 iOS/9.0.2 (Apple;iPhone8,2;;;;;1)',
            'X-Twitter-Client': 'Twitter-iPhone',
            'X-Twitter-API-Version': '5',
            'X-Twitter-Client-Language': 'en',
            'X-Twitter-Client-Version': '6.45'
          },
          gzip: true,
          encoding: null,
        }

        if (typeof self.config.timeout_ms !== 'undefined') {
            reqOpts.timeout = self.config.timeout_ms;
        }

        try {
            // finalize the `path` value by building it using user-supplied params
            path = helpers.moveParamsIntoPath(finalParams, path)
        } catch (e) {
            callback(e, null, null)
          return
        }

        if (isStreaming) {
            // This is a Streaming API request.
          var stream_endpoint_map = {
            user: endpoints.USER_STREAM,
            site: endpoints.SITE_STREAM
          }
          var endpoint = stream_endpoint_map[path] || endpoints.PUB_STREAM
          reqOpts.url = endpoint + path + '.json'
        } else {
            // This is a REST API request.
          if (path === 'media/upload') {
            // For media/upload, use a different entpoint and formencode.
            reqOpts.url = endpoints.MEDIA_UPLOAD + 'media/upload.json';
          } else if(path.indexOf('cards/') === 0) {
            reqOpts.url = 'https://caps.twitter.com/v2/' + path + '.json';
          } else {
            reqOpts.url = endpoints.REST_ROOT + path + '.json';
          }

          if (FORMDATA_PATHS.indexOf(path) !== -1) {
            reqOpts.headers['Content-type'] = 'multipart/form-data';
            reqOpts.form = finalParams;
            // set finalParams to empty object so we don't append a query string
            // of the params
            finalParams = {};
          } else {
            reqOpts.headers['Content-type'] = 'application/json';
          }
        }

        if (Object.keys(finalParams).length) {
          // not all of the user's parameters were used to build the request path
          // add them as a query string
          var qs = helpers.makeQueryString(finalParams)
          reqOpts.url += '?' + qs
        }

        if (!self.config.app_only_auth) {
          // with user auth, we can just pass an oauth object to requests
          // to have the request signed
          var oauth_ts = Date.now() + self._twitter_time_minus_local_time_ms;

          reqOpts.oauth = {
            consumer_key: self.config.consumer_key,
            consumer_secret: self.config.consumer_secret,
            token: self.config.access_token,
            token_secret: self.config.access_token_secret,
            timestamp: Math.floor(oauth_ts/1000).toString(),
          }

          callback(null, reqOpts);
          return;
        } else {
            // we're using app-only auth, so we need to ensure we have a bearer token
            // Once we have a bearer token, add the Authorization header and return the fully qualified `reqOpts`.
            self._getBearerToken(function (err, bearerToken) {
            if (err) {
              callback(err, null);
              return;
            }

            reqOpts.headers['Authorization'] = 'Bearer ' + bearerToken;
            callback(null, reqOpts);
            return;
          })
        }
      }        
    }
  
    
    this.client = twitterClientInstance;
  }

  tweet( text, cb ) {
      console.log( 'tweeting...' );
      if ( this.client ){
        this.client.post( 'statuses/update', { status: text }, function( err, data, response ) {
          if ( data && data.id_str && data.user && data.user.screen_name ){
            console.log( 'tweeted', `https://twitter.com/${ data.user.screen_name }/status/${ data.id_str }` );
          }
          if ( err ){
            console.log( 'Twitter API error', err );
          }
          if ( cb ){
            cb( err, data );
          }
        } );
      }
  }

  postImage( status, imageBase64, cb, inReplyToID ){
    if ( this.client ){
      let client = this.client;
      
      this.client.post( 'media/upload', { media_data: imageBase64 }, function ( err, data, response ) {
        if ( err ){
          console.log( 'error:', err );
          if ( cb ){
            cb( err );
          }
        }
        else{
          console.log( 'uploaded image, now tweeting it...' );

          let tweetObj = {
            media_ids: new Array( data.media_id_string )
          };

          if ( status ){
            tweetObj.status = status;
          }

          if ( inReplyToID ){
            tweetObj.in_reply_to_status_id = inReplyToID;
          }

          client.post( 'statuses/update', tweetObj, function( err, data, response ) {
            if ( data && data.id_str && data.user && data.user.screen_name ){
              console.log( 'tweeted', `https://twitter.com/${ data.user.screen_name }/status/${ data.id_str }` );
            }
            if ( err ){
              console.log( 'Twitter API error', err );
            }
            if ( cb ){
              cb( err, data );
            }
          } );
        }
      } ); 
    }
  }

  updateProfileImage( imageBase64, cb ){
    if ( this.client ){
      console.log( 'updating profile image...' );
      this.client.post( 'account/update_profile_image', {
        image: imageBase64
      }, function( err, data, response ) {
        if ( err ){
          console.log( 'error', err );
        }
        if ( cb ){
          cb( err, data );
        }
      } );
    }
  }

  deleteLastTweet( cb ){
    if ( this.client ){
      console.log( 'deleting last tweet...' );
      this.client.get( 'statuses/user_timeline', function( err, data, response ) {
        if ( err ){
          if ( cb ){
            cb( err, data );
          }
          return false;
        }
        if ( data && data.length > 0 ){
          let last_tweet_id = data[0].id_str;
          this.client.post( `statuses/destroy/${last_tweet_id}`, { id: last_tweet_id }, function( err, data, response ) {
            if ( cb ){
              cb( err, data );
            }
          } );
        } else {
          if ( cb ){
            cb( err, data );
          }
        }
      } );  
    }      
  }
  
  postPoll( statustext, entries, duration ){
    const client = this.client;
    
    console.log( client );
    var params = {
      'twitter:api:api:endpoint': '1',
      'twitter:card': 'poll' + entries.length + 'choice_text_only',
      'twitter:long:duration_minutes': duration || 1440, //default 1-day
    };

    if ( entries.length < 2 ) {
      throw 'Must have at least two poll entries';
    }
    if ( entries.length > 4 ) {
      throw 'Too many poll entries ( max 4 )';
    }

    entries.forEach( 
       function( val, i ) {
           params['twitter:string:choice' + ( i + 1 ) + '_label'] = val;
       }
     );

    return Q.nfcall( 
      client.post.bind( client ),
      'cards/create',
      {
        'card_data' : JSON.stringify( params )
      }
     ).then( function( pack ) {
      var data = pack[0];
      if ( data.status === 'FAILURE' ) {
        throw pack;
      } else {
        return data;
      }
    }, function( err ) {
      console.error( 'Error on creating twitter card', err );
    } ).then( function( data ) {
      return Q.nfcall( 
        client.post.bind( client ),
        'statuses/update',
        {
          'status': statustext, 
          'card_uri': data.card_uri,
          'include_cards': 1,
          'cards_platform': 'iPhone-13',
          'contributor_details': 1
        }
       ).then( function( pack ) {
        return pack[0];   
      }, function( err ) {
        console.error( 'Error on posting tweet' );
        console.error( err );
      } );
    } );    
  }

  getCard( tweet ) {
    return Q.nfcall(
      this.get.bind(this),
      'statuses/show/' + tweet.id_str, 
      {
        cards_platform: 'iPhone-13',
        include_cards: 1,
      }
    ).then(function(pack) {
      var data = pack[0];
      return data.card;   
    }, function(err) {
        console.error('Error getting card data');
        console.error(err);
    });
  }
}

module.exports = TwitterClient;
