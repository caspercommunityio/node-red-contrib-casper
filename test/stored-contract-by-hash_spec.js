var helper = require("node-red-node-test-helper");
var node = require("../nodes/stored-contract-by-hash/stored-contract-by-hash.js");
const {
	RuntimeArgs,
	CLString
} = require("casper-js-sdk");

describe('stored-contract-by-hash Node', function () {

	afterEach(function () {
		helper.unload();
	});

	it('should be loaded', function (done) {
		var flow = [{
			id: "n1",
			type: "stored-contract-by-hash",
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
				type: "stored-contract-by-hash",
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

			const args = RuntimeArgs.fromMap({});
			args.insert("test", new CLString("TEST"));

			n1.contractHash = "2f36a35edcbaabe17aba805e3fae42699a2bb80c2e0c15189756fdc4895356f8";
			n1.entryPoint = "test";

			n1.receive({
				payload: RuntimeArgs.fromMap({})
			});

			n2.on("input", function (msg) {
				msg.payload.should.have.property('storedContractByHash');
				done();
			});
		});
	});

});