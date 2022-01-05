module.exports = function(RED) {
	function CasperSignNode(n) {
		RED.nodes.createNode(this, n);
		this.privateKeyPem = n.privateKeyPem;
		this.publicKeyPem = n.publicKeyPem;
		this.publicKey = n.publicKey;
	}
	RED.nodes.registerType("casper-sign", CasperSignNode);
};
