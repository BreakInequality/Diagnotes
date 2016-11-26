/**
 * Created by Jashan Shewakramani
 * Makes diagnosis
 */
exports.makeDiagnosis = function(phoneNumber, symptoms, db) {
  db.collection('patients')
      .insertOne({'phone': phoneNumber, 'symptoms': symptoms}, function(err) {
          if (err != null) {
              console.log('There was an error: ', err);
          }
  });

  handleSymptoms(symptoms);
};


var handleSymptoms = function(symptoms) {
    var parsedSymptoms = symptoms.split(' ');
    for (var i = 0; i < parsedSymptoms.length; i++) {
        parsedSymptoms[i] = parsedSymptoms[i].replace(/ /g, '');
    }

    
};