const {
	DeployUtil
} = require("casper-js-sdk");

module.exports = function (RED) {

	/**
	 * StoredVersionedContractByHashNode - Create a stored versioned contract by hash object to deploy it on the casper's blockchain		
	 *
	 */
	function StoredVersionedContractByHashNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		this.contractHash = config.contractHash;
		this.entryPoint = config.entryPoint;
		this.versionNumber = config.versionNumber;

		//When an input comes to the node
		node.on("input", function (msg) {
			try {
				if (this.contractHash == undefined || this.entryPoint == undefined || this.versionNumber == undefined) {
					msg.payload = {
						error: "Invalid arguments supplied."
					};
				} else {
					//Generate a StoredVersionContractByashHe object based on the "convert-to-runtime-args" node
					//The ouput of this node will be use in the "put-deploy" node
					const session = DeployUtil.ExecutableDeployItem.newStoredVersionContractByHash(
						Uint8Array.from(Buffer.from(this.contractHash, "hex")),
						parseInt(this.versionNumber) || null,
						this.entryPoint,
						msg.payload
					);

					msg.payload = session;
				}
				node.send(msg);
				node.status({})
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
		"stored-versioned-contract-by-hash",
		StoredVersionedContractByHashNode
	);
};