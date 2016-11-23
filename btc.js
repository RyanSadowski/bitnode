var bitcoin = require('bitcoinjs-lib');
var mongoose = require('mongoose');
var crypt = require('./crypt.js');
var btmodel = require('./btmodel.js');

function GenerateKeys() {
  var keyPair = bitcoin.ECPair.makeRandom();                      // Create a key pair, private & public
  var privateWif = crypt.encrypt(keyPair.toWIF());                // the private key in WIF
  var pubAddress = keyPair.getAddress();                          // the Address
  console.log("Public address - " + pubAddress);                  // for debugging
  console.log("Encrypted key - " + privateWif);                   // for debugging
  SaveKeys(privateWif, pubAddress);                               // Save to Db
  return pubAddress;                                              // Returns the address for the api
}

function SaveKeys(privateWif, pubAddress){                        //  This function saves the keys to DB
  var bt = new btmodel({                                          //  Creates the object
    pubAddress: pubAddress,                                       //  Adds the public address to the model
    privateWif: privateWif,
    verified: false                                        //  Adds the Encrypted WIF to the model
  });

  bt.save(function(err, bt) {                                   // Saves it!
    if (err) return console.error("error" + err);
    console.log("Keys Saved!");
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

module.exports.GenerateKeys = GenerateKeys;
module.exports.getAddressData = getAddressData;
