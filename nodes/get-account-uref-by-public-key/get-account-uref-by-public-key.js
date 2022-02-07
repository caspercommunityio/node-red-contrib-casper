const {
	CasperServiceByJsonRPC,
	CLPublicKey
} = require("casper-js-sdk");

module.exports = function (RED) {
	function GetAccountUrefByPublicKeyNode(config) {
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

			try {
				//Call the related request from the Casper Service
				client
					.getAccountBalanceUrefByPublicKey(
						msg.payload.stateRootHash,
						CLPublicKey.fromHex(msg.payload.publicKey)
					)
					.then(r => {
						//Set the message payload from the request's result and send it to the output
						msg.payload = r;
						msg.topic = "accountUref";
						node.send(msg);
						node.status({});
					})
					.catch(err => {
						//Set the message payload and display the error's message bellow the node
						msg.payload = {
							error: err
						};
						msg.topic = "accountUref";
						node.send(msg);
						node.status({
							fill: "red",
							shape: "ring",
							text: err
						});
					});
			} catch (err) {
				//Set the message payload and display the error's message bellow the node
				msg.payload = {
					error: err
				};
				msg.topic = "accountUref";
				node.send(msg);
				node.status({
					fill: "red",
					shape: "ring",
					text: err
				});
			}
		});
	}
	RED.nodes.registerType(
		"get-account-uref-by-public-key",
		GetAccountUrefByPublicKeyNode
	);
};