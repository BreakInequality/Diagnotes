/**
 * Created by Jashan Shewakramani
 * Makes diagnosis
 */

var twilio = require('twilio');

var makeDiagnosis = function(body, db) {
    db.collection('patients').updateOne({phone: body.From}, {$set: {symptoms: body.Body}});

    var symptoms = parseSymptoms(body.Body);

    db.collection('patients').findOne({'phone': body.From}).toArray(function(err, doc) {
        if (err) {
            console.log(err);
        } else {
            var age = doc.age.toString();
            var sex = doc.sex;
            if (sex.toLowerCase() == 'm')
                sex = 'male';
            else
                sex = 'female';

            require('./medical-condition').getConditionInfo(symptoms, sex, age, function(condInfo) {
                var diseaseName = condInfo[0];
                var prob = parseFloat(condInfo[1]);

                var diseaseObj = {
                    "disease": diseaseName,
                    "probability": prob
                };

                db.collection('patients').updateOne({phone: body.From}, {$set: {diagnosis: diseaseObj}});
            });
        }
    });

};

exports.getResponse = function(body, db, callback) {
    var twiml;
    if (body.Body.toLowerCase().trim() === 'sign up') {
        return  callback(twilio.TwimlResponse().message('Sign up with your name, age and sex in this format:\n sign Jashan S, 17, M'));
    } else {
        db.collection('patients').findOne({'phone': body.From}, function(err, doc) {
            if (err) {
                twiml =  new twilio.TwimlResponse().message('There was an error; please try again later');
                callback(twiml);
            } else if (!doc){
                if (validateSignUp(body.Body)) {
                    twiml = new twilio.TwimlResponse().message('Thanks for signing up. You may now request diagnoses');
                    callback(twiml);
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
    if (text.toLowerCase().includes('sign')) {
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

};


var parseSymptoms = function(symptoms) {
    var parsedSymptoms = symptoms.split(',');
    for (var i = 0; i < parsedSymptoms.length; i++) {
        parsedSymptoms[i] = parsedSymptoms[i].replace(/ /g, '');
    }
    console.log('Parsed symptoms: ', parsedSymptoms);
};