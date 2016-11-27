var request = require("request");
var _ = require("lodash");

var symptomsJSON = { method: 'GET',
  url: 'https://api.infermedica.com/v2/symptoms',
  headers: {
    app_key: '60419814a9f4a76540b3940de5da6384',
    app_id: 'dd20d4d6'
  }
};

var diagnosisJSON = function(id, sex, age) {
  return { method: 'POST',
    url: 'https://api.infermedica.com/v2/diagnosis',
    headers: {
      app_key: '60419814a9f4a76540b3940de5da6384',
      app_id: 'dd20d4d6',
      "content-type": "application/json"
    },
    json: {
      sex: sex,
      age: age,
      evidence: [ { "id": id, "choice_id": "present" } ]
    }
  };
}


var getAllSymptoms = function(callback) {
  var symptoms = [];

  request(symptomsJSON, function (error, response, body) {
    if (error) throw new Error(error);
    symptoms = _.map(JSON.parse(body), function(symptom) {
      return {"id": symptom.id, "name":symptom.name};
    });
    // return symptoms;
    if(typeof callback === 'function') {
      callback(symptoms);
    } else {
      throw new Error("ERROR CALLBACK FUNCTION");
    }
  });
};

var getSymptomIds = function(symptoms, userSymptoms, callback) {
  userSymptoms = ["headache"];
  var symptomsArray = [];

  _.forEach(userSymptoms, function(userSymptom) {
    _.forEach(symptoms, function(symptom) {
      if(symptom.name.toUpperCase().indexOf(userSymptom.toUpperCase()) !== -1) {
        symptomsArray.push(symptom.id);
        return false;
      }
    });
  });
  if(typeof callback === 'function') {
    callback(symptomsArray);
  } else {
    throw new Error("ERROR CALLBACK FUNCTION");
  }
};

getAllSymptoms(function(symptoms, userSymptoms) {
  getSymptomIds(symptoms, userSymptoms, function(symptomsArray) {
      request(diagnosisJSON(symptomsArray[0], "male", "29"), function(error, response, body) {
        if (error) throw new Error(error);
        console.log(body.conditions[0].name);
      });
  });
});

module.exports = {
  getAllSymptoms: getAllSymptoms
};