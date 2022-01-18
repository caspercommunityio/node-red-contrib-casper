var helper = require("node-red-node-test-helper");
var node = require("../nodes/get-transfers/get-transfers.js");

describe('get-transfers Node', function () {

	afterEach(function () {
		helper.unload();
	});

	it('should be loaded', function (done) {
		var flow = [{
			id: "n1",
			type: "get-transfers",
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
				type: "get-transfers",
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
				payload: "1edfb1e616eff2437e122895e7f9b87ba51029be637530e32ac0018a2295751a"
			});

			n2.on("input", function (msg) {
				msg.payload[0].should.have.property('deployHash', "b7bd0b5572e6d481e235808bf973cab305d58c59e6067aa7a2c0c3589fac82e0");
				done();
			});
		});
	});
});