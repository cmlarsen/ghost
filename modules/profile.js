// import admin from "firebase-admin";
var admin = require("firebase-admin");
const profile = {};

profile.saveAccessToken = (username, token) => {
  return admin
    .database()
    .ref("/access_token")
    .child(username)
    .set(token);
};

profile.savePhoneNumber = (username, phoneNumber) => {
  const savePhoneNumber = (username, phoneNumber) => {
    return admin
      .database()
      .ref("/users")
      .child(username)
      .child("phoneNumber")
      .set(phoneNumber);
  };

  return savePhoneNumber(username, phoneNumber);
};

profile.create = profile => {
  const checkForUser = username => {
    return admin
      .database()
      .ref("/users")
      .child(profile.username)
      .once("value")
      .then(snapshot => {
        if (snapshot.val()) {
          return true;
        } else {
          return false;
        }
      });
  };

  const createProfile = profile => {
    return admin
      .database()
      .ref("/users")
      .child(profile.username)
      .set(profile);
  };

  return new Promise((resolve, reject) => {
    checkForUser(profile.username).then(hasProfile => {
      if (hasProfile) {
        console.log("Profile Exists");
        reject(false);
      } else {
        console.log("Creating Profile!");

        return createProfile(profile);
      }
    });
  });
};

// export default { create };
module.exports = profile;
