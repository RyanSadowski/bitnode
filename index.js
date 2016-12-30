var express = require('express');
var router = express.Router();
var app = express();
var request = require("request");
var bitcoin = require('bitcoinjs-lib');
var crypto = require('crypto');
var readline = require('readline');
var events = require('events');
var mongoose = require('mongoose');
var btmodel = require('./btmodel.js');
var crypt = require('./crypt.js');
var btc = require('./btc.js');
var collect = require('./collectfunds.js');
var eventEmitter = new events.EventEmitter();
var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var welcome = JSON.stringify("15fe2c4cdd8fad04987736da4c6d7db1656a9b"); //welcome to bitnode

var port = process.env.PORT || 3000;
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

Init();

function Init(){                                    //correct password is `m`
  hidden("password : ", function(password) {
      console.log("Your password : " + password);
      pass = password;
      Started();
  });
}

function Started(){
  console.log(crypt.decrypt(JSON.parse(welcome)));

  app.listen(port, function(){
      console.log('Making magic on port ' + port);
  });

  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost/bitNode')
  	.then(() => console.log('connection to db established'))
  	.catch((err) => console.error(err));

  collect.Start();

  router.get('/', function(req, res) {
      res.json({ BTC_Address: btc.GenerateKeys() });
  });

  router.post('/:pubAddress', function(req, res, next) {
      var addressFromUrl = req.params.pubAddress;
      console.log(addressFromUrl);

//19EP8R2HoRMPxgYWBspJX3UXu2apDxZabg

      btmodel.update({pubAddress: addressFromUrl}, {
            verified: 'true'
    }, function(err, numberAffected, rawResponse) {
       //handle it
    })
    res.json({ verified: 'true' });
      });

  app.use('/api', router);
}

function hidden(query, callback) {
    var stdin = process.openStdin(),
        i = 0;
    process.stdin.on("data", function(char) {
        char = char + "";
        switch (char) {
            case "\n":
            case "\r":
            case "\u0004":
                stdin.pause();
                break;
            default:
                process.stdout.write("\033[2K\033[200D"+query+"["+((i%2==1)?":)":":D")+"]");
                i++;
                break;
        }
    });

    rl.question(query, function(value) {
        rl.history = rl.history.slice(1);
        callback(value);
    });
}

module.exports = app;
