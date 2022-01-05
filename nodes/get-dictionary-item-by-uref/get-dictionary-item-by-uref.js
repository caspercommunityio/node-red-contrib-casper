const {
	CasperServiceByJsonRPC
} = require("casper-js-sdk");

module.exports = function (RED) {
	function GetDicitonaryItemByUrefNode(config) {
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
				.getDictionaryItemByURef(
					msg.payload.stateRootHash,
					msg.payload.item.dictionaryKey,
					msg.payload.item.seedUref
				)
				.then(r => {
					msg.payload = JSON.parse(JSON.stringify(r));
					msg.topic = "dictionaryItemByURef";
					node.send(msg);
					node.status({});
				})
				.catch(err => {
					msg.payload = {
						error: err
					};
					msg.topic = "dictionaryItemByURef";
					node.send(msg);
					node.status({
						fill: "red",
						shape: "ring",
						text: err
					});
				});
		});
	}
	RED.nodes.registerType(
		"get-dictionary-item-by-uref",
		GetDicitonaryItemByUrefNode
	);
};