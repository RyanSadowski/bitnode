# bitnode

- clone the repo

- `npm install`

- have mongod running in the background with a bitnode DB and a bitnodes collection

- `node app.js`

- When the app first runs, it will ask you for a password. This will be used to encrypt the private keys before saving them to the database. I use the password 'm'. if you use this too, it will display a message when you login. otherwise it will just be a wrongly decrypted string.

- When the app is running, you can hit http://localhost:3000/api/ to save an encrypted private key & address to the database and display the address. 
