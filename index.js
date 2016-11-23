var express = require('express');
var app = express();
var request = require("request");
var bitcoin = require('bitcoinjs-lib');
var crypto = require('crypto');
var readline = require('readline');
var events = require('events');
var mongoose = require('mongoose');
var btmodel = require('./btmodel.js');
var eventEmitter = new events.EventEmitter();

var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

Init();

var algorithm = 'aes-256-ctr';
var welcome = JSON.stringify("15fe2c4cdd8fad04987736da4c6d7db1656a9b");
                   //welcome to bitnode


function Init(){                                    //correct password is `m`
  hidden("password : ", function(password) {
      console.log("Your password : " + password);
      pass = password;
      Started();
  });
}

function Started(){
  console.log(decrypt(JSON.parse(welcome)));
  mongoose.Promise = global.Promise;
  mongoose.connect('mongodb://localhost/bitNode')
  	.then(() => console.log('connection to db established'))
  	.catch((err) => console.error(err));
  GenerateKeys();
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
                process.stdout.write("\033[2K\033[200D"+query+"["+((i%2==1)?"8w=D":"8=wD")+"]");
                i++;
                break;
        }
    });

    rl.question(query, function(value) {
        rl.history = rl.history.slice(1);
        callback(value);
    });
}

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

function GenerateKeys() {
var keyPair = bitcoin.ECPair.makeRandom();                      // Create a key pair, private & public
var privateWif = encrypt(keyPair.toWIF());                      // Saves the private key in WIF
var pubAddress = keyPair.getAddress();                          // Saves the Address
console.log("Public address - " + pubAddress);
console.log("Encrypted key - " + privateWif);
//console.log(keyPair);
//
// btmodel.create(req.body, function (err, post) {
//   if (err) return next(err);
//   console.log(post);
//   res.json(post);
// });

// TODO: Save to db
  SaveKeys(privateWif, pubAddress);
}

function SaveKeys(privateWif, pubAddress){
  console.log(privateWif + " " + pubAddress )
  var bt = new btmodel({
    pubAddress: pubAddress,
    privateWif: privateWif
  });

  bt.save(function(err, bt) {
    if (err) return console.error("error" + err);
    console.log(bt);
  });
}

function getAddressData(address){

var checkAddressURL = "https://blockchain.info/address/" + address + "?format=json";

request({                                                       //
    url: checkAddressURL,                                       //
    json: true                                                  //  This gets the JSON from the url
}, function (error, response, body) {                           //
    if (!error && response.statusCode === 200) {                //
      console.log(body.txs[0].hash + " transaction hash");      //  There should never be a previous transaction so this should work
      console.log(body.txs[0].time + " transaction time");      //  I guess the user could send twice
      var date = new Date(parseFloat(body.txs[0].time));        //
            console.log( "txn at " +                            //
              (date.getMonth() + 1) + "/" +                     //
              date.getDate() + "/" +                            //  This is just converting EPOC to normal Date time
              date.getFullYear() + " " +                        //
              date.getHours() + ":" +                           //
              date.getMinutes() + ":" +                         //
              date.getSeconds()                                 //
            );                                                  //
          console.log("address has " + body.total_received + " in satoshi");

        }else{
          console.log("error: " + error);

        }
    });                                                         //  End Reqest
}
// TODO:
