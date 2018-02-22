const messageServer = require("./messageServer");
const chatProcessor = {};

const commands = {
  plan: () => {
    return new Promise((resolve, reject) => {
      resolve({ body: "Hmm. You don't need no stinkin' plan" });
    });
  },
  bear: () => {
    return new Promise(resolve => {
      resolve({
        body: "Bears are dope.",
        media: "https://placebear.com/200/300"
      });
    });
  },
  error: () => {
    return new Promise((resolve, reject) => {
      resolve({
        body:
          "Sorry, I don't understand. I am a pretty dumb robot. I understand the commands: " +
          commandList().join(", ")
      });
    });
  }
};

function commandList() {
  let cmds = [];
  for (var commandName in commands) {
    if (commandName !== "error") {
      cmds.push(commandName);
    }
  }

  return cmds;
}

chatProcessor.incoming = (phoneNumber, message) => {
  const command = message.trim().toLowerCase();
  if (commands.hasOwnProperty(command)) {
    return commands[command]();
  } else {
    return commands.error();
  }
};

module.exports = chatProcessor;
