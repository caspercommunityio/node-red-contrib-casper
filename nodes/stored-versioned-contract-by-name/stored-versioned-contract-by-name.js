const {
	DeployUtil
} = require("casper-js-sdk");
module.exports = function (RED) {
	function StoredVersionedContractByNameNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		this.contractName = config.contractName;
		this.entryPoint = config.entryPoint;
		this.versionNumber = config.versionNumber;
		node.on("input", function (msg) {
			try {
				if (this.contractName == undefined || this.entryPoint == undefined || this.versionNumber == undefined) {
					msg.payload = {
						error: "Invalid arguments supplied."
					};
				} else {
					const session = DeployUtil.ExecutableDeployItem.newStoredVersionContractByName(
						this.contractName,
						parseInt(this.versionNumber) || null,
						this.entryPoint,
						msg.payload
					);

					msg.payload = session;
				}
				node.send(msg);
				node.status({});
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
		"stored-versioned-contract-by-name",
		StoredVersionedContractByNameNode
	);
};