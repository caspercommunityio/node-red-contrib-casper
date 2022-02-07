module.exports = function (RED) {
	function CasperSignNode(n) {
		RED.nodes.createNode(this, n);
		//Parameters used to sign a deploy
		//These infos comes from cspr.live
		this.privateKeyPem = n.privateKeyPem;
		this.publicKeyPem = n.publicKeyPem;
		this.publicKey = n.publicKey;
	}
	RED.nodes.registerType("casper-sign", CasperSignNode);
};