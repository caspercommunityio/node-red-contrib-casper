const {
	DeployUtil
} = require("casper-js-sdk");

module.exports = function (RED) {
	function StoredContractByHashNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		this.contractHash = config.contractHash;
		this.entryPoint = config.entryPoint;

		//When an input comes to the node
		node.on("input", function (msg) {

			try {
				if (this.contractHash == undefined || this.entryPoint == undefined) {
					msg.payload = {
						error: "Invalid arguments supplied."
					};
				} else {
					//Generate a storedContractByHash object based on the "convert-to-runtime-args" node
					//The ouput of this node will be use in the "put-deploy" node
					const session = DeployUtil.ExecutableDeployItem.newStoredContractByHash(
						Uint8Array.from(Buffer.from(this.contractHash, "hex")),
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
	RED.nodes.registerType("stored-contract-by-hash", StoredContractByHashNode);
};