import Mastodon from "mastodon-api";

import post from './post.js';
import postImage from './post-image.js';
import reply from './reply.js';
import postPoll from './post-poll.js';

class MastodonClient {
  constructor(keys) {
    let mastodonClientInstance = {};

    if (keys && keys.access_token && keys.api_url) {
      mastodonClientInstance = new Mastodon(keys);
    } else {
      console.log("mastodon error: missing token or API URL");
    }

    this.client = mastodonClientInstance;
  }
  
  post(status, cb) {
    post(this.client, status, cb);
  }
  
  postImage(options, cb) {
    postImage(this.client, options, cb);
  }  

  reply(message, response, cb) {
    reply(this.client, message, response, cb)
  }
  
  postPoll(status, options, cb) {
    postPoll(this.client, status, options, cb)
  }

  getNotifications(cb) {
    getNotifications(this.client, cb);
  }

  dismissNotification(notification, cb) {
    dismissNotification(this.client, notification, cb);
  }
}

export default MastodonClient;
