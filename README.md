Glitch Twitter bot template 
===================================

## Note

Apps hosted on Glitch are automatically put to sleep after 5 minutes of inactivity (that is, if nobody opens your app in a browser window).

Twitter's API doesn't send requests to your app, instead your app polls it, 

Due to how Twitter API works, hosting Twitter bots that wait for events on Glitch is not an option, because these bots won't receive any traffic.

You can still host bots that tweet on a regular schedule using services like [Uptime Robot](https://uptimerobot.com/)  .

- [random-image-twitterbot](https://glitch.com/edit/#!/random-image-twitterbot)
- [tracery-twitter-bot](https://glitch.com/~tracery-twitter-bot)


![Tweetin'](https://cdn.gomix.com/4032b241-bff8-473e-aa6b-eb0c92a4bd06%2Ftweeting.gif)


This is a template for making fun Twitter bots with [Glitch](https://glitch.com/) and the [Twit](https://github.com/ttezel/twit) node.js library.

  
## A quick tutorial

1. First, create a new Twitter account and a new Twitter app. [This tutorial](https://botwiki.org/tutorials/how-to-create-a-twitter-app/) explains how to do this.
2. Update the `.env` file with your Twitter API key/secrets. (The tutorial above explains how to get these.)
3. Finally, update `server.js` with some cool Twitter bot code.

The included example simply tweets out "Hello world!". Check out [the Twit module documentation](https://github.com/ttezel/twit) for more examples of what your bot can do, such as retweet a specific tweet by its ID:


```
T.post('statuses/retweet/:id', { id: '799687419259797504' }, function (err, data, response) {
  console.log(data)
});
```

Or perhaps respond to people talking to your bot:

```
var stream = T.stream('statuses/filter', { track: '@yourbotsname' });

stream.on('tweet', function (tweet) {
  if (tweet.text === 'hello'){
    T.post('statuses/update',{
      status: 'hello there 👋',
      in_reply_to_status_id: tweet.id
    }, function(err, data, response) {
      if (err){
        console.log('ERROR');
        console.log(err);          
      }
    });
  }
});

```

You can find more [tutorials](https://botwiki.org/tutorials/twitterbots/#tutorials-nodejs) and [open source Twitter bots](https://botwiki.org/tag/twitter+bot+opensource+nodejs/) on [Botwiki](https://botwiki.org).

And be sure to join the [Botmakers](https://botmakers.org/) online hangout and [submit your bot to Botwiki](https://botwiki.org/submit-your-bot) :-)


**Powered by [Glitch](https://glitch.com)**

\ ゜o゜)ノ
