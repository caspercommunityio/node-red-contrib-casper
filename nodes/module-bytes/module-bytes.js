const {
	DeployUtil
} = require("casper-js-sdk");

module.exports = function (RED) {
	function ModuleBytesNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		this.moduleBytes = config.moduleBytes;
		this.casperClient = RED.nodes.getNode(config.client);
		this.casperSign = RED.nodes.getNode(config.Sign);

		//When an input comes to the node
		node.on("input", function (msg) {
			try {
				//Generate a modulebytes object based on the "convert-to-runtime-args" node
				//The ouput of this node will be use in the "put-deploy" node
				const session = DeployUtil.ExecutableDeployItem.newModuleBytes(
					Uint8Array.from(Buffer.from(this.moduleBytes, "hex")),
					msg.payload
				);

				msg.payload = session;
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
	RED.nodes.registerType("module-bytes", ModuleBytesNode);
};