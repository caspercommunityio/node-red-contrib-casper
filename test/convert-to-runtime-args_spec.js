var helper = require("node-red-node-test-helper");
var node = require("../nodes/convert-to-runtime-args/convert-to-runtime-args.js");
const {
	CLValueBuilder,
	CLPublicKey,
	RuntimeArgs,
	CLURef,
	CLAccountHash,
	CLKey
} = require("casper-js-sdk");

function isArrayEqual(buf1, buf2) {
	if (buf1.byteLength != buf2.byteLength) return false;
	var dv1 = new Int8Array(buf1);
	var dv2 = new Int8Array(buf2);
	for (var i = 0; i != buf1.byteLength; i++) {
		if (dv1[i] != dv2[i]) return false;
	}
	return true;
}

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
	it('should error to CLString', function (done) {
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
					}
				}]
			});

			n2.on("input", function (msg) {
				msg.payload.should.have.property('error');
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
	it('should error to CLI32', function (done) {
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
					}
				}]
			});

			n2.on("input", function (msg) {
				msg.payload.should.have.property('error');
				done();
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

	it('should error to CLU512', function (done) {
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
					"name": "test",
					"value": 10000000
				}]
			});

			n2.on("input", function (msg) {
				msg.payload.should.have.property('error');
				done();
			});
		});
	});

	it('should convert to CLList', function (done) {
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
						"type": "CLList",
						"value_type": {
							"type": "CLString"
						}
					},
					"name": "test",
					"value": ["list1", "list2"]
											}]
			});

			n2.on("input", function (msg) {
				if (msg.payload.args.values().next().value.data[0].data.toString() == "list1") {
					done();
				}
			});
		});
	});

	it('should convert to CLPublicKey', function (done) {
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
						"type": "CLPublicKey"
					},
					"name": "test",
					"value": "0121beeeefe2f55b389c20d4768c4653ef79bc6727866f3d3f052150573e013dda"
			}]
			});

			n2.on("input", function (msg) {
				if (isArrayEqual(msg.payload.args.values().next().value.data, CLPublicKey.fromHex("0121beeeefe2f55b389c20d4768c4653ef79bc6727866f3d3f052150573e013dda").data)) {
					done();
				}
			});
		});
	});


	it('should error to CLPublicKey', function (done) {
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
						"type": "CLPublicKey"
					},
					"name": "test",
					"value": "test"
			}]
			});

			n2.on("input", function (msg) {
				msg.payload.should.have.property('error');
				done();
			});
		});
	});



	it('should convert to CLAccountHash', function (done) {
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
						"type": "CLAccountHash"
					},
					"name": "test",
					"value": "b0032b1c87261c9a440705762876a64354d37a2c57be269bae69bb450e6b8c2b"
			}]
			});

			n2.on("input", function (msg) {
				if (isArrayEqual(msg.payload.args.values().next().value.data.data, new CLAccountHash(Uint8Array.from(Buffer.from("b0032b1c87261c9a440705762876a64354d37a2c57be269bae69bb450e6b8c2b", "hex"))).data)) {
					done();
				}
			});
		});
	});
	it('should error to CLAccountHash', function (done) {
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
						"type": "CLAccountHash"
					},
					"name": "test"
			}]
			});

			n2.on("input", function (msg) {
				msg.payload.should.have.property('error');
				done();
			});
		});
	});
});