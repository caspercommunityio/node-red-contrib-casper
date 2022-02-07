const {
	DeployUtil,
	CLPublicKey
} = require("casper-js-sdk");
module.exports = function (RED) {


	/**
	 * TransferNode - Create a transfer object to deploy it on the casper's blockchain
	 *
	 */
	function TransferNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		this.casperClient = RED.nodes.getNode(config.client);
		this.casperSign = RED.nodes.getNode(config.Sign);

		//When an input comes to the node
		node.on("input", function (msg) {
			//Generate a transfer object
			//The ouput of this node will be use in the "put-deploy" node
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