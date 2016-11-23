var crypto = require('crypto');

var algorithm = 'aes-256-ctr';

function encrypt(text) {
  var cipher = crypto.createCipher(algorithm,pass)
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}

function decrypt(text) {
  var decipher = crypto.createDecipher(algorithm,pass)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}

module.exports.encrypt = encrypt;
module.exports.decrypt = decrypt;
