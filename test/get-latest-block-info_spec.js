var helper = require("node-red-node-test-helper");
var node = require("../nodes/get-latest-block-info/get-latest-block-info.js");

describe('get-latest-block-info Node', function () {

	afterEach(function () {
		helper.unload();
	});

	it('should be loaded', function (done) {
		var flow = [{
			id: "n1",
			type: "get-latest-block-info",
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
				type: "get-latest-block-info",
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
				payload: ""
			});

			n2.on("input", function (msg) {
				msg.payload.block.should.have.property('hash');
				done();
			});
		});
	});
	it('Wrong peer', function (done) {
		var flow = [{
				id: "n1",
				type: "get-latest-block-info",
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
				host: "XX.99.95.7",
				port: "7777",
				path: "/rpc"
			};

			n1.receive({
				payload: ""
			});

			n2.on("input", function (msg) {
				msg.payload.should.have.property('error');
				done();
			});
		});
	});

});