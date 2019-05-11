import getCartridgeType from "./getCartridgeType";
import getRomSize from "./getRomSize";
import getRamSize from "./getRamSize";
import _ from "lodash";

if (!window.DESKTOP_REQUIRE) throw new Error("Missing node.js access!");
const EventEmitter = window.DESKTOP_REQUIRE("events");
const SerialPort = window.DESKTOP_REQUIRE("serialport");
const ByteLength = window.DESKTOP_REQUIRE("@serialport/parser-byte-length");

const NEWLINE = "\r\n";
const CHUNK_SIZE = 64;
const WAIT_TIME = 50;
const DEBOUNCE_TIME = 1000;
const TIMEOUT_TIME = 3000;

export default class Dumper extends EventEmitter {
	constructor(port, baudRate = 57600) {
		super();

		const serialPort = new SerialPort(port, { baudRate });
		const parser = new ByteLength({ length: CHUNK_SIZE });
		serialPort.pipe(parser);

		serialPort.on("open", () => {
			console.log("Serial Port open");
			this.emit("open");
		});

		serialPort.on("error", (e) => {
			this.emit("error", e);
		});

		parser.on("data", (data) => {
			console.log("Data:", data);
			this.emit("data", data);
		});

		this.serialPort = serialPort;
		this.parser = parser;

		window.serialPort = this.serialPort;
		window.parser = parser;
	}

	readHeader() {
		this._cleanBuffer();
		this.serialPort.write("HEADER");

		this.emit("progress", 0);
		return this._readLine().then(({ line: title, i }) => {
			this.emit("progress", 25);
			return this._readLine(i).then(({ line: cartridgeType, i }) => {
				this.emit("progress", 50);
				return this._readLine(i).then(({ line: romType, i }) => {
					this.emit("progress", 75);
					return this._readLine(i).then(({ line: ramType, i }) => {
						this.emit("progress", 100);

						return {
							title,
							cartridgeType: getCartridgeType(cartridgeType),
							romSize: getRomSize(parseInt(romType), cartridgeType),
							ramSize: getRamSize(parseInt(ramType), cartridgeType)
						};
					});
				});
			});
		});
	}

	readGame(header) {
		return this._readBinary("READROM", header.romSize.bytes);
	}

	readSave(header) {
		return this._readBinary("READRAM", header.ramSize.bytes);
	}

	writeSave(header, data) {
		return this._writeBinary("WRITERAM", header.ramSize.bytes, data);
	}

	dispose() {
		if (this.serialPort.isOpen) this.serialPort.close();
		this.serialPort.removeAllListeners();
		this.parser.removeAllListeners();
		this.removeAllListeners();
	}

	_writeBinary(instruction, totalBytes, buffer) {
		return new Promise((resolve, reject) => {
			this._cleanBuffer();
			this.serialPort.write(instruction);
			this.emit("progress", 0);

			let copiedBytes = 0;

			this._readLine()
				.then(({ line, i }) => {
					if (line !== "START") reject(new Error("Bad response"));

					const wait = (i = 0) => {
						if (i === 0) this._cleanBuffer();
						this._readLine(i)
							.then(({ line }) => {
								if (line.indexOf("END") !== -1) {
									this.emit("progress", 100);
									return resolve();
								}

								if (line.indexOf("NEXT") !== -1) {
									this.serialPort.write(
										buffer.slice(copiedBytes, copiedBytes + CHUNK_SIZE)
									);
									copiedBytes += CHUNK_SIZE;
									this.emit("progress", (copiedBytes * 100) / totalBytes);
								}

								wait();
							})
							.catch((e) => reject(e));
					};
					wait(i);
				})
				.catch((e) => reject(e));
		});
	}

	_readBinary(instruction, totalBytes) {
		return new Promise((resolve, reject) => {
			this._cleanBuffer();
			this.serialPort.write(instruction);

			this.emit("progress", 0);
			this.removeAllListeners("data");
			const buffer = Buffer.alloc(totalBytes);
			let copiedBytes = 0;

			const end = _.debounce(() => {
				if (copiedBytes < totalBytes)
					return reject(new Error("Incomplete stream"));

				this.emit("progress", 100);
				resolve(buffer);
				this.removeAllListeners("data");
			}, DEBOUNCE_TIME);

			this.on("data", (chunk) => {
				buffer.set(chunk, copiedBytes);
				copiedBytes += chunk.length;
				this.emit("progress", (copiedBytes * 100) / totalBytes);
				end();
			});
		});
	}

	_readLine(startIndex = 0) {
		return new Promise((resolve, reject) => {
			let elapsedTime = 0;

			const wait = () => {
				setTimeout(() => {
					const content = this.parser.buffer.slice(startIndex).toString();
					const endIndex = content.indexOf(NEWLINE);
					const line = content.substring(0, endIndex).asciiOnly();

					if (!_.isEmpty(line)) {
						const i = startIndex + endIndex + NEWLINE.length;
						resolve({ line, i });
					} else {
						elapsedTime += WAIT_TIME;

						if (elapsedTime > TIMEOUT_TIME)
							reject(new Error("Readline timeout"));
						else wait();
					}
				}, WAIT_TIME);
			};
			wait();
		});
	}

	_cleanBuffer() {
		this.parser.position = 0;
		this.parser.buffer.fill(0);
	}
}
