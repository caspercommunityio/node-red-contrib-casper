const {
	CasperServiceByJsonRPC
} = require("casper-js-sdk");

module.exports = function (RED) {
	function GetBlockStateNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		this.casperClient = RED.nodes.getNode(config.client);
		node.on("input", function (msg) {
			var client = new CasperServiceByJsonRPC(
				this.casperClient.protocol +
				this.casperClient.host +
				(this.casperClient.port ? ":" + this.casperClient.port : "") +
				this.casperClient.path
			);
			client
				.getBlockState(msg.payload.stateRootHash, msg.payload.key, [])
				.then(r => {
					msg.payload = JSON.parse(JSON.stringify(r));
					msg.topic = "blockState";
					node.send(msg);
					node.status({});
				})
				.catch(err => {
					msg.payload = {
						error: err
					};
					msg.topic = "blockState";
					node.send(msg);
					node.status({
						fill: "red",
						shape: "ring",
						text: err
					});
				});
		});
	}
	RED.nodes.registerType("get-block-state", GetBlockStateNode);
};