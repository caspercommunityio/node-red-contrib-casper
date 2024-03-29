var helper = require("node-red-node-test-helper");
var node = require("../nodes/get-block-info/get-block-info.js");

describe('get-block-info Node', function() {

  afterEach(function() {
    helper.unload();
  });

  it('should be loaded', function(done) {
    var flow = [{
      id: "n1",
      type: "get-block-info",
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
        type: "get-block-info",
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
        payload: "9b73c39bd1d3c1d9b6a4c5c260f581839b4977baa1c520ebc9c19db2b6f90127"
      });

      n2.on("input", function(msg) {
        msg.payload.block.should.have.property('hash', "9b73c39bd1d3c1d9b6a4c5c260f581839b4977baa1c520ebc9c19db2b6f90127");
        done();
      });
    });
  });
  it('should give an error', function(done) {
    var flow = [{
        id: "n1",
        type: "get-block-info",
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
        payload: "9b73c39bd1d3c1d9b6a4c5c260f581839b49127"
      });

      n2.on("input", function(msg) {
        msg.payload.should.have.property("error");
        done();
      });
    });
  });

});