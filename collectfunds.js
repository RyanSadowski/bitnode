var crypt = require('./crypt.js');
var btmodel = require('./btmodel.js');
var btc = require('./btc.js');
var mongoose = require('mongoose');
var bitcoin = require('bitcoinjs-lib');
var request = require("request");

function Start(){
  var addressData;
  console.log("starting collection");
  btmodel.find({verified:"true"},function(err,bitnodes){
        if (err){throw err;}
         else{
          for (var i = 0; i < bitnodes.length; i++) {
            var key = bitcoin.ECPair.fromWIF(crypt.decrypt(bitnodes[i].privateWif)); // get privateWif from DB and decrypt, then put it in the right format
            btc.getAddressData(bitnodes[i].pubAddress, function(err, addressData) {
              if (err) {
                console.log(err + "error");
              } else {
               console.log(" prevTx - " + addressData.txs[0].hash);
               console.log(" BTC in address - " + addressData.total_received);
               console.log(" Sending - " + (addressData.total_received - 10000));
               var tx = new bitcoin.TransactionBuilder();
               tx.addInput(addressData.txs[0].hash, 0);
               tx.addOutput("1AeVsoKevopE8dLtxjuUcDJ3EEqPQv64V5", (addressData.total_received - 10000));
               tx.sign(0, key);
               console.log(tx.build().toHex());

               request.post(
                 'http://btc.blockr.io/api/v1/tx/push',
                 { json: { "hex" : tx.build().toHex() } },
                 function (error, response, body) {
                   if (!error && response.statusCode == 200) {
                     console.log("transaction successful !" );
                   }else{
                     console.log(error + " error" + response);
                   }
                 }
               );


               // looks like you can post a hex transaction here http://btc.blockr.io/api/v1/tx/push
               // {"hex" : tx.build().toHex()}
          }
        });
      }
    }
  });
}

module.exports.Start = Start;
