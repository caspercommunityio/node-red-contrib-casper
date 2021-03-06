var helper = require("node-red-node-test-helper");
var node = require("../nodes/stored-contract-by-name/stored-contract-by-name.js");
const {
	RuntimeArgs,
	CLString
} = require("casper-js-sdk");

describe('stored-contract-by-name Node', function () {

	afterEach(function () {
		helper.unload();
	});

	it('should be loaded', function (done) {
		var flow = [{
			id: "n1",
			type: "stored-contract-by-name",
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
				type: "stored-contract-by-name",
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

			n1.contractName = "MyContractName";
			n1.entryPoint = "test";

			n1.receive({
				payload: RuntimeArgs.fromMap({})
			});

			n2.on("input", function (msg) {
				msg.payload.should.have.property('storedContractByName');
				done();
			});
		});
	});


	it('should return error', function (done) {
		var flow = [{
				id: "n1",
				type: "stored-contract-by-name",
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


			n1.receive({
				payload: undefined
			});

			n2.on("input", function (msg) {
				msg.payload.should.have.property('error');
				done();
			});
		});
	});

});