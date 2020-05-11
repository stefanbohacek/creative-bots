# Multiple random image bots

Glitch doesn't support folders inside the assets folder, so to get around that, if you want to have multiple random image bots, or to keep images in your assets folder that you don't want the bot to post, you can add a prefix to each image and then filter the images using this prefix. 

![Fake folders](https://cdn.glitch.com/4a38233a-ac02-4eca-ac75-36f4fd81ee5d%2Freadme-random-img.png)


```js
const imgPrefix = 'bot1img-';

const imgUrl = helpers.randomFromArray( assetUrls.filter( function( asset){
  return asset.indexOf( imgPrefix ) !== -1;
} ) );      

helpers.loadImage( imgUrl, function( err, imgData ){
  const text = helpers.randomFromArray( [
    'Hello!',
    'Hi!',
    'Hi there!'
  ] );

  twitter.postImage( text, imgData );
  mastodon.postImage( text, imgData );
  tumblr.postImage( text, imgData );
} );
```