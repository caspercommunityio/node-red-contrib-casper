var helper = require("node-red-node-test-helper");
var node = require("../nodes/put-deploy/put-deploy.js");
const {
	RuntimeArgs,
	CLString,
	DeployUtil,
	CLPublicKey
} = require("casper-js-sdk");

describe('put-deploy Node', function () {

	afterEach(function () {
		helper.unload();
	});

	it('should be loaded', function (done) {
		var flow = [{
			id: "n1",
			type: "put-deploy",
			name: "test"
		}];




		helper.load(node, flow, function () {
			var n1 = helper.getNode("n1");
			n1.should.have.property('name', 'test');
			done();
		});
	});

	it('should transfert Ed25519', function (done) {
		var flow = [{
				id: "n1",
				type: "put-deploy",
				name: "test",
				wires: [["n2"]]
	  			},
			{
				id: "n2",
				type: "helper"
	  			}];

		helper.load(node, flow, function () {
			var n2 = helper.getNode("n2");
			var n1 = helper.getNode("n1");
			n1.casperClient = {
				protocol: "http://",
				host: "88.99.95.7",
				port: "7777",
				path: "/rpc",
				environment: "casper-test"
			};

			n1.casperSign = {
				privateKeyPem: "MC4CAQAwBQYDK2VwBCIEIBcqRroGM1D0rcPie0+ZrwWT8yfJmDlB3ALGSLMoWhz3",
				publicKeyPem: "MCowBQYDK2VwAyEAzvE71PoQAE7xBfrFUTbpVyrPripIa6JelErGo98yIq4=",
				publicKey: "01cef13bd4fa10004ef105fac55136e9572acfae2a486ba25e944ac6a3df3222ae"
			};

			n1.payment = 1000000000;

			try {

				const session = DeployUtil.ExecutableDeployItem.newTransfer(
					1000000 * 1000000000,
					CLPublicKey.fromHex("01eb86b54bafad6b54cf7c1495a19310fd7425f2a71a7c2ec5d62583e072978017"),
					null,
					1
				);


				n1.receive({
					payload: session
				});

				n2.on("input", function (msg) {
					msg.payload.deploy.should.have.property('hash');
					done();
				});
			} catch (err) {
				console.log(err);
			}
		});
	});

	it('should transfert Secp256K1', function (done) {
		var flow = [{
				id: "n1",
				type: "put-deploy",
				name: "test",
				wires: [["n2"]]
					},
			{
				id: "n2",
				type: "helper"
					}];

		helper.load(node, flow, function () {
			var n2 = helper.getNode("n2");
			var n1 = helper.getNode("n1");
			n1.casperClient = {
				protocol: "http://",
				host: "88.99.95.7",
				port: "7777",
				path: "/rpc",
				environment: "casper-test"
			};

			n1.casperSign = {
				privateKeyPem: "MHQCAQEEIP16wHnWub303C7DpqgJ45HMt6NhWumrJfOvlKUKrQNboAcGBSuBBAAKoUQDQgAE91+QScFTEs6iZ2efdCr/L0/3tO+wLwnsCSuU+tJ/kRs8B7iWCDGhha11xMskydHqsoGk0OjxgcB+9RGczgsPUw==",
				publicKeyPem: "MDYwEAYHKoZIzj0CAQYFK4EEAAoDIgAD91+QScFTEs6iZ2efdCr/L0/3tO+wLwnsCSuU+tJ/kRs=",
				publicKey: "0203f75f9049c15312cea267679f742aff2f4ff7b4efb02f09ec092b94fad27f911b"
			};

			n1.payment = 1000000000;

			try {

				const session = DeployUtil.ExecutableDeployItem.newTransfer(
					1000000 * 1000000000,
					CLPublicKey.fromHex("01eb86b54bafad6b54cf7c1495a19310fd7425f2a71a7c2ec5d62583e072978017"),
					null,
					1
				);

				console.log(session);

				n1.receive({
					payload: session
				});

				n2.on("input", function (msg) {
					msg.payload.deploy.should.have.property('hash');
					done();
				});
			} catch (err) {
				console.log(err);
			}
		});
	});


	it('should not transfert', function (done) {
		var flow = [{
				id: "n1",
				type: "put-deploy",
				name: "test",
				wires: [["n2"]]
					},
			{
				id: "n2",
				type: "helper"
					}];

		helper.load(node, flow, function () {
			var n2 = helper.getNode("n2");
			var n1 = helper.getNode("n1");
			n1.casperClient = {
				protocol: "http://",
				host: "88.99.95.7",
				port: "7777",
				path: "/rpc",
				environment: "casper-test"
			};

			n1.casperSign = {
				privateKeyPem: "MC4CAQAwBQYDK2VALGSLMoWhz3",
				publicKeyPem: "MCowBQYDK2VwAyEAzvE71PoQAE7xBfrFUTbpVyrPripIa6JelErGo98yIq4=",
				publicKey: "01cef13bd4fa10004ef105fac55136e9572acfae2a486ba25e944ac6a3df3222ae"
			};

			n1.payment = 1000000000;

			try {

				const session = DeployUtil.ExecutableDeployItem.newTransfer(
					1000000 * 1000000000,
					CLPublicKey.fromHex("01eb86b54bafad6b54cf7c1495a19310fd7425f2a71a7c2ec5d62583e072978017"),
					null,
					1
				);

				n1.receive({
					payload: session
				});

				n2.on("input", function (msg) {
					msg.payload.should.have.property('error');
					done();
				});
			} catch (err) {
				console.log(err);
			}
		});
	});


});