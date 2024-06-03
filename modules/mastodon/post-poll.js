import fetch from 'node-fetch';
const postPoll = async (client, status, options, cb) => {
  console.log("posting a poll...");

  let optionsObj = {
    status,
    poll: {
      options: options,
      expires_in: 86400,
    },
  };

  const response = await fetch(`${client.config.api_url}/statuses`, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + client.config.access_token,
    },
    body: JSON.stringify(optionsObj),
  });

  const responseData = await response.json();
  console.log("poll posted", responseData.url);

  if (cb) {
    cb(error, response, body);
  }

  return responseData;
};

export default postPoll;
