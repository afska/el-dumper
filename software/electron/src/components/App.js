import React, { Component } from "react";
import { Button, FormControl } from "react-bootstrap";
import { Line } from "rc-progress";
import Dumper from "../gb/Dumper";
import memory from "../memory";
import strings from "./locales/strings";
import _ from "lodash";
import "./App.css";
import gb from "../assets/gb.png";

if (!window.DESKTOP_REQUIRE) throw new Error("Missing node.js access!");
const dialog = window.DESKTOP_REQUIRE("electron").remote.dialog;
const path = window.DESKTOP_REQUIRE("path");
const fs = window.DESKTOP_REQUIRE("fs");

const INITIAL_DELAY = 2000;

export default class App extends Component {
	state = { header: null, error: null, serialPort: null, progress: 0 };

	render() {
		const isWaiting = this.state.progress < 100;
		const isReady = !isWaiting && this.state.header;

		return (
			<div className="centered container">
				<div className="centered section">
					<img className="logo" src={gb} alt="logo" />
					<span className="title">{strings.title}</span>
					<img className="logo" src={gb} alt="logo" />
				</div>

				{isReady && (
					<div className="section">
						<strong>Title:</strong> <span>{this.state.header.title}</span>
						<br />
						<strong>Cartridge type:</strong>{" "}
						<span>{this.state.header.cartridgeType}</span>
						<br />
						<strong>ROM Size:</strong>{" "}
						<span>{this.state.header.romSize.text}</span>
						<br />
						<strong>RAM Size:</strong>{" "}
						<span>{this.state.header.ramSize.text}</span>
					</div>
				)}

				{isReady && (
					<div className="section">
						<Button
							className="button"
							onClick={this.downloadGame}
							disabled={!this.state.header.romSize.bytes}
						>
							<i className="fa fa-download" /> {strings.downloadGame}
						</Button>
						<Button
							className="button"
							onClick={this.downloadSave}
							disabled={!this.state.header.ramSize.bytes}
						>
							<i className="fa fa-download" /> {strings.downloadSave}
						</Button>
						<Button
							className="button"
							onClick={this.uploadSave}
							disabled={!this.state.header.ramSize.bytes}
						>
							<i className="fa fa-upload" /> {strings.uploadSave}
						</Button>
					</div>
				)}

				{isWaiting && (
					<div>
						{this.state.error ? (
							<div className="centered container">
								<span className="error">{this.state.error}</span>

								<FormControl
									className="line input"
									placeholder={strings.serialPortPlaceholder}
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
									<i className="fa fa-refresh" /> {strings.tryAgain}
								</Button>
							</div>
						) : (
							<div className="centered container">
								<span>
									<i className="fa fa-spinner fa-spin" />{" "}
									{this.state.header ? strings.copying : strings.reading}
								</span>
							</div>
						)}
					</div>
				)}

				{isWaiting && !this.state.error && (
					<Line
						className="progressbar"
						percent={this.state.progress}
						strokeWidth={4}
						strokeColor="#d3d3d3"
					/>
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
		this.setState({ header: null, error: null, progress: 0 });

		if (this.dumper) this.dumper.dispose();
		if (this.$timeout) clearTimeout(this.$timeout);
		this.dumper = new Dumper(serialPort);

		const timeout = (this.$timeout = setTimeout(() => {
			this.dumper
				.readHeader()
				.then((header) => {
					this.setState({ header });
				})
				.catch((e) => {
					if (this.$timeout !== timeout) return;
					console.error("Error initializing dumper", e);
					this.setState({ error: strings.errors.badHeader });
				});
		}, INITIAL_DELAY));

		this.dumper
			.on("error", (e) => {
				console.error("Dumper error", e);
				this.setState({
					error: strings.errors.notConnected
				});
			})
			.on("progress", (progress) => {
				this.setState({ progress });
			});
	}

	downloadGame = () => {
		const savePath = this._showSaveDialog(
			strings.downloadGame,
			"lastDownloadGamePath",
			"gb"
		);

		this.dumper.readGame(this.state.header).then((buffer) => {
			fs.writeFileSync(savePath, buffer);
		});
	};

	downloadSave = () => {
		const savePath = this._showSaveDialog(
			strings.downloadSave,
			"lastDownloadSavePath",
			"sav"
		);

		this.dumper.readSave(this.state.header).then((buffer) => {
			fs.writeFileSync(savePath, buffer);
		});
	};

	uploadSave = () => {
		const loadPath = this._showLoadDialog(
			strings.uploadSave,
			"lastDownloadSavePath",
			"sav",
			strings.gameBoySaveFiles
		);

		if (!window.confirm(strings.areYouSure)) return;

		const data = fs.readFileSync(loadPath);
		this.dumper.writeSave(this.state.header, data);
	};

	get defaultSerialPort() {
		return process.platform === "win32" ? "COM1" : "/dev/ttyACM0";
	}

	_showSaveDialog(title, lastPathKey, extension) {
		const lastPath = memory.get(lastPathKey, "");

		const newPath = dialog.showSaveDialog(null, {
			title: title,
			defaultPath: path.join(
				lastPath,
				`${this.state.header.title}.${extension}`
			)
		});
		if (!newPath) return;

		memory.set(lastPathKey, path.dirname(newPath));

		return newPath;
	}

	_showLoadDialog(title, lastPathKey, extension, fileType) {
		const lastPath = memory.get(lastPathKey, "");

		const newPaths = dialog.showOpenDialog(null, {
			title: title,
			properties: ["openFile"],
			filters: [
				{ name: fileType, extensions: [extension] },
				{ name: strings.allFiles, extensions: ["*"] }
			],
			defaultPath: lastPath
		});
		if (!newPaths || _.isEmpty(newPaths)) return;
		const newPath = _.first(newPaths);

		memory.set(lastPathKey, path.dirname(newPath));

		return newPath;
	}
}
