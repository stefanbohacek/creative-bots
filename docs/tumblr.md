# Setting up Tumblr API keys

1. Go to [tumblr.com/oauth/apps](https://www.tumblr.com/oauth/apps) and register your application. Use `https://PROJECT_NAME.glitch.me/connect/tumblr/callback` as your callback url.
2. Inside `app.js` update `tumblr.key` and `tumblr.secret` based on which bot you want to authenticate.
3. Copy the "oAuth Consumer Key" and "Secret Key" to your `.env` file. Also be sure to update the `SESSION_SECRET`.
4. Visit your project's page at `https://PROJECT_NAME.glitch.me/connect-tumblr` and connect your app to Tumblr.
5. Click the Tools button in the Glitch editor, then Logs, and copy `access_token` and `access_secret` to your `.env` file.

Check out the [documentation for tumblr.js](https://tumblr.github.io/tumblr.js/index.html) to see what your bot can do.

*Based on the [tumblr-api-example](https://glitch.com/edit/#!/tumblr-api-example) project.*
