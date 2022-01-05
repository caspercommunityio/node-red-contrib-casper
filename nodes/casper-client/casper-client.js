module.exports = function (RED) {
	function CasperClientNode(n) {
		RED.nodes.createNode(this, n);
		this.host = n.host;
		this.port = n.port;
		this.protocol = n.protocol;
		this.environment = n.environment;
		this.path = n.path;
	}
	RED.nodes.registerType("casper-client", CasperClientNode);
};