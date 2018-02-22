// import admin from "firebase-admin";
var admin = require("firebase-admin");
const profile = {};

profile.saveAccessToken = (username, token) => {
  return admin
    .database()
    .ref("/users")
    .child(username)
    .child("access_token")
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

profile.fetchByStravaId = strava_id => {
  return admin
    .database()
    .ref("/users")
    .orderByChild("id")
    .equalTo(strava_id)
    .once("value")
    .then(snapshot => {
      console.log("Profile", snapshot.val());
      return snapshot.val();
      // if (snapshot.val()) {

      //   return true;
      // } else {
      //   return false;
      // }
    });
};

profile.create = profile => {
  const checkForUser = username => {
    return admin
      .database()
      .ref("/users")
      .child(profile.username)
      .once("value")
      .then(snapshot => {
        if (snapshot.val().id) {
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
      .update(profile);
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
