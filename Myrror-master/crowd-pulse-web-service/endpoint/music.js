'use strict';

var router = require('express').Router();
var CrowdPulse = require('./../crowd-pulse-data');
var config = require('./../lib/config');
var qSend = require('../lib/expressQ').send;
var qErr = require('../lib/expressQ').error;

const DB_MUSIC = "musicPreference";

//const musicPreference = require('./../crowd-pulse-data/model/musicPreference');

exports.endpoint = function() {

    router.route('/music').post(function(req,res){
        try{
            var dbConn = new CrowdPulse();
            var preference = {
                username:req.body.username,
                song:req.body.song,
                artist: req.body.artist,
                genre: req.body.genre,
                like: req.body.like,
                timestamp: req.body.timestamp
            };

            //console.log(preference)

            return dbConn.connect(config.database.url, DB_MUSIC)
                .then(function (conn) {
                    return conn.MusicPreference.newFromObject(preference).save().then(
                        function () {
                            console.log('Preferenza inserita correttamente')
                            dbConn.disconnect();
                        });
                });

        }catch(err){
            console.log(err);
        }
    });

    return router;
};

/**
   * Gets the user timeline.
   * Params:
   *    messages - the number of messages to retrieve
   
  router.route('/twitter/user_timeline')
    .post(function (req, res) {
      try {
        var messagesToRead = req.body.messages;

        // if the client do not specify a messages to read number then update the user messages
        if (!messagesToRead) {
          updateTweets(req.session.username).then(function () {
            res.status(200);
            res.json({auth: true});
          });
        } else {

          // return the messages
          var dbConnection = new CrowdPulse();
          return dbConnection.connect(config.database.url, req.session.username).then(function (conn) {
            return conn.Message.find({source: /twitter_./}).sort({date: -1}).limit(messagesToRead);
          }).then(function (messages) {
            dbConnection.disconnect();
            res.status(200);
            res.json({auth: true, messages: messages});
          });
        }
      } catch(err) {
        console.log(err);
        res.sendStatus(500);
      }
    });
*/