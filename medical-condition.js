var request = require("request");
var _ = require("lodash");

var symptomsJSON = { method: 'GET',
url: 'https://api.infermedica.com/v2/symptoms',
headers: {
  app_key: '60419814a9f4a76540b3940de5da6384',
  app_id: 'dd20d4d6'
}
};

var diagnosisJSON = function(ids, sex, age) {
  var evidences = _.map(ids, function(id) {
    return { "id": id, "choice_id": "present" };
  });
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
    evidence: evidences
  }
};
};

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

var getConditionInfo = function (userSymptoms, sex, age, callback){
  getAllSymptoms(function(symptoms) {
    getSymptomIds(symptoms, userSymptoms, function(symptomsArray) {
      request(diagnosisJSON(symptomsArray, sex, age), function(error, response, body) {
        if (error) throw new Error(error);
        console.log('Response body:', body);
        var condition_info = [body.conditions[0].name, body.conditions[0].probability];
        if (typeof callback === 'function') {
          callback(condition_info);
        } else {
          throw new Error("ERROR CALLBACK FUNCTION");
        }
      });
    });
  });
};

var conditionJSON = function(condition_name){
  return { method: 'GET',
  url: 'https://www.googleapis.com/customsearch/v1',
  headers: {
    app_key: '60419814a9f4a76540b3940de5da6384',
    app_id: 'dd20d4d6'
  },
  qs: {
    q: condition_name,
    key: 'AIzaSyAc6EV38LteoRe5xqzFMnoQcc6PsleVs2o',
    cx: '018047257308793356501:z9lzppcxrme'
  }
};
};

var getConditionURL = function(condition_name, callback) {
  request(conditionJSON(condition_name), function(error, response, body) {
    var condition_url = JSON.parse(body).items[0].link;
    if (typeof callback === 'function') {
      callback(condition_url);
    } else {
      throw new Error("ERROR CALLBACK FUNCTION");
    }
  });
};

module.exports = {
  getConditionURL: getConditionURL,
  getConditionInfo: getConditionInfo
};
