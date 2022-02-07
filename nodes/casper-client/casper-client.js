module.exports = function (RED) {

	/**
	 * CasperClientNode - Create a client to make requests to the casper's blockchain	
	 *
	 */
	function CasperClientNode(n) {
		RED.nodes.createNode(this, n);
		//Set the variables needed for the creation of a RPC Endpoint
		// eg : http://1.1.1.1:7777/rpc (protocol://host:port/path)
		// The environment is used for the "put-deploy" command to tell the command if we query the testnet or mainnet
		this.host = n.host;
		this.port = n.port;
		this.protocol = n.protocol;
		this.environment = n.environment;
		this.path = n.path;
	}
	RED.nodes.registerType("casper-client", CasperClientNode);
};