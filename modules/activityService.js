const activityService = {};

activityService.incoming = event => {
  if (event.object_type === "activity") {
    activityService.getActivity(event.object_id);
  }
};

activityService.getActivity = id => {
  strava.activities.get({ id }, function(err, payload, limits) {
    if (!err) {
      console.log("Activity:" + payload);
    } else {
      console.log(err);
    }
  });
};

module.exports = activityService;
