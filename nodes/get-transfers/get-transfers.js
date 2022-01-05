const {
	CasperServiceByJsonRPC
} = require("casper-js-sdk");

module.exports = function (RED) {
	function GetTransferNode(config) {
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
				.getBlockTransfers(msg.payload)
				.then(r => {
					msg.payload = r.transfers;
					msg.topic = "transfers";
					node.send(msg);
					node.status({});
				})
				.catch(err => {
					msg.payload = {
						error: err
					};
					msg.topic = "transfers";
					node.send(msg);
					node.status({
						fill: "red",
						shape: "ring",
						text: err
					});
				});


		});
	}
	RED.nodes.registerType("get-transfers", GetTransferNode);
};