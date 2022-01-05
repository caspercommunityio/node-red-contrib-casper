const {
	DeployUtil
} = require("casper-js-sdk");

module.exports = function (RED) {
	function StoredVersionedContractByHashNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		this.contractHash = config.contractHash;
		this.entryPoint = config.entryPoint;
		this.versionNumber = config.versionNumber;
		node.on("input", function (msg) {
			try {

				const session = DeployUtil.ExecutableDeployItem.newStoredVersionContractByHash(
					Uint8Array.from(Buffer.from(this.contractHash, "hex")),
					parseInt(this.versionNumber) || null,
					this.entryPoint,
					msg.payload
				);
				msg.payload = session;
				node.send(msg);
				node.status({})
			} catch (err) {
				msg.payload = {
					error: err
				};
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
		"stored-versioned-contract-by-hash",
		StoredVersionedContractByHashNode
	);
};