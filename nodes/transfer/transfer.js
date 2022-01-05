const {
	DeployUtil,
	CLPublicKey
} = require("casper-js-sdk");
module.exports = function (RED) {

	function TransferNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		this.casperClient = RED.nodes.getNode(config.client);
		this.casperSign = RED.nodes.getNode(config.Sign);
		node.on("input", function (msg) {
			const session = DeployUtil.ExecutableDeployItem.newTransfer(
				msg.payload.amount * 1000000000,
				CLPublicKey.fromHex(msg.payload.publicKey),
				null,
				msg.payload.transferId || 1
			);

			msg.payload = session;
			node.send(msg);
		});
	}
	RED.nodes.registerType("transfer", TransferNode);
};