'use strict';

/*
 * This is not a Mongoose Schema
 */
var TelegramProfileSchema = {
    telegramId: Number ,
    firstname: String ,
    lastname: String,
    username: String,
    sex: String,
    birth: String,
    birthCity: String,
    province: String,
    fiscalCode: String
};

module.exports = TelegramProfileSchema;