# bitnode


      KK so the idea is that someone will click a button that says
      "Pay with BTC" or something. That sends a request to GenerateKeys
      and sends back the address. The keys will be saved in a DB. The
      user will send the BTC on their own through their wallet and then
      click a button telling us they've submitted a payment. We will veryify
      with getAddressData(). Then we'll save the time and the transaction hash
      and probably some other stuff.
      Then we'll run a job once a day that will pull in all the previous day's
      transactions to a single wallet.
