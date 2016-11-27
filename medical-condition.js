var request = require("request");
var _ = require("lodash");

var options = { method: 'GET',
  url: 'https://api.infermedica.com/v2/symptoms',
  headers: {
    app_key: '60419814a9f4a76540b3940de5da6384',
    app_id: 'dd20d4d6'
  }
};

var getAllSymptoms = function(callback) {
  var symptoms = [];

  request(options, function (error, response, body) {
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

var getSymptomIds = function(symptoms, userSymptoms) {
  userSymptoms = ["headache"];
  var symptomsArray = [];

  _.forEach(userSymptoms, function(userSymptom) {
    _.forEach(symptoms, function(symptom) {

      if(symptom.name.indexOf(userSymptom) !== -1) {
        symptomsArray.push(symptom.id);
        return false;
      }
    });
  });
  console.log(symptomsArray);
}

getAllSymptoms(function(symptoms) {
  getSymptomIds(symptoms);
});

module.exports = {
  getAllSymptoms: getAllSymptoms
};