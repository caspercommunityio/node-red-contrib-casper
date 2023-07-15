var helper = require("node-red-node-test-helper");
var node = require("../nodes/get-transfers/get-transfers.js");

describe('get-transfers Node', function() {

  afterEach(function() {
    helper.unload();
  });

  it('should be loaded', function(done) {
    var flow = [{
      id: "n1",
      type: "get-transfers",
      name: "test"
    }];
    helper.load(node, flow, function() {
      var n1 = helper.getNode("n1");
      n1.should.have.property('name', 'test');
      done();
    });
  });

  it('should return something', function(done) {
    var flow = [{
        id: "n1",
        type: "get-transfers",
        name: "test",
        wires: [
          ["n2"]
        ]
      },
      {
        id: "n2",
        type: "helper"
      }
    ];
    helper.load(node, flow, function() {
      var n2 = helper.getNode("n2");
      var n1 = helper.getNode("n1");
      n1.casperClient = {
        protocol: "http://",
        host: "3.141.144.131",
        port: "7777",
        path: "/rpc"
      };

      n1.receive({
        payload: "c890de4d7bd02f0adbef02857650ebae1eea8825709aa2a84b0cb4a87dbea8cd"
      });

      n2.on("input", function(msg) {
        msg.payload[0].should.have.property('deployHash', "152244748953e22836094b2ccecc6e87b588d28462c6ca3aedc5947da74f01c8");
        done();
      });
    });
  });
});