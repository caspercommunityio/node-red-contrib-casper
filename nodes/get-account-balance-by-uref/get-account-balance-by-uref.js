const {
	CasperServiceByJsonRPC
} = require("casper-js-sdk");

module.exports = function (RED) {
	function GetAccountBalanceByUrefNode(config) {
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
			client
				.getAccountBalance(msg.payload.stateRootHash, msg.payload.accountUref)
				.then(r => {
					msg.payload = {
						"inMotes": r.toString(),
						"inCSPR": (parseFloat(r.toString()) / 1000000000).toFixed(9)
					};
					msg.topic = "accountBalanceByUref";
					node.send(msg);
					node.status({});
				})
				.catch(err => {
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