const {
	CasperServiceByJsonRPC
} = require("casper-js-sdk");

module.exports = function (RED) {
	/**
	 * GetAccountBalanceByUrefNode - Retrieve the account's balance from an Uref
	 *
	 */
	function GetAccountBalanceByUrefNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		this.casperClient = RED.nodes.getNode(config.client);

		//When an input comes to the node
		node.on("input", function (msg) {
			//Initialize the casper service from the js SDK with the info of the node "capser-client"
			var client = new CasperServiceByJsonRPC(
				this.casperClient.protocol +
				this.casperClient.host +
				(this.casperClient.port ? ":" + this.casperClient.port : "") +
				this.casperClient.path
			);
			//Call the related request from the Casper Service
			client
				.getAccountBalance(msg.payload.stateRootHash, msg.payload.accountUref)
				.then(r => {
					//Convert the result to "motes" and "cspr" and set the message payload
					msg.payload = {
						"inMotes": r.toString(),
						"inCSPR": (parseFloat(r.toString()) / 1000000000).toFixed(9)
					};
					msg.topic = "accountBalanceByUref";
					//Send the message to the output
					node.send(msg);
					node.status({});
				})
				.catch(err => {
					//Set the message payload and display the error's message bellow the node
					msg.payload = {
						error: err
					};
					msg.topic = "accountBalanceByUref";
					node.send(msg);
					node.status({
						fill: "red",
						shape: "ring",
						text: err
					});
				});
		});
	}
	RED.nodes.registerType(
		"get-account-balance-by-uref",
		GetAccountBalanceByUrefNode
	);
};