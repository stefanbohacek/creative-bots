const dismissNotification = async (client, notification, cb) => {
  console.log("clearing notifications...");

  client
    .post("notifications/dismiss", {
      id: notification.id,
    })
    .then((err, data, response) => {
      if (cb) {
        cb(err, data);
      }
    })
    .catch((err) => {
      console.log("mastodon.dismissNotification error:", err);
    });
};

export default dismissNotification;
