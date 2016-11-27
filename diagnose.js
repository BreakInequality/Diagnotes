/**
 * Created by Jashan Shewakramani
 * Makes diagnosis
 */

var twilio = require('twilio');

var makeDiagnosis = function(body, db) {
    db.collection('patients').findOne({phone : body.From}, function(err, doc) {
        if (err) {
            console.log('Error while fetching number: ' + body.From);
        } else {
            if (doc == undefined) {
                console.err('Unexpected unfound doc: ' + body.From);
            } else {
                doc['diagnosis'] = body.Body;
                db.collection('patients').updateOne({_id: body.From}, {$set: {'symptoms': body.Body}});
            }
        }
    })
};

exports.getResponse = function(body, db, callback) {
    var twiml;
    if (body.Body === 'sign up') {
        return  callback(twilio.TwimlResponse().message('Sign up with your name, age and sex in this format:\n sign Jashan S, 17, M'));
    } else {
        db.collection('patients').findOne({'phone': body.From}, function(err, doc) {
            if (err) {
                twiml =  new twilio.TwimlResponse().message('There was an error; please try again later');
                callback(twiml);
            } else if (!doc){
                if (validateSignUp(body.Body)) {
                    signUp(body, db, callback);
                } else {
                    twiml = new twilio.TwimlResponse().message('Ensure you properly sign up before requesting a diagnosis');
                    callback(twiml);
                }
            } else {
                makeDiagnosis(body, db);
                twiml = new twilio.TwimlResponse().message('Your diagnosis is being processed. You will be contacted shortly');
                callback(twiml);
            }
        });
    }


};

var validateSignUp = function(text) {
    if (text.includes('sign')) {
        var updatedString = text.substr(5);
        var arr = updatedString.split(',');
        console.log('Validated on text: ' + text, arr.length == 3);
        return arr.length == 3;
    }
};

var signUp = function(body, db) {
    var details = body.Body.substr(4).split(',');
    var doc = {
        'phone': body.From,
        'name': details[0],
        'age': parseInt(details[1], 10),
        'sex': details[2]
    };

    db.collection('patients').insertOne(doc, function(err) {
        if (err) {
            console.log('Error inserting doc: ', err);
        } else {
            console.log('Made insertion: ' + doc);
        }
    });


    var twiml = new twilio.TwimlResponse('Thanks for signing up. You may now request diagnoses');
    callback(twiml);

};


var handleSymptoms = function(symptoms, callback) {
    var parsedSymptoms = symptoms.split(' ');
    for (var i = 0; i < parsedSymptoms.length; i++) {
        parsedSymptoms[i] = parsedSymptoms[i].replace(/ /g, '');
    }
    console.log('Parsed symptoms: ', parsedSymptoms);
};