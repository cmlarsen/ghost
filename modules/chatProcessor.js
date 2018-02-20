const messageServer = require("./messageServer");
const chatProcessor = {};

const command_list = ["HELP", "PLAN"];

chatProcessor.incoming = (phoneNumber, message) => {
  if (command_list.indexOf(message.toUppercase()) > -1) {
    chatProcessor[message.toLowercase()](phoneNumber);
  } else {
    chatProcessor.error(phoneNumber);
  }
};

chatProcessor.help = phoneNumber => {
  //todo: lookup user's via phonenumber
  messageServer.send(
    phoneNumber,
    "I understand the commands: " + command_list.join(", ")
  );
};

chatProcessor.plan = phoneNumber => {
  //todo: lookup user's via phonenumber
  messageServer.send(phoneNumber, "Plan? We don't need no stinkin' plan.");
};

chatProcessor.error = phoneNumber => {
  //todo: lookup user's via phonenumber
  messageServer.send(
    phoneNumber,
    "I'm sorry. I don't understand. I understand the commands: " +
      command_list.join(", ")
  );
};

module.exports = chatProcessor;
