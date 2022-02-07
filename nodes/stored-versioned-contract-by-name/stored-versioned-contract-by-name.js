const {
	DeployUtil
} = require("casper-js-sdk");
module.exports = function (RED) {

	/**
	 * StoredVersionedContractByNameNode - Create a Stored versioned contract by name object to deploy it on the casper's blockchain		
	 *
	 */
	function StoredVersionedContractByNameNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		this.contractName = config.contractName;
		this.entryPoint = config.entryPoint;
		this.versionNumber = config.versionNumber;

		//When an input comes to the node
		node.on("input", function (msg) {
			try {
				if (this.contractName == undefined || this.entryPoint == undefined || this.versionNumber == undefined) {
					msg.payload = {
						error: "Invalid arguments supplied."
					};
				} else {
					//Generate a StoredContractByName object based on the "convert-to-runtime-args" node
					//The ouput of this node will be use in the "put-deploy" node
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
				//Set the message payload and display the error's message bellow the node
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