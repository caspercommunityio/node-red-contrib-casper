const {
	DeployUtil
} = require("casper-js-sdk");
module.exports = function (RED) {
	function StoredContractByNameNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		this.contractName = config.contractName;
		this.entryPoint = config.entryPoint;
		node.on("input", function (msg) {
			try {

				const session = DeployUtil.ExecutableDeployItem.newStoredContractByName(
					this.contractName,
					this.entryPoint,
					msg.payload
				);

				msg.payload = session;
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
	RED.nodes.registerType("stored-contract-by-name", StoredContractByNameNode);
};