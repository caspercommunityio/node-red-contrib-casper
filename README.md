
<p align="center"><a href="https://analytics.caspercommunity.io" target="_blank"><img src="https://analytics.caspercommunity.io/assets/icon/android-chrome-512x512.png" width="150"></a></p>

## About Casper Node-RED

Provide a set of nodes to communicate with the Casper's blockchain

## How to install

We assume that you have Node-RED installed (https://nodered.org/docs/getting-started/local)

Use the Palette to install this package or follow this how-to for local dev : https://nodered.org/docs/creating-nodes/first-node (section : Testing your node in Node-RED)

```
cd ~/.node-red
npm install node-red-contrib-casper
sudo service nodered restart
```
## How to create your first flow

* You have to find a peer where you can connect.

  You can find the list here : https://cspr.live/tools/peers

  Select one peer in the list and take only his IP address.

* Drop any node on your flow and double-click on it to configure it

<img src="https://raw.githubusercontent.com/caspercommunityio/node-red-contrib-casper/master/assets/new-casper-client.png">

* You have to configure a "client". Use the IP Address found on cpsr.live. The default port is "7777" and the default protocol is "http".

<img src="https://raw.githubusercontent.com/caspercommunityio/node-red-contrib-casper/master/assets/casper-client.png">

## List of available nodes

<img src="https://raw.githubusercontent.com/caspercommunityio/node-red-contrib-casper/master/assets/node-RED_overview.png">

### Get data from the Casper's blockchain

* get-state-root-hash
* get-account-uref-by-account-hash
* get-account-uref-by-public-key
* get-account-balance-by-uref
* get-block-info
* get-latest-block-info
* get-block-info-by-height
* get-era-switch-block-info
* get-block-state
* get-deploy
* get-dictionary-item-by-uref
* get-peers
* get-status
* get-transfers
* get-validators-info

Each node is documented inside Node-RED, you'll find what are the input and the output of each node.

### Interact with contracts of the Casper's Blockchain

* convert-to-runtime-args
* module-bytes
* stored-contract-by-hash
* stored-contract-by-name
* stored-versioned-contract-by-hash
* stored-versioned-contract-by-name
* transfer
* put-depoy

Each node is documented inside Node-RED, you'll find what are the input and the output of each node.

### Casper Sign

When you want to interact with a contract, you have to add the information of the account who will interact with it.

In order to do that, we have implemented a node where you can specify your information. These information will be used to sign the transaction.

<img src="https://raw.githubusercontent.com/caspercommunityio/node-red-contrib-casper/master/assets/casper-sign.png">

**DO NOT SHARE THESE INFORMATION WITH OTHER PEOPLE**

You have to specify the private key pem and the public key pem of your account in order to sign the transaction correctly.

The private key comes from cspr.live.

You can generate the public key pem using the following openssl command :

```
openssl pkey -in private_key_from_csprlive.pem -out public_key.pem
```

## How to test

Run the following command :

```
git clone git@github.com:caspercommunityio/node-red-contrib-casper.git
cd node-red-contrib-casper
npm i
npm test
```

## Examples

You can find different example inside the folder "examples".

## License

The Casper NodeRED package is an open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).