'use strict';

var router = require('express').Router();
var CrowdPulse = require('./../crowd-pulse-data');
var config = require('./../lib/config');
var qSend = require('../lib/expressQ').send;
var qErr = require('../lib/expressQ').error;
var databaseName = require('../crowd-pulse-data/databaseName');


exports.endpoint = function() {

    router.route('/news').post(function(req,res){

        var dbConn = new CrowdPulse();

        var like;


        var preference = {
            email:req.body.email,
            topic: req.body.topic,
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

                        

                        return dbConn.connect(config.database.url, username)

                            .then(function(){
                                return dbConn.connect(config.database.url,username)
                                    .then(function (conn) {


                                        return conn.Interest.update(
                                            {value: like + 'Topic:' + preference.topic}, //controllo su training
                                            {
                                                value: like + 'Topic:' + preference.topic,
                                                source: 'news_preference',
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