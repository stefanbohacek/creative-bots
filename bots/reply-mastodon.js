const helpers = require(__dirname + '/../helpers/helpers.js'),
      cronSchedules = require(__dirname + '/../helpers/cron-schedules.js'),
      mastodonClient = require(__dirname + '/../helpers/mastodon.js');

const mastodon = new mastodonClient({
   access_token: process.env.BOT_1_MASTODON_ACCESS_TOKEN,
   api_url: process.env.BOT_1_MASTODON_API
});

module.exports = {
  active: true,
  clients: {mastodon},
  name: 'A basic reply bot',
  description: 'Just a very basic bot that replies!',
  reply: function(postID, from, messageText, fullMessage){
    
    const messageTextLowercase = messageText.toLowerCase();
    const messageVisibility = fullMessage.data.status.visibility;
    
    // A message can be public, unlisted, private, or direct
    
    const greetings = ['hello', 'hi', 'hey', 'howdy', 'nice to meet you'];
    const containsGreeting = new RegExp(greetings.join('|')).test(messageText.toLowerCase());
    
    let replyText;
    
    if (containsGreeting){
      replyText = 'Hello there!';
    } else {
      replyText = 'Yes?';
    }

    console.log(`new ${messageVisibility} message from ${from}: ${messageText}`);
    console.log(`replying with: ${replyText}`);
    
    mastodon.reply(fullMessage, replyText);
  }
};
