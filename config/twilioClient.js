var client = require('twilio')('AC92887f51ca4f5a18aa7fb6c32a744a98',
    '754413a358b9dd6be22357f7fd2aac34');

var sendingNumber = '+12268940259';

module.exports.sendSms = function(to, message) {
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