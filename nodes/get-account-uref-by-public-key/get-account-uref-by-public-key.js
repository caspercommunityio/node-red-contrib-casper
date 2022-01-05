const {
	CasperServiceByJsonRPC,
	CLPublicKey
} = require("casper-js-sdk");

module.exports = function (RED) {
	function GetAccountUrefByPublicKeyNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		this.casperClient = RED.nodes.getNode(config.client);
		node.on("input", function (msg) {
			var client = new CasperServiceByJsonRPC(
				this.casperClient.protocol +
				this.casperClient.host +
				(this.casperClient.port ? ":" + this.casperClient.port : "") +
				this.casperClient.path
			);

			try {
				client
					.getAccountBalanceUrefByPublicKey(
						msg.payload.stateRootHash,
						CLPublicKey.fromHex(msg.payload.publicKey)
					)
					.then(r => {
						msg.payload = r;
						msg.topic = "accountUref";
						node.send(msg);
						node.status({});
					})
					.catch(err => {
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