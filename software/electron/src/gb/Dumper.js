import getCartridgeType from "./getCartridgeType";
import getRomSize from "./getRomSize";
import getRamSize from "./getRamSize";
import _ from "lodash";

if (!window.DESKTOP_REQUIRE) throw new Error("Missing node.js access!");
const EventEmitter = window.DESKTOP_REQUIRE("events");
const SerialPort = window.DESKTOP_REQUIRE("serialport");
const ByteLength = window.DESKTOP_REQUIRE("@serialport/parser-byte-length");

const NEWLINE = "\r\n";
const WAIT = 500;

export default class Dumper extends EventEmitter {
	constructor(port, baudRate = 57600) {
		super();

		const serialPort = new SerialPort(port, { baudRate });
		const parser = new ByteLength({ length: 64 });
		serialPort.pipe(parser);

		serialPort.on("open", () => {
			console.info("Serial Port open");
			this.emit("open");
		});

		serialPort.on("error", (e) => {
			this.emit("error", e);
		});

		parser.on("data", (data) => {
			console.info("Data:", data);
			this.emit("data", data);
		});

		this.serialPort = serialPort;
		this.parser = parser;

		window.serialPort = this.serialPort;
		window.parser = parser;
	}

	readHeader() {
		return new Promise((resolve, reject) => {
			this._cleanBuffer();
			this.serialPort.write("HEADER");

			this.emit("progress", 0);
			this._readLine().then(({ line: title, i }) => {
				this.emit("progress", 25);
				this._readLine(i).then(({ line: cartridgeType, i }) => {
					this.emit("progress", 50);
					this._readLine(i).then(({ line: romType, i }) => {
						this.emit("progress", 75);
						this._readLine(i).then(({ line: ramType, i }) => {
							this.emit("progress", 100);

							resolve({
								title,
								cartridgeType: getCartridgeType(cartridgeType),
								romSize: getRomSize(parseInt(romType), cartridgeType),
								ramSize: getRamSize(parseInt(ramType), cartridgeType)
							});
						});
					});
				});
			});
		});
	}

	dispose() {
		this.serialPort.removeAllListeners();
		this.parser.removeAllListeners();
		this.removeAllListeners();
	}

	_readLine(startIndex = 0) {
		return new Promise((resolve) => {
			const wait = () => {
				setTimeout(() => {
					const content = this.parser.buffer.slice(startIndex).toString();
					const endIndex = content.indexOf(NEWLINE);
					const line = content.substring(0, endIndex).asciiOnly();

					if (!_.isEmpty(line)) {
						const i = startIndex + endIndex + NEWLINE.length;
						resolve({ line, i });
					} else wait();
				}, WAIT);
			};
			wait();
		});
	}

	_cleanBuffer() {
		this.parser.position = 0;
		this.parser.buffer.fill(0);
	}
}
