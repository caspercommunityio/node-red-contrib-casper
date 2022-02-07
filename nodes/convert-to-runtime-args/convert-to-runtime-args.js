//Convert a JSON object to CLValue type recognise by the casper js sdk
const {
	CLValueBuilder,
	CLPublicKey,
	RuntimeArgs,
	CLURef,
	CLAccountHash,
	CLKey
} = require("casper-js-sdk");
module.exports = function (RED) {

	function convertValueToCLType(value, type) {
		if (type.type == "CLBool") {
			return CLValueBuilder.bool(value);
		} else if (type.type == "CLI32") {
			return CLValueBuilder.i32(value);
		} else if (type.type == "CLI64") {
			return CLValueBuilder.i64(value);
		} else if (type.type == "CLU8") {
			return CLValueBuilder.u8(value);
		} else if (type.type == "CLU32") {
			return CLValueBuilder.u32(value);
		} else if (type.type == "CLU64") {
			return CLValueBuilder.u64(value);
		} else if (type.type == "CLU128") {
			return CLValueBuilder.u128(value);
		} else if (type.type == "CLU256") {
			return CLValueBuilder.u256(value);
		} else if (type.type == "CLU512") {
			return CLValueBuilder.u512(value);
		} else if (type.type == "CLUnit") {
			return CLValueBuilder.unit();
		} else if (type.type == "CLString") {
			return CLValueBuilder.string(value);
		} else if (type.type == "CLURef") {
			return new CLURef.fromFormattedStr(value);
		} else if (type.type == "CLAccountHash") {
			return CLValueBuilder.key(new CLAccountHash(Uint8Array.from(Buffer.from(value, "hex"))));
		} else if (type.type == "CLPublicKey") {
			return CLPublicKey.fromHex(value);
		} else if (type.type == "CLTuple1") {
			clTuple = [];
			clTuple.push(convertValueToCLType(value[0], type.value_type[0]));
			return CLValueBuilder.tuple1(clTuple);
		} else if (type.type == "CLTuple2") {
			clTuple = [];
			clTuple.push(convertValueToCLType(value[0], type.value_type[0]));
			clTuple.push(convertValueToCLType(value[1], type.value_type[1]));
			return CLValueBuilder.tuple2(clTuple);
		} else if (type.type == "CLTuple3") {
			clTuple = [];
			clTuple.push(convertValueToCLType(value[0], type.value_type[0]));
			clTuple.push(convertValueToCLType(value[1], type.value_type[1]));
			clTuple.push(convertValueToCLType(value[2], type.value_type[2]));
			return CLValueBuilder.tuple3(clTuple);
		} else if (type.type == "CLList") {
			clList = [];
			value.map(x => {
				clList.push(convertValueToCLType(x, type.value_type));
			});
			return CLValueBuilder.list(clList);
		} else if (type.type == "CLMap") {
			clMap = [];
			value.map(x => {
				clMap.push([
					convertValueToCLType(x[0], type.value_type[0]),
					convertValueToCLType(x[1], type.value_type[1])
				]);
			});
			return CLValueBuilder.map(clMap);
		}
	}

	function convertArgToCLType(arg) {
		return convertValueToCLType(arg.value, arg.value_type);
	}

	function ConvertArgsNode(config) {
		RED.nodes.createNode(this, config);
		var node = this;

		//When an input comes to the node
		node.on("input", function (msg) {
			try {
				const args = RuntimeArgs.fromMap({});
				//Convert each element of the payload into a CLType
				msg.payload.map(x => {
					args.insert(x.name, convertArgToCLType(x));
				});
				msg.payload = args;
				node.send(msg);
				node.status({});
			} catch (error) {
				//Display the error's message bellow the node
				node.status({
					fill: "red",
					shape: "ring",
					text: error
				});
				node.send({
					"payload": {
						error: error
					}
				});
			}
		});
	}
	RED.nodes.registerType("convert-to-runtime-args", ConvertArgsNode);
};