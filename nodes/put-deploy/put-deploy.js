const {
	CasperServiceByJsonRPC,
	Keys,
	CLPublicKey,
	CLAccountHash,
	DeployUtil
} = require("casper-js-sdk");

module.exports = function (RED) {

	/**
	 * PutDeployNode - Deploy a transaction on the casper's blockchain	
	 *
	 */
	function PutDeployNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		this.payment = config.payment;
		this.casperClient = RED.nodes.getNode(config.client);
		this.casperSign = RED.nodes.getNode(config.Sign);

		//When an input comes to the node
		node.on("input", function (msg) {
			try {

				//Initialize the casper service from the js SDK with the info of the node "capser-client"
				var client = new CasperServiceByJsonRPC(
					this.casperClient.protocol +
					this.casperClient.host +
					(this.casperClient.port ? ":" + this.casperClient.port : "") +
					this.casperClient.path
				);

				//Retrieve the info from the node "casper-sign" and generate the needed object
				let publicContent =
					"-----BEGIN PUBLIC KEY-----\r\n" +
					this.casperSign.publicKeyPem +
					"\r\n-----END PUBLIC KEY-----";
				let privateContent =
					"-----BEGIN PRIVATE KEY-----\r\n" +
					this.casperSign.privateKeyPem +
					"\r\n-----END PRIVATE KEY-----";

				//Create a ED25519 or SECP256K1 object. Used to sign the deploy
				let asym = undefined;
				try {
					asym = Keys.Ed25519.parseKeyPair(
						Keys.Ed25519.readBase64WithPEM(publicContent),
						Keys.Ed25519.readBase64WithPEM(privateContent)
					);
				} catch (err) {
					asym = Keys.Secp256K1.parseKeyPair(
						Keys.Secp256K1.readBase64WithPEM(publicContent),
						Keys.Secp256K1.readBase64WithPEM(privateContent)
					);
				}

				const activePublicKey = CLPublicKey.fromHex(asym.publicKey.toHex());
				const clKeyParam = new CLAccountHash(activePublicKey.toAccountHash());
				const payment = DeployUtil.standardPayment(this.payment * 1000000000);

				//Create the deploy
				//It use the input from one of the following nodes : module-bytes or stored-(versioned)-contract-by-hash or stored-(versioned)-contract-by-name or transfer
				const deploy = DeployUtil.makeDeploy(
					new DeployUtil.DeployParams(
						activePublicKey,
						this.casperClient.environment
					),
					msg.payload,
					payment
				);

				//Sign the deploy
				const signedDeploy = DeployUtil.signDeploy(deploy, asym);

				msg.payload = JSON.parse(
					JSON.stringify(DeployUtil.deployToJson(signedDeploy))
				);
				node.send(msg);
				//Call the related request from the Casper Service to deploy the transaction
				client
					.deploy(signedDeploy)
					.then(r => {
						msg.payload = r;
						msg.topic = "putDeploy";
						node.send(msg);
						node.status({});
					})
					.catch(err => {
						//Set the message payload and display the error's message bellow the node
						msg.payload = {
							error: err
						};
						msg.topic = "putDeploy";
						node.send(msg);
						node.status({
							fill: "red",
							shape: "ring",
							text: err
						});
					});
			} catch (err) {
				//Set the message payload and display the error's message bellow the node
				msg.payload = {
					error: err
				};
				msg.topic = "putDeploy";
				node.send(msg);
				node.status({
					fill: "red",
					shape: "ring",
					text: err
				});
			}
		});
	}
	RED.nodes.registerType("put-deploy", PutDeployNode);
};