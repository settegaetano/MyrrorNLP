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

            /*Valori boolean che hanno lo scopo di capire se ho le varie informazioni sulla musica
              per poi poter fare inferenze sui video. Si attivano solo se l'info associata ha confidence = 1*/
            var flagArtista = false;
            var flagGenere = false;
            var flagSong = false;
            var flagArtistaRicavato = false;

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


                            flagArtista = false;
                            flagGenere = false;
                            flagSong = false;
                            flagArtistaRicavato = false;

                            return dbConn.connect(config.database.url, username)
                                .then(function (conn) {

                                    //Se abbiamo il genere
                                    if ((typeof preference.genre !== 'undefined') && (typeof preference.genre !== 'null')) {

                                        preference.genre = preference.genre.toLowerCase();

                                        if ((typeof preference.artist !== 'null') && (typeof preference.artist !== 'undefined') &&
                                            (typeof preference.song !== 'null') && (typeof preference.song !== 'undefined')) { //abbiamo artista e canzone
                                            confidence.genre = 0.5; //se ho artista e canzone, il genere l'ho ricavato

                                            preference.artist = preference.artist.toLowerCase();
                                            preference.song = preference.song.toLowerCase();


                                            //Info utili per fare inferenza
                                            flagArtista = true;
                                            flagSong = true;
                                        } else {
                                            confidence.genre = 1;//genere scritto esplicitamente dall'utente

                                            //Info utili per fare inferenza
                                            flagGenere = true;
                                        }

                                        return conn.Interest.update(
                                            {value: like + 'Genre:' + preference.genre, source:'music_preference'}, //controllo su genre
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

                                            preference.song = preference.song.toLowerCase();

                                            //Info utili per fare inferenza
                                            flagSong = true;

                                            return conn.Interest.update(
                                                {value: like + 'Song:' + preference.song, source:'music_preference'}, //controllo su song
                                                {
                                                    value: like + 'Song:' + preference.song,
                                                    source: 'music_preference',
                                                    confidence: confidence.song,
                                                    timestamp: preference.timestamp
                                                },
                                                {upsert: true})
                                                .catch(qErr(res))
                                        }
                                    }).finally(function() {
                                            dbConn.disconnect();
                                        });
                                })
                                .then(function () {
                                    return dbConn.connect(config.database.url, username)
                                        .then(function (conn) {

                                            //Se abbiamo l'artista
                                            if ((typeof preference.artist !== 'undefined') && (typeof preference.artist !== 'null')) {
                                                preference.artist = preference.artist.toLowerCase();

                                                if ((typeof preference.song !== 'undefined') && (typeof preference.song !== 'null')) { //ho la canzone
                                                    confidence.artist = 0.7;//artista ricavato

                                                    preference.song = preference.song.toLowerCase();

                                                    //Info utili per fare inferenza
                                                    flagSong = true;
                                                    flagArtistaRicavato = true;

                                                } else {
                                                    confidence.artist = 1;//artista esplicitamente scritto

                                                    //Info utili per fare inferenza
                                                    flagArtista = true;
                                                }

                                                return conn.Interest.update(
                                                    {value: like + 'Artist:' + preference.artist, source:'music_preference'}, //controllo su artist
                                                    {
                                                        value: like + 'Artist:' + preference.artist,
                                                        source: 'music_preference',
                                                        confidence: confidence.artist,
                                                        timestamp: preference.timestamp
                                                    },
                                                    {upsert: true})
                                                    //.then(qSend(res))
                                                    .catch(qErr(res))
                                            }

                                        }).finally(function() {
                                            dbConn.disconnect();
                                        });
                                })
                                .then(function () {
                                    console.log('165');
                                    return dbConn.connect(config.database.url, username)
                                        .then(function (conn) {

                                            /*
                                            Inferenza sulle news
                                            Se Artista è ricavato allora la confidence per le news sull'artista è 0.35
                                            Se Artista non è ricavato allora la confidence per le news è 0.50
                                             */
                                            var confidence;
                                            if (flagArtistaRicavato){ //Artista ricavato
                                                confidence = 0.35;

                                            }else if (flagArtista){//Artista non ricavato
                                                confidence = 0.56
                                            }
                                            console.log('181');
                                            return conn.Interest.update(
                                                {value: like + preference.artist, source:'news_preference'},//controllo esistenza
                                                {
                                                    value: like + preference.artist,
                                                    source: 'news_preference',
                                                    confidence: confidence,
                                                    timestamp: preference.timestamp
                                                },
                                                {upsert: true})
                                                //.then(qSend(res))
                                                .catch(qErr(res))


                                        }).finally(function() {
                                            console.log('196');
                                            dbConn.disconnect();
                                        });
                                })
                                .then(function () {
                                    return dbConn.connect(config.database.url, username)
                                        .then(function (conn) {

                                            /*
                                            Il controllo della song viene fatto sepratamente in modo da poter gestire il caso in cui ho
                                            sia la song che l'artist con confidence pari ad 1 e quindi devo inserire l'inferenza per entrambi
                                             */
                                            if (flagSong){
                                                return conn.Interest.update(
                                                    {value: like + preference.song, source:'video_preference'},
                                                    {
                                                        value: like + preference.song,
                                                        source: 'video_preference',
                                                        confidence: 0.5,
                                                        timestamp: preference.timestamp
                                                    },
                                                    {upsert: true})
                                                    //.then(qSend(res))
                                                    .catch(qErr(res))
                                            }

                                        }).finally(function() {
                                            dbConn.disconnect();
                                        });
                                })
                                .then(function(){
                                    return dbConn.connect(config.database.url,username)
                                    .then(function (conn) {

                                        console.log("Confidence artist: " + flagArtista);
                                        console.log("Confidence song: " + flagSong);
                                        console.log("Confidence genre: " + flagGenere);

                                        //Aggiungo inferenze sulla confidence di altri domini
                                        if (flagGenere){

                                            return conn.Interest.update(
                                                {value: like + preference.genre, source:'video_preference'},
                                                {
                                                    value: like + preference.genre,
                                                    source: 'video_preference',
                                                    confidence: 0.5,
                                                    timestamp: preference.timestamp
                                                },
                                                {upsert: true})
                                                .then(qSend(res))
                                                .catch(qErr(res))

                                        }else if (flagArtista){

                                            return conn.Interest.update(
                                                {value: like + preference.artist, source:'video_preference'},
                                                {
                                                    value: like + preference.artist,
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


    router.route('/musicfeed').post(function(req,res){

        var dbConn = new CrowdPulse();

        var like;


        var preference = {
            email:req.body.email,
            artista: req.body.artista,
            like: req.body.like,
            timestamp: new Date().getTime()
        };

        console.log(preference.artista);

        //Check like/dislike
        if (preference.like == 1){
            like = 'Like:';
        }else {
            like = 'Dislike:';
        }

        if (preference.artista){
            var username = "";
            return dbConn.connect(config.database.url, 'profiles')
                .then(function (conn) {
                    return conn.Profile.findOne({email: preference.email},function (err,user){username = user.username})
                        .then(function (){

                            return dbConn.connect(config.database.url, username)

                                .then(function(){
                                    return dbConn.connect(config.database.url,username)
                                        .then(function (conn) {

                                            return conn.Interest.update(
                                                {value: like + preference.artista,
                                                    source: 'music_feedback'}, //controllo su training
                                                {
                                                    value: like + preference.artista,
                                                    source: 'music_feedback',
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
        }



    });

    return router;
};