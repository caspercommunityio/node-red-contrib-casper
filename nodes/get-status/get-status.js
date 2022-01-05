const {
	CasperServiceByJsonRPC
} = require("casper-js-sdk");

module.exports = function (RED) {
	function GetStatusNode(config) {
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
				.getStatus()
				.then(r => {
					msg.payload = r;
					msg.topic = "status";
					node.send(msg);
					node.status({});
				})
				.catch(err => {
					msg.payload = {
						error: err
					};
					msg.topic = "status";
					node.send(msg);
					node.status({
						fill: "red",
						shape: "ring",
						text: err
					});
				});
		});
	}
	RED.nodes.registerType("get-status", GetStatusNode);
};