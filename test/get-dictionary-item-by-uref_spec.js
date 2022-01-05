var helper = require("node-red-node-test-helper");
var node = require("../nodes/get-dictionary-item-by-uref/get-dictionary-item-by-uref.js");

describe('get-dictionary-item-by-uref Node', function () {

	afterEach(function () {
		helper.unload();
	});

	it('should be loaded', function (done) {
		var flow = [{
			id: "n1",
			type: "get-dictionary-item-by-uref",
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
				type: "get-dictionary-item-by-uref",
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
				host: "3.208.91.63",
				port: "7777",
				path: "/rpc"
			};

			n1.receive({
				payload: {
					item: {
						dictionaryKey: "mika.cspr",
						seedUref: "uref-bC3c71eA5246EFA149CA653E6F63192e7c59C652Ab830eC59b234B99bfA0B109-007"
					},
					stateRootHash: "231Bc33b9E63116A56987c188F96651088074a87Ae38C3E0cBbd0d9A6678F7f4"
				}
			});

			n2.on("input", function (msg) {
				msg.payload.CLValue.should.have.property('data');
				done();
			});
		});
	});
	it('should give an error', function (done) {
		var flow = [{
				id: "n1",
				type: "get-dictionary-item-by-uref",
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
				host: "3.208.91.63",
				port: "7777",
				path: "/rpc"
			};

			n1.receive({
				payload: {
					item: {
						dictionaryKey: "mika.cspr",
						seedUref: "uref-bC3c71eA5259b234B99bfA0B109-007"
					},
					stateRootHash: "231Bc33b9E63116A56987c188F96651088074a87Ae38C3E0cBbd0d9A6678F7f4"
				}
			});

			n2.on("input", function (msg) {
				msg.payload.should.have.property('error');
				done();
			});
		});
	});

});