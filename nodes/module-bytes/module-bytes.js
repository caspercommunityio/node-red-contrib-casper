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
		node.on("input", function (msg) {
			try {

				const session = DeployUtil.ExecutableDeployItem.newModuleBytes(
					Uint8Array.from(Buffer.from(this.moduleBytes, "hex")),
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
	RED.nodes.registerType("module-bytes", ModuleBytesNode);
};