import getCartridgeType from "./getCartridgeType";
import getRomSize from "./getRomSize";
import getRamSize from "./getRamSize";
import _ from "lodash";

if (!window.DESKTOP_REQUIRE) throw new Error("Missing node.js access!");
const EventEmitter = window.DESKTOP_REQUIRE("events");
const SerialPort = window.DESKTOP_REQUIRE("serialport");
const Readline = window.DESKTOP_REQUIRE("@serialport/parser-readline");

export default class Dumper extends EventEmitter {
	constructor(port, baudRate = 57600) {
		super();

		const serialPort = new SerialPort(port, { baudRate });
		const parser = new Readline({ delimiter: "\r\n" });
		serialPort.pipe(parser);

		serialPort.on("open", () => {
			console.log("Serial Port open...");
			this.emit("open");
		});

		serialPort.on("error", (e) => {
			this.emit("error", e);
		});

		parser.on("data", (data) => {
			if (!_.isString(data)) return;

			console.log("Data:", data);
			this.emit("line", data.asciiOnly());
		});

		this.serialPort = serialPort;
	}

	readHeader() {
		return new Promise((resolve, reject) => {
			this.serialPort.write("HEADER");

			const lines = [];
			this.removeAllListeners("line");
			this.on("line", (data) => {
				lines.push(data);
				if (lines.length === 4) {
					this.removeAllListeners("line");

					const cartridgeType = lines[1];

					resolve({
						title: lines[0],
						cartridgeType: getCartridgeType(cartridgeType),
						romSize: getRomSize(parseInt(lines[2]), cartridgeType),
						ramSize: getRamSize(parseInt(lines[3]), cartridgeType)
					});
				}
			});
		});
	}
}
