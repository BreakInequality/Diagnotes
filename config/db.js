/**
 * Created by jashan on 2016-11-26.
 */

var mongodb = require('mongodb');

var MongoClient = mongodb.MongoClient;

var dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/Diagnotes';

var init = function() {
    MongoClient.connect(dbUrl, function(error, db) {
        if (error) {
            console.log('Unable to connect to connect to database: ', error);
        } else {
            return db;
        }
    });
};


module.exports = {
    createConnection: init
};