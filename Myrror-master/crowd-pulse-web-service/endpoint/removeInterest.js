'use strict';

var router = require('express').Router();
var CrowdPulse = require('./../crowd-pulse-data');
var config = require('./../lib/config');
var qSend = require('../lib/expressQ').send;
var qErr = require('../lib/expressQ').error;
var databaseName = require('../crowd-pulse-data/databaseName');

exports.endpoint = function() {

    router.route('/remove').post(function(req,res){

        var dbConn = new CrowdPulse();

        var username = "";

        var preference = {
            email:req.body.username,
            value: req.body.value,
        };

        console.log(preference);

        return dbConn.connect(config.database.url, 'profiles')
            .then(function (conn) {
                return conn.Profile.findOne({email: preference.email},function (err,user){username = user.username})
                    .then(function (){

                        return dbConn.connect(config.database.url, username)

                            .then(function(){
                                return dbConn.connect(config.database.url,username)
                                    .then(function (conn) {

                                        //Rimozione interesse
                                        return conn.Interest.deleteMany(
                                            {value: preference.value} //controllo
                                        )
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