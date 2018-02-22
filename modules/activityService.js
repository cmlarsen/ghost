const strava = require("strava-v3");

const profile = require("./profile.js");
const messageServer = require("./messageServer.js");
const activityService = {};

activityService.incoming = event => {
  if (event.object_type === "activity") {
    activityService.getActivity(event);
  }
};

activityService.getActivity = event => {
  const { owner_id, object_id } = event;
  profile.fetchByStravaId(owner_id).then(profile => {
    const { access_token, phoneNumber, firstname } = profile;
    //need to get the users access token and pass it along here.
    console.log(owner_id, object_id, access_token);
    strava.activities.get(
      { id: object_id, access_token: access_token },
      function(err, payload, limits) {
        if (!err) {
          console.log("Activity:" + JSON.stringify(payload));
          var miles = Math.round(payload.distance*0.000621371*100, 3)/100
          var message = "Nice Job "+firstname:+". You Ran " + miles + " miles";
          messageServer.send(phoneNumber, message)
        } else {
          console.log(err);
        }
      }
    );
  });
};

module.exports = activityService;
