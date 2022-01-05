var helper = require("node-red-node-test-helper");
var node = require("../nodes/get-account-uref-by-public-key/get-account-uref-by-public-key.js");

describe('get-account-uref-by-public-key Node', function () {

	afterEach(function () {
		helper.unload();
	});

	it('should be loaded', function (done) {
		var flow = [{
			id: "n1",
			type: "get-account-uref-by-public-key",
			name: "test"
		}];
		helper.load(node, flow, function () {
			var n1 = helper.getNode("n1");
			n1.should.have.property('name', 'test');
			done();
		});
	});

	it('should return something', function (done) {
		var flow = [{
				id: "n1",
				type: "get-account-uref-by-public-key",
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
				path: "/rpc"
			};

			n1.receive({
				payload: {
					stateRootHash: "2b8fc11569a3af39ba6eee868b4183f098560efe8b0f971a9fa7741a65cb097e",
					publicKey: "01bae47da8aa69679f6b482dce908a0ef507c8b48fbdbc8d46c91996000c2cd9a0"
				}
			});

			n2.on("input", function (msg) {
				msg.should.have.property('payload', "uref-2A46eB9654eaaC8DcBCC02b94429C0be3256D721d95A7A5290876cA101116188-007");
				done();
			});
		});
	});
	it('should give an error', function (done) {
		var flow = [{
				id: "n1",
				type: "get-account-uref-by-public-key",
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
				path: "/rpc"
			};

			n1.receive({
				payload: {
					stateRootHash: "2b8fc11569a3af39ba6eee868b4183f098560efe8b0f971a9fa7741a65cb097e",
					publicKey: "01bae47da8aa6967e908a0ef507c8b48fbdbc8d46c91996000c2cd9a0"
				}
			});

			n2.on("input", function (msg) {
				msg.payload.should.have.property('error');
				done();
			});
		});
	});

});