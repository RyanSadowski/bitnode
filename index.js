var express = require('express');
var app = express();
var request = require("request");
var bitcoin = require('bitcoinjs-lib');

GenerateKeys();
getAddressData("1LybBpJmw1T6fZt4rXkbxxRocRCXXuG75a");

function GenerateKeys() {
var keyPair = bitcoin.ECPair.makeRandom();                      // Create a key pair, private & public
var privateWif = keyPair.toWIF();                               // Saves the private key in WIF
var pubAddress = keyPair.getAddress();                          // Saves the Address

//console.log(keyPair.toWIF() + " private key in WIF");
//console.log(keyPair.getAddress() + " public address");

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
/*
      KK so the idea is that someone will click a button that says
      "Pay with BTC" or something. That sends a request to GenerateKeys
      and sends back the address. The keys will be saved in a DB. The
      user will send the BTC on their own through their wallet and then
      click a button telling us they've submitted a payment. We will veryify
      with getAddressData(). Then we'll save the time and the transaction hash
      and probably some other stuff.

      Then we'll run a job once a day that will pull in all the previous day's
      transactions to a single wallet.
*/
