var helper = require("node-red-node-test-helper");
var node = require("../nodes/get-state-root-hash/get-state-root-hash.js");

describe('get-state-root-hash Node', function() {

  afterEach(function() {
    helper.unload();
  });

  it('should be loaded', function(done) {
    var flow = [{
      id: "n1",
      type: "get-state-root-hash",
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
        type: "get-state-root-hash",
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
        protocol: 'http://',
        host: "3.141.144.131",
        port: "7777",
        path: "/rpc"
      };

      n1.receive({
        payload: "some payload from parent"
      });

      n2.on("input", function(msg) {
        msg.should.have.property('payload');
        msg.should.have.property('topic', 'stateRootHash');
        done();
      });
    });
  });
});