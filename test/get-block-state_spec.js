var helper = require("node-red-node-test-helper");
var node = require("../nodes/get-block-state/get-block-state.js");

describe('get-block-state Node', function () {

	afterEach(function () {
		helper.unload();
	});

	it('should be loaded', function (done) {
		var flow = [{
			id: "n1",
			type: "get-block-state",
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
				type: "get-block-state",
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
					key: "hash-fb8e0215c040691e9bbe945dd22a00989b532b9c2521582538edb95b61156698",
					stateRootHash: "05c55323bbdeb174a56e195a0cecc036492c38b74127aca3985a0b2b18c2d6bc"
				}
			});

			n2.on("input", function (msg) {
				msg.payload.Contract.should.have.property('contractPackageHash', "contract-package-wasmfceD7072e4B52F8F4841667cFc0a7d92c93b01Ffc0717d5CD80f49546BD7FebB");
				done();
			});
		});
	});
	it('should give an error', function (done) {
		var flow = [{
				id: "n1",
				type: "get-block-state",
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
					key: "hash-fb8e0215c040691e9582538edb95b61156698",
					stateRootHash: "05c55323bbdeb174a56e195a0cecc036492c38b74127aca3985a0b2b18c2d6bc"
				}
			});

			n2.on("input", function (msg) {
				msg.payload.should.have.property('error');
				done();
			});
		});
	});

});