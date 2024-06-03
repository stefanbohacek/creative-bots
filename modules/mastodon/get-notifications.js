const getNotifications = async (client, cb) => {
  console.log("retrieving notifications...");
  client.get("notifications", (err, notifications) => {
    if (cb) {
      cb(err, notifications);
    }
  });

};

export default getNotifications;
