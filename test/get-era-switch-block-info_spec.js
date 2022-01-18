var helper = require("node-red-node-test-helper");
var node = require("../nodes/get-era-switch-block-info/get-era-switch-block-info.js");

describe('get-era-switch-block-info Node', function () {

	afterEach(function () {
		helper.unload();
	});

	it('should be loaded', function (done) {
		var flow = [{
			id: "n1",
			type: "get-era-switch-block-info",
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
				type: "get-era-switch-block-info",
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
				payload: "6ce2ca51fd7a7ec1aae6da7909c3ac16716be26257f1e9332c5bb131c3267823"
			});

			n2.on("input", function (msg) {
				msg.payload.should.have.property('blockHash', '6ce2ca51fd7a7ec1aae6da7909c3ac16716be26257f1e9332c5bb131c3267823');
				done();
			});
		});
	});
	it('should give an error', function (done) {
		var flow = [{
				id: "n1",
				type: "get-era-switch-block-info",
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
				payload: "257f1e9332c5bb131c3267823"
			});

			n2.on("input", function (msg) {
				msg.payload.should.have.property('error');
				done();
			});
		});
	});
});