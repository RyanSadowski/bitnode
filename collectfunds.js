var crypt = require('./crypt.js');
var btmodel = require('./btmodel.js');
var btc = require('./btc.js');
var mongoose = require('mongoose');
var bitcoin = require('bitcoinjs-lib');
//var tx = new bitcoin.TransactionBuilder()

function Start(){
  var addressData;
  console.log("starting collection");
  btmodel.find({verified:"true"},function(err,bitnodes){
        if (err){throw err;}
         else{

          for (var i = 0; i < bitnodes.length; i++) {
            var rawKey = bitnodes[i].privateWif;
            var pureKey = crypt.decrypt(rawKey);
            var key = bitcoin.ECPair.fromWIF(pureKey);

            btc.getAddressData(bitnodes[i].pubAddress, function(err, addressData) {
              if (err) {
                console.log(err + "error");
              } else {
               //console.log(addressData.total_received + " body");
               console.log(" prevTx - " + addressData.txs[0].hash);
               console.log(" BTC in address - " + addressData.total_received);
               var tx = new bitcoin.TransactionBuilder();
               tx.addInput(addressData.txs[0].hash, 0);
               tx.addOutput("1AeVsoKevopE8dLtxjuUcDJ3EEqPQv64V5", addressData.total_received - 500);
               tx.sign(0, key);
               console.log(tx.build().toHex());


            }
          });    //omg callbacks suck

            //console.log(addressData + "addressData");                                         //This isnt loading in time.
            //console.log(" prevTx - " + addressData.txs[0].hash);
            //console.log(" BTC in address - " + addressData.total_received);
            //var tx = new bitcoin.TransactionBuilder();
            //tx.addInput("d18e7106e5492baf8f3929d2d573d27d89277f3825d3836aa86ea1d843b5158b", 1);
            //tx.addOutput("12idKQBikRgRuZEbtxXQ4WFYB7Wa3hZzhT", 149000);
            //tx.sign(0, key);
            //console.log(tx.build().toHex());
          }
          console.log("stopping collection");
        }
    });


}

module.exports.Start = Start;
