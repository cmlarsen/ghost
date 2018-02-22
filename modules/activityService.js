const strava = require("strava-v3");

const profile = require("./profile.js");
const activityService = {};

activityService.incoming = event => {
  if (event.object_type === "activity") {
    activityService.getActivity(event);
  }
};

activityService.getActivity = event => {
  const { owner_id, object_id } = event;
  profile.fetchByStravaId(owner_id).then(profile => {
    const { access_token } = profile;
    //need to get the users access token and pass it along here.
    console.log(owner_id, object_id, access_token);
    strava.activities.get(
      { id: object_id, access_token: access_token },
      function(err, payload, limits) {
        if (!err) {
          console.log("Activity:" + JSON.stringify(payload));
        } else {
          console.log(err);
        }
      }
    );
  });
};

module.exports = activityService;
