var helper = require("node-red-node-test-helper");
var node = require("../nodes/get-validators-info/get-validators-info.js");

describe('get-validators-info Node', function() {

  afterEach(function() {
    helper.unload();
  });

  it('should be loaded', function(done) {
    var flow = [{
      id: "n1",
      type: "get-validators-info",
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
        type: "get-validators-info",
        name: "test",
        wires: [
          ["n2"]
        ],
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
        host: "78.46.32.13",
        port: "7777",
        path: "/rpc"
      };

      n1.receive({
        payload: ""
      });

      n2.on("input", function(msg) {
        msg.payload.should.have.property('auction_state');
        done();
      });
    });
  });

});