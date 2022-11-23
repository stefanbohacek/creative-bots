# Creative bots

![Tweetin'](https://botwiki.org/wp-content/uploads/2020/05/tweet.gif)

This is a template for making creative online bots.

## A quick tutorial

Read [the full tutorial on my blog](https://fourtonfish.com/project/creative-bots/). In short:

1. Choose wheree you want to host your bot. Note that these services require a paid subscription.
- [remix this project on Glitch](https://glitch.com/edit/#!/remix/creative-bots) ([pricing](https://glitch.com/pricing))
- [import to Heroku](https://heroku.com/deploy?template=https://github.com/fourtonfish/creative-bots/tree/master) ([pricing]())
- [import to repl.it](https://repl.it/glitch/creative-bots) ([pricing](https://repl.it/site/pricing))
- [download the code from GitHub](https://github.com/fourtonfish/creative-bots/archive/master.zip) and host it on your own server

2. Create accounts for all of your bots. Currently supported networks:

<ul>
    <li><a href="https://botwiki.org/tutorials/how-to-create-a-twitter-app/" target="_blank">Twitter</a></li>
    <li><a href="https://botwiki.org/resource/tutorial/how-to-make-a-mastodon-botsin-space-app-bot/" target="_blank">Mastodon</a></li>
    <li><a href="https://glitch.com/edit/#!/creative-bots?path=docs%2Ftumblr.md%3A1%3A0" target="_blank">Tumblr</a></li>
</ul>

2. Update the `.env` file with your Twitter API keys/secrets.
3. All bots are automatically loaded from the `bots` folder. Update an existing bot, or add your own.

Each bot file needs to export an object with the following information:

```
{
  active: true,
  name: 'A basic bot',
  description: 'Just a very basic bot!',
  interval: cronSchedules.EVERY_THREE_HOURS,
  script: function(){
    /* This is your bot's main code. */
  }
}
```

You can change `active` to `false` to prevent a bot from being scheduled. For `interval` you can either use one of the values inside `helpers/cron-schedules.js`, or you can use a custom cron schedule -- see [the cron package documentation](https://www.npmjs.com/package/cron#available-cron-patterns) for more details.

Check out [stefans-creative-bots](https://stefans-creative-bots.glitch.me) project for an example remix of this project.


Make sure your bot follows rules of the networks it's posting on and is overall [not a jerk](https://botwiki.org/articles/essays/). Visit [Botwiki](https://botwiki.org) for tutorials and open source bots and remember to [join Botmakers](https://botmakers.org/) and [submit your bot to Botwiki](https://botwiki.org/submit-your-bot) :-)

## FAQ and known issues

**Bots that use puppeteer stopped working.**

Be sure to update puppeteer to the [latest version](https://www.npmjs.com/package/puppeteer).


## Support Botwiki/Botmakers

- [Become a patren](https://patreon.com/botwiki)
- [Other ways to support us](https://botwiki.org/about/support-us)
- [Our supporters](https://botwiki.org/about/supporters/)

🙇
