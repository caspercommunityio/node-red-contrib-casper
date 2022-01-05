const {
	CasperServiceByJsonRPC,
	Keys,
	CLPublicKey,
	CLAccountHash,
	DeployUtil
} = require("casper-js-sdk");

module.exports = function (RED) {
	function PutDeployNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;
		this.payment = config.payment;
		this.casperClient = RED.nodes.getNode(config.client);
		this.casperSign = RED.nodes.getNode(config.Sign);
		node.on("input", function (msg) {
			try {
				var client = new CasperServiceByJsonRPC(
					this.casperClient.protocol +
					this.casperClient.host +
					(this.casperClient.port ? ":" + this.casperClient.port : "") +
					this.casperClient.path
				);

				let publicContent =
					"-----BEGIN PUBLIC KEY-----\r\n" +
					this.casperSign.publicKeyPem +
					"\r\n-----END PUBLIC KEY-----";
				let privateContent =
					"-----BEGIN PRIVATE KEY-----\r\n" +
					this.casperSign.privateKeyPem +
					"\r\n-----END PRIVATE KEY-----";
				let asym = Keys.Ed25519.parseKeyPair(
					Keys.Ed25519.readBase64WithPEM(publicContent),
					Keys.Ed25519.readBase64WithPEM(privateContent)
				);

				const activePublicKey = CLPublicKey.fromHex(asym.publicKey.toHex());
				const clKeyParam = new CLAccountHash(activePublicKey.toAccountHash());
				const payment = DeployUtil.standardPayment(this.payment * 1000000000);
				const deploy = DeployUtil.makeDeploy(
					new DeployUtil.DeployParams(
						activePublicKey,
						this.casperClient.environment
					),
					msg.payload,
					payment
				);


				const signedDeploy = DeployUtil.signDeploy(deploy, asym);

				msg.payload = JSON.parse(
					JSON.stringify(DeployUtil.deployToJson(signedDeploy))
				);
				node.send(msg);
				client
					.deploy(signedDeploy)
					.then(r => {
						msg.payload = r;
						node.send(msg);
						node.status({});
					})
					.catch(err => {
						msg.payload = err;
						node.send(msg);
						node.status({
							fill: "red",
							shape: "ring",
							text: err
						});
					});
			} catch (err) {
				msg.payload = err;
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