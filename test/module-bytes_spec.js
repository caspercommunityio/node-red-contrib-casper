var helper = require("node-red-node-test-helper");
var node = require("../nodes/module-bytes/module-bytes.js");
const {
	RuntimeArgs,
	CLString
} = require("casper-js-sdk");

describe('module-bytes Node', function () {

	afterEach(function () {
		helper.unload();
	});

	it('should be loaded', function (done) {
		var flow = [{
			id: "n1",
			type: "module-bytes",
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
				type: "module-bytes",
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

			n1.moduleBytes = "MyContractName";

			n1.receive({
				payload: RuntimeArgs.fromMap({})
			});

			n2.on("input", function (msg) {
				msg.payload.should.have.property('moduleBytes');
				done();
			});
		});
	});

});