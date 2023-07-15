var helper = require("node-red-node-test-helper");
var node = require("../nodes/get-account-uref-by-account-hash/get-account-uref-by-account-hash.js");

describe('get-account-uref-by-account-hash Node', function() {

  afterEach(function() {
    helper.unload();
  });

  it('should be loaded', function(done) {
    var flow = [{
      id: "n1",
      type: "get-account-uref-by-account-hash",
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
        type: "get-account-uref-by-account-hash",
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
        payload: {
          stateRootHash: "aff7FfAB6AC3EA1a6997Ce83D911C43a208E6F76c378B30f0f2a394B0b177232",
          accountHash: "6c57a6cafbd8f6efbe01345ca0347a6a938f541d28c3690dc310b0bb4d3e10cf"
        }
      });

      n2.on("input", function(msg) {
        msg.should.have.property('payload', "uref-2a46eb9654eaac8dcbcc02b94429c0be3256d721d95a7a5290876ca101116188-007");
        done();
      });
    });
  });

  it('should give an error', function(done) {
    var flow = [{
        id: "n1",
        type: "get-account-uref-by-account-hash",
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
        payload: {
          stateRootHash: "aff7FfAB6AC3EA1a6997Ce83D911C43a208E6F76c378B30f0f2a394B0b177232",
          accountHash: "WRONG_INPUT"
        }
      });

      n2.on("input", function(msg) {
        msg.payload.should.have.property('error');
        done();
      });
    });
  });
});