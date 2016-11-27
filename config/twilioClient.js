var client = require('twilio')('ACdb77e866bdb32278ab3f2a011b8e25be',
    '4a238899bc93d73cfa126880d18bd18b');

var sendingNumber = '+12268940445';

module.exports.sendSms = function(to, message) {
    return null;
    client.messages.create({
        body: message,
        to: to,
        from: sendingNumber
    }, function(err, data) {
        if (err) {
            console.error('Could not send message: ');
            console.error(err);
        } else {
            console.log('Administrator notified');
        }
    });
};