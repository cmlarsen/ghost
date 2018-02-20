var express = require("express");
// import express from "express";
var router = express.Router();
const csv = require("csvtojson");
const axios = require("axios");
const strava = require("strava-v3");
var admin = require("firebase-admin");

const chatProcessor = require("../modules/chatProcessor");
const messageServer = require("../modules/messageServer");
const profile = require("../modules/profile");
// import { create } from "../modules/profile";
// import { createProfile } from "../modules/profile";
var serviceAccount = require("../data/firebasekey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tada-training-plan.firebaseio.com"
});

/* GET api listing. */
router.get("/", function(request, response, next) {
  profile
    .create({ username: "tugboat" })
    .then(() => {
      console.log("Sweet, created profile");
    })
    .catch(() => {
      console.log("Bummer, didn't create");
    });
  response.send("Hi There");
});

router.post("/phoneNumber", (request, response, next) => {
  const phoneNumber = request.body.phoneNumber;
  const username = request.body.username;
  console.log(">>>", request.body, request.params, request.body);
  profile
    .savePhoneNumber(username, phoneNumber)
    .then(() => {
      response.status(200).send("saved phone number");
    })
    .catch(error => {
      response.status(500).send("Something went wrong" + error);
    });
});

router.get("/strava-auth", (request, response, next) => {
  const url = strava.oauth.getRequestAccessURL({});
  response.redirect(url);
});

router.get("/token_exchange", (request, response, next) => {
  console.log("request", request.query.code);
  const code = request.query.code;
  strava.oauth.getToken(code, (error, payload, limits) => {
    console.log("Tada", error, payload, limits, profile);

    const access_token = payload.access_token; //tada.  now we can save this in Firebase and use it for all of our requests.
    profile.saveAccessToken(payload.athlete.username, access_token);
    profile.create(payload.athlete);
    // response.send(payload.athlete);
    response.render("phone-collect", { username: payload.athlete.username });
  });
});

router.get("/activities", function(request, response, next) {
  strava.athlete.listActivities({}, function(err, payload, limits) {
    if (!err) {
      console.log(payload);
      response.send(payload);
    } else {
      console.log(err);
    }
  });
});

router.post("/csv", function(request, response, next) {
  //Publish to Web address of Google Sheet
  // const spreadsheet_path =
  // "https://docs.google.com/spreadsheets/d/e/2PACX-1vRA7vVpy2eKs4RpMSFnXVkQ3CxjmOW0tDESdXsbTLuaO1o90nNI_EOmx4rvM-E92pLiSrAXV_HzeVQr/pub?output=csv";
  const spreadsheet_path = request.body.spreadsheet_path.trim();
  const username = request.body.username;

  const preprocess = res => {
    return new Promise((resolve, reject) => {
      if (res.data) {
        resolve(res.data.toLowerCase());
      } else {
        reject("No csv found");
      }
    });
  };
  const parseCsv = csvString => {
    const json = {};
    return new Promise((resolve, reject) => {
      csv({ noheader: false })
        .fromString(csvString)
        .on("json", (jsonObj, row) => {
          json["day_" + row] = jsonObj;
        })
        //TODO: When done send response and post to Firebase
        .on("done", () => {
          resolve(json);
        })
        .on("error", err => {
          console.error("Error parsing CSV", error);
          reject(error);
        });
    });
  };
  const saveToFirebase = data => {
    return admin
      .database()
      .ref("/plans")
      .child(username)
      .set(data);
  };

  axios
    .get(spreadsheet_path)
    .then(preprocess)
    .then(parseCsv)
    .then(saveToFirebase)
    .then(json => {
      console.log("Done", json);
      response.send(json);
    })
    .catch(error => {
      console.error("Error", error);
      response.status(500).send(error);
    });
});

router.post("/twilio", (request, response, done) => {
  console.log("Twilio Request", request.query, request.body, request.params);
  var phoneNumber = request.body.From;
  var message = request.body.Body;
  chatProcessor
    .incoming(phoneNumber, message)
    .then(message => {
      response.status(200).send("My Sweet Response");
    })
    .catch(error => {
      console.error(error);
      response.status(500).send(error);
    });
});

router.get("/sendMessage", (request, response, done) => {
  console.log("/sendMessage", request.query, request.body, request.params);
  const phoneNumber = request.query.phoneNumber;
  messageServer
    .send("9062316978", "Hi There")
    .then(message => {
      console.log("message", message, request.query);

      response.send(message);
    })
    .catch(error => {
      console.error(error);
      response.status(500).send(error);
    });
});

// export default router;
module.exports = router;
