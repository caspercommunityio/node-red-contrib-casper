module.exports = function (RED) {

	/**
	 * CasperSignNode - Create a node to store the info needed to sign a deploy	
	 *
	 */
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