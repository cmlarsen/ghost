const accountSid = "ACa3138e698f8d3b3589c931a545f35e4e"; // Your Account SID from www.twilio.com/console
const authToken = "4cf86fb1b7765d5b24b161f6629250a1"; // Your Auth Token from www.twilio.com/console
const twilio = require("twilio");
const client = new twilio(accountSid, authToken);

const messageServer = {};

messageServer.send = (phoneNumber, messageBody) => {
  return client.messages.create({
    body: messageBody,
    to: "+1" + phoneNumber, // Text this number
    from: "+12692206460" // From a valid Twilio number
  });
  //.then(message => console.log(message.sid));
};

module.exports = messageServer;
