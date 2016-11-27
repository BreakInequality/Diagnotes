/**
 * Created by Jashan Shewakramani
 * Makes diagnosis
 */

var twilio = require('twilio');

var makeDiagnosis = function(body, db) {
    db.findOne({_id: body.From}, function(err, doc) {
        if (err) {
            console.log('Error while fetching number: ' + body.From);
        } else {
            if (doc == undefined) {
                console.err('Unexpected unfound doc: ' + body.From);
            } else {
                doc['diagnosis'] = body.Body;
                db.updateOne({_id: body.From}, {$set: {'symptoms': body.Body}});
            }
        }
    })
};

exports.getResponse = function(body, db) {
    if (body.Body === 'sign up') {
        return new twilio.TwimlResponse().message('Sign up with your name, age and sex in this format:\n sign Jashan S, 17, M');
    } else {
        db.collection('patients').findOne({'phone': body.From}, function(err, doc) {
            if (err) {
                return new twilio.TwimlResponse().message('There was an error; please try again later');
            } else if (!doc){
                if (validateSignUp(body.Body)) {
                    signUp(body, db);
                    return new twilio.TwimlResponse('Thanks for signing up. You may now request diagnoses');
                }
                return new twilio.TwimlResponse().message('Ensure you properly sign up before requesting a diagnosis');
            } else {
                makeDiagnosis(body, db);
                return new twilio.TwimlResponse().message('Your diagnosis is being processed. You will be contacted shortly');
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
        '_id': body.From,
        'name': details[0],
        'age': parseInt(details[1], 10),
        'sex': details[2]
    };

    db.insertOne(doc, function(err) {
        if (err) {
            console.log('Error inserting doc: ', err);
        }
    })

};


var handleSymptoms = function(symptoms) {
    var parsedSymptoms = symptoms.split(' ');
    for (var i = 0; i < parsedSymptoms.length; i++) {
        parsedSymptoms[i] = parsedSymptoms[i].replace(/ /g, '');
    }
    console.log('Parsed symptoms: ', parsedSymptoms);


};