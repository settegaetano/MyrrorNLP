'use strict';

var router = require('express').Router();
var CrowdPulse = require('./../crowd-pulse-data');
var config = require('./../lib/config');
var qSend = require('../lib/expressQ').send;
var qErr = require('../lib/expressQ').error;
var databaseName = require('../crowd-pulse-data/databaseName');

exports.endpoint = function() {

    router.route('/programmatv').post(function(req,res){

        var dbConn = new CrowdPulse();

        var like;


        var preference = {
            email:req.body.username,
            programmatv: req.body.programmatv,
            canale: req.body.canale,
            genere: req.body.genere,
            like: req.body.like,
            timestamp: new Date().getTime()
        };

        console.log(preference.email);


        var username = "";

        /*Valori boolean che hanno lo scopo di capire se ho le varie informazioni sui programmi tv
              per poi poter fare inferenze sui video. Si attivano solo se l'info associata ha confidence = 1*/
        var flagCanale = false;
        var flagGenere = false;
        var flagProgramma = false;

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

                        flagCanale = false;
                        flagGenere = false;
                        flagProgramma = false;

                        return dbConn.connect(config.database.url, username)

                            .then(function(){
                                return dbConn.connect(config.database.url,username)
                                    .then(function (conn) {

                                        if ((typeof preference.canale !== 'undefined') &&
                                            (typeof preference.canale !== 'null')) {//Ho il canale (canale 5, italia 1)

                                            flagCanale = true;

                                            return conn.Interest.update(
                                                {value: like + 'Canale:' + preference.canale, source:'tv_preference'}, //controllo su canale tv
                                                {
                                                    value: like + 'Canale:' + preference.canale,
                                                    source: 'tv_preference',
                                                    confidence: 1,
                                                    timestamp: preference.timestamp
                                                },
                                                {upsert: true})
                                                .then(qSend(res))
                                                .catch(qErr(res))

                                        } else if ((typeof preference.programmatv !== 'undefined') &&
                                            (typeof preference.programmatv !== 'null')) {//Ho il genere (fantastico, calcistico)

                                            flagProgramma = true;

                                            return conn.Interest.update(
                                                {value: like + preference.programmatv, source:'tv_preference'},
                                                {
                                                    value: like + preference.programmatv,
                                                    source: 'tv_preference',
                                                    confidence: 1,
                                                    timestamp: preference.timestamp
                                                },
                                                {upsert: true})
                                                .then(qSend(res))
                                                .catch(qErr(res))

                                        } else if ((typeof preference.genere !== 'undefined') &&
                                            (typeof preference.genere !== 'null')){//Ho il programma (don matteo, eredità)

                                            flagGenere = true;

                                            return conn.Interest.update(
                                                {value: like + 'Genre:' + preference.genere, source:'tv_preference'}, //controllo su genere
                                                {
                                                    value: like + 'Genre:' + preference.genere,
                                                    source: 'tv_preference',
                                                    confidence: 1,
                                                    timestamp: preference.timestamp
                                                },
                                                {upsert: true})
                                                //.then(qSend(res))
                                                .catch(qErr(res))
                                        }

                                    })

                                })

                            .then(function(){
                                return dbConn.connect(config.database.url,username)
                                    .then(function (conn) {

                                        console.log("Confidence canale: " + flagCanale);
                                        console.log("Confidence programma: " + flagProgramma);
                                        console.log("Confidence genere: " + flagGenere);

                                        //Aggiungo inferenze sulla confidence di altri domini
                                        if (flagGenere){

                                            return conn.Interest.update(
                                                {value: like + preference.genere, source:'video_preference'},
                                                {
                                                    value: like + preference.genere,
                                                    source: 'video_preference',
                                                    confidence: 0.5,
                                                    timestamp: preference.timestamp
                                                },
                                                {upsert: true})
                                                .then(qSend(res))
                                                .catch(qErr(res))

                                        }else if (flagProgramma){

                                            return conn.Interest.update(
                                                {value: like, source:'video_preference'},
                                                {
                                                    value: like + preference.programmatv,
                                                    source: 'video_preference',
                                                    confidence: 0.5,
                                                    timestamp: preference.timestamp
                                                },
                                                {upsert: true})
                                                .then(qSend(res))
                                                .catch(qErr(res))

                                        } else if (flagCanale){

                                            return conn.Interest.update(
                                                {value: like + preference.canale, source:'video_preference'},
                                                {
                                                    value: like + preference.canale,
                                                    source: 'video_preference',
                                                    confidence: 0.5,
                                                    timestamp: preference.timestamp
                                                },
                                                {upsert: true})
                                                .then(qSend(res))
                                                .catch(qErr(res))
                                        }




                                    }).finally(function() {
                                        dbConn.disconnect();
                                    });
                            })

                    })
            });


    });

    return router;
};