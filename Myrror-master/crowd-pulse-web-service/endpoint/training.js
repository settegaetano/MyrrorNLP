'use strict';

var router = require('express').Router();
var CrowdPulse = require('./../crowd-pulse-data');
var config = require('./../lib/config');
var qSend = require('../lib/expressQ').send;
var qErr = require('../lib/expressQ').error;
var databaseName = require('../crowd-pulse-data/databaseName');

exports.endpoint = function() {

    router.route('/training').post(function(req,res){

        var dbConn = new CrowdPulse();

        var like;


        var preference = {
            email:req.body.username,
            genre: req.body.genre,
            like: req.body.like,
            timestamp: req.body.timestamp
        };

        console.log(preference.email);


        var username = "";
        return dbConn.connect(config.database.url, 'profiles')
            .then(function (conn) {
                return conn.Profile.findOne({email: preference.email},function (err,user){username = user.username})
                    .then(function (){

                        //Check like/dislike
                        if (preference.like == 1){
                            like = 'Like:';
                        }else {
                            like = 'Dislike:';
                        }

                        console.log(preference);

                        return dbConn.connect(config.database.url, username)

                            .then(function(){
                                return dbConn.connect(config.database.url,username)
                                    .then(function (conn) {

                                        return conn.Interest.update(
                                            {value: like + 'Training:' + preference.genre}, //controllo su training
                                            {
                                                value: like + 'Training:' + preference.genre,
                                                source: 'training_preference',
                                                confidence: 1,
                                                timestamp: preference.timestamp
                                            },
                                            {upsert: true})
                                            .then(qSend(res))
                                            .catch(qErr(res))


                                    }).finally(function() {
                                        dbConn.disconnect();
                                    });
                            })

                    })
            });


    });

    return router;
};