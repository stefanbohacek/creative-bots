# Creative bots

![Tweetin'](https://botwiki.org/wp-content/uploads/2020/05/tweet.gif)

This is a template for making creative online bots with [Glitch](https://glitch.com/). This project requires a [paid subscription](https://glitch.com/pricing).

## A quick tutorial

1. Create accounts for all of your bots. Currently supported networks:

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

## Support Botwiki/Botmakers

- [patreon.com/botwiki](https://patreon.com/botwiki)
- [botwiki.org/about/support-us](https://botwiki.org/about/support-us)

🙇

**Powered by [Glitch](https://glitch.com)**

\ ゜o゜)ノ
