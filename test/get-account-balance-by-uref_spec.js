var helper = require("node-red-node-test-helper");
var node = require("../nodes/get-account-balance-by-uref/get-account-balance-by-uref.js");

describe('get-account-balance-by-uref Node', function () {

	afterEach(function () {
		helper.unload();
	});

	it('should be loaded', function (done) {
		var flow = [{
			id: "n1",
			type: "get-account-balance-by-uref",
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
				type: "get-account-balance-by-uref",
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
					accountUref: "uref-2a46eb9654eaac8dcbcc02b94429c0be3256d721d95a7a5290876ca101116188-007"
				}
			});

			n2.on("input", function (msg) {
				msg.should.have.property('payload');
				done();
			});
		});
	});

	it('should give an error', function (done) {
		var flow = [{
				id: "n1",
				type: "get-account-balance-by-uref",
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
					stateRootHash: "WRONG_INPUT",
					accountUref: "uref-2a46eb9654eaac8dcbcc02b94429c0be3256d721d95a7a5290876ca101116188-007"
				}
			});

			n2.on("input", function (msg) {
				msg.payload.should.have.property('error');
				done();
			});
		});
	});
});