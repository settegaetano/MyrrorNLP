'use strict';

var router = require('express').Router();
var CrowdPulse = require('./../crowd-pulse-data');
var config = require('./../lib/config');
var qSend = require('../lib/expressQ').send;
var qErr = require('../lib/expressQ').error;
var databaseName = require('../crowd-pulse-data/databaseName');

//const DB_MUSIC = "musicPreference";
//const musicPreference = require('./../crowd-pulse-data/model/musicPreference');

exports.endpoint = function() {

    router.route('/music').post(function(req,res){
      
            var dbConn = new CrowdPulse();

            var like;
            var confidence = {
                genre : 0,
                artist:0,
                song:0
            };

            var preference = {
                email:req.body.username,
                song:req.body.song,
                artist: req.body.artist,
                genre: req.body.genre,
                like: req.body.like,
                timestamp: new Date().getTime()
            };

            //console.log(preference.email);


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
                                .then(function (conn) {

                                    //Se abbiamo il genere
                                    if ((typeof preference.genre !== 'undefined') && (typeof preference.genre !== 'null')) {

                                        if (preference.artist !== 'null' && preference.song !== 'null') { //abbiamo artista e canzone
                                            confidence.genre = 0.5; //se ho artista e canzone, il genere l'ho ricavato
                                        } else {
                                            confidence.genre = 1;//genere scritto esplicitamente dall'utente
                                        }

                                        return conn.Interest.update(
                                            {value: like + 'Genre:' + preference.genre}, //controllo su genre
                                            {
                                                value: like + 'Genre:' + preference.genre,
                                                source: 'music_preference',
                                                confidence: confidence.genre,
                                                timestamp: preference.timestamp
                                            },
                                            {upsert: true})
                                            .then(qSend(res))
                                            .catch(qErr(res))
                                    }

                                })
                                .then(function () {
                                    return dbConn.connect(config.database.url, username)
                                    .then(function (conn) {

                                        //Se ho la canzone
                                        if ((typeof preference.song !== 'undefined') && (typeof preference.song !== 'null')) {
                                            confidence.song = 1;//canzone scritta esplicitamente dall'utente

                                            return conn.Interest.update(
                                                {value: like + 'Song:' + preference.song}, //controllo su song
                                                {
                                                    value: like + 'Song:' + preference.song,
                                                    source: 'music_preference',
                                                    confidence: confidence.song,
                                                    timestamp: preference.timestamp
                                                },
                                                {upsert: true})
                                                .catch(qErr(res))
                                        }
                                    })
                                })
                                .then(function(){
                                    return dbConn.connect(config.database.url,username)
                                    .then(function (conn) {

                                        //Se abbiamo l'artista
                                        if ((typeof preference.artist !== 'undefined') && (typeof preference.artist !== 'null')) {
                                            if (preference.song !== 'null') { //ho la canzone
                                                confidence.artist = 0.7;//artista ricavato
                                            } else {
                                                confidence.artist = 1;//artista esplicitamente scritto
                                            }

                                            return conn.Interest.update(
                                                {value: like + 'Artist:' + preference.artist}, //controllo su artist
                                                {
                                                    value: like + 'Artist:' + preference.artist,
                                                    source: 'music_preference',
                                                    confidence: confidence.artist,
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