import React, { Component } from "react";
import { Button, FormControl } from "react-bootstrap";
import Dumper from "../gb/Dumper";
import memory from "../memory";
import _ from "lodash";
import "./App.css";
import gb from "../assets/gb.png";

if (!window.DESKTOP_REQUIRE) throw new Error("Missing node.js access!");
const dialog = window.DESKTOP_REQUIRE("electron").remote.dialog;
const path = window.DESKTOP_REQUIRE("path");

const INITIAL_DELAY = 2000;

export default class App extends Component {
	state = { header: null, error: null, serialPort: null };

	render() {
		return (
			<div className="centered container">
				<div className="centered section">
					<img className="logo" src={gb} alt="logo" />
					<span className="title">ElDumper</span>
					<img className="logo" src={gb} alt="logo" />
				</div>

				{!this.state.header && (
					<div>
						{this.state.error ? (
							<div className="centered container">
								<span className="error">{this.state.error}</span>

								<FormControl
									className="line input"
									placeholder="Serial port (e.g. COM1 or /dev/ttyACM0)"
									value={this.state.serialPort}
									onChange={(e) => {
										const serialPort = e.target.value;
										this.setState({ serialPort });
										memory.set("serialPort", serialPort);
									}}
								/>

								<Button
									className="line"
									onClick={() => {
										this.initializeDumper(this.state.serialPort);
									}}
								>
									<i className="fa fa-refresh" /> Try again
								</Button>
							</div>
						) : (
							<div className="centered container">
								<span>Reading...</span>
							</div>
						)}
					</div>
				)}

				{this.state.header && (
					<div className="section">
						<strong>Title:</strong> <span>{this.state.header.title}</span>
						<br />
						<strong>Cartridge type:</strong>{" "}
						<span>{this.state.header.cartridgeType}</span>
						<br />
						<strong>ROM Size:</strong> <span>{this.state.header.romSize}</span>
						<br />
						<strong>RAM Size:</strong> <span>{this.state.header.ramSize}</span>
					</div>
				)}

				{this.state.header && (
					<div className="section">
						<Button className="button" onClick={this.downloadGame}>
							<i className="fa fa-download" /> Download game
						</Button>
						<Button className="button" onClick={this.downloadSave}>
							<i className="fa fa-download" /> Download save
						</Button>
						<Button className="button" onClick={this.uploadSave}>
							<i className="fa fa-upload" /> Upload save
						</Button>
					</div>
				)}
			</div>
		);
	}

	componentWillMount() {
		const serialPort = memory.get("serialPort", this.defaultSerialPort);
		this.initializeDumper(serialPort);
		this.setState({ serialPort });
	}

	initializeDumper(serialPort) {
		this.setState({ error: null });

		this.dumper = new Dumper(serialPort);

		setTimeout(() => {
			this.dumper
				.readHeader()
				.then((header) => {
					this.setState({ header });
				})
				.catch((e) => {
					this.setState({ error: "Error reading header :(" });
				});
		}, INITIAL_DELAY);

		this.dumper.on("error", () => {
			this.setState({
				error: "The device is not connected. Try with another serial port!"
			});
		});
	}

	downloadGame = () => {
		const lastPath = memory.get("lastDownloadGamePath", "");

		const newPath = dialog.showSaveDialog(null, {
			title: "Download game",
			defaultPath: path.join(lastPath, `${this.state.header.title}.gb`)
		});
		if (!newPath) return;

		memory.set("lastDownloadGamePath", path.dirname(newPath));
	};

	downloadSave = () => {
		const lastPath = memory.get("lastDownloadSavePath", "");

		const newPath = dialog.showSaveDialog(null, {
			title: "Download save",
			defaultPath: path.join(lastPath, `${this.state.header.title}.sav`)
		});
		if (!newPath) return;

		memory.set("lastDownloadSavePath", path.dirname(newPath));
	};

	uploadSave = () => {
		const lastPath = memory.get("lastDownloadSavePath", "");

		const newPaths = dialog.showOpenDialog(null, {
			title: "Upload save",
			properties: ["openFile"],
			filters: [
				{ name: "Gameboy save file (.sav)", extensions: ["sav"] },
				{ name: "All files", extensions: ["*"] }
			],
			defaultPath: lastPath
		});
		if (!newPaths || _.isEmpty(newPaths)) return;
		const newPath = _.first(newPaths);

		memory.set("lastUploadSavePath", path.dirname(newPath));
	};

	get defaultSerialPort() {
		return process.platform === "win32" ? "COM1" : "/dev/ttyACM0";
	}
}
