const messageServer = require("./messageServer");
const chatProcessor = {};

const command_list = ["help", "plan"];

const commands = {
  help: () => {
    return new Promise((resolve, reject) => {
      resolve("I understand the commands: " + command_list.join(", "));
    });
  },
  plan: () => {
    return new Promise((resolve, reject) => {
      resolve("You don't need no stinkin' plan");
    });
  },
  error: () => {
    return new Promise((resolve, reject) => {
      resolve(
        "Sorry, I don't understand. I am a pretty dumb robot. I understand the commands: " +
          command_list.join(", ")
      );
    });
  }
};

chatProcessor.incoming = (phoneNumber, message) => {
  if (command_list.indexOf(message.toLowercase()) > -1) {
    return commands[message.toLowercase()]();
  } else {
    return commands.error();
  }
};

module.exports = chatProcessor;
