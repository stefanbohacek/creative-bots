Glitch Twitter bot template 
===================================

![Tweetin'](https://cdn.gomix.com/4032b241-bff8-473e-aa6b-eb0c92a4bd06%2Ftweeting.gif)

This is a template for making fun Twitter bots with [Glitch](https://glitch.com/) and the [Twit](https://github.com/ttezel/twit) node.js library.

## A quick tutorial

1. Create a new Twitter account and a new Twitter app. ([See how.](https://botwiki.org/tutorials/how-to-create-a-twitter-app/))
2. Update the `.env` file with your Twitter API key/secrets and change the `BOT_ENDPOINT` (it could just be random letters).
3. Update `server.js` with some cool Twitter bot code. (Make sure your bot follows [Twitter's rules](https://support.twitter.com/articles/18311-the-twitter-rules) and is overall [not a jerk](https://botwiki.org/articles/essays/).)
4. Set up a free service ([cron-job.org](https://cron-job.org/en/), [Uptime Robot](https://uptimerobot.com/), or [a similar one](https://www.google.com/search?q=free+web+cron)) to wake up your bot [every 25+ minutes](https://support.glitch.com/t/a-simple-twitter-bot-template/747/16) and tweet. Use `https://YOUR_PROJECT_NAME.glitch.me/BOT_ENDPOINT` as a URL to which to send the HTTP request.


Be sure to check out `EXAMPLES.js` first. You can add your own helper methods using [the Twit module](https://github.com/ttezel/twit).

There are more tutorials and open source Twitter bots on [Botwiki](https://botwiki.org).

And remember to [join Botmakers](https://botmakers.org/) and [submit your bot to Botwiki](https://botwiki.org/submit-your-bot) :-)

## More starter projects

For more bot starter projects on Glitch, check out the official [Botwiki page on Glitch](https://glitch.com/botwiki).


## Note on bots that auto-reply to DMs/@ mentions

Apps hosted on Glitch are automatically put to sleep after 5 minutes of inactivity (that is, if nobody opens your app in a browser window or it doesn't receive any data).

Twitter's API doesn't send requests to your app, instead your app has to poll Twitter for data. 

See [this Glitch starter project](https://glitch.com/edit/#!/twitterbot-autorespond) where i work around this limitation and make a Twitter bot that responds to DMs and @ mentions (with a [25 minute delay](https://support.glitch.com/t/a-simple-twitter-bot-template/747/16)).

## Support Botwiki/Botmakers

- [patreon.com/botwiki](https://patreon.com/botwiki)
- [botwiki.org/about/support-us](https://botwiki.org/about/support-us)

🙇

**Powered by [Glitch](https://glitch.com)**

\ ゜o゜)ノ
