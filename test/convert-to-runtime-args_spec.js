var helper = require("node-red-node-test-helper");
var node = require("../nodes/convert-to-runtime-args/convert-to-runtime-args.js");

describe('convert-to-runtime-args Node', function () {

	afterEach(function () {
		helper.unload();
	});

	it('should be loaded', function (done) {
		var flow = [{
			id: "n1",
			type: "convert-to-runtime-args",
			name: "test"
		}];
		helper.load(node, flow, function () {
			var n1 = helper.getNode("n1");
			n1.should.have.property('name', 'test');
			done();
		});
	});

	it('should convert to CLString', function (done) {
		var flow = [{
				id: "n1",
				type: "convert-to-runtime-args",
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


			n1.receive({
				payload: [{
					"value_type": {
						"type": "CLString"
					},
					"value": "test"
				}]
			});

			n2.on("input", function (msg) {
				msg.payload.args.values().next().value.should.have.property('data', "test");
				done();
			});
		});
	});
	it('should convert to CLI32', function (done) {
		var flow = [{
				id: "n1",
				type: "convert-to-runtime-args",
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


			n1.receive({
				payload: [{
					"value_type": {
						"type": "CLI32"
					},
					"name": "test",
					"value": 10000
				}]
			});

			n2.on("input", function (msg) {
				if (msg.payload.args.values().next().value.data.toString() == 10000) {
					done();
				}
			});
		});
	});

	it('should convert to CLU512', function (done) {
		var flow = [{
				id: "n1",
				type: "convert-to-runtime-args",
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

			n1.receive({
				payload: [{
					"value_type": {
						"type": "CLU512"
					},
					"name": "test",
					"value": 10000000
        }]
			});

			n2.on("input", function (msg) {
				if (msg.payload.args.values().next().value.data.toString() == 10000000) {
					done();
				}
			});
		});
	});

});