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
						<strong>ROM Size:</strong> <span>{this.state.header.romSize}</span>
						<br />
						<strong>RAM Size:</strong> <span>{this.state.header.ramSize}</span>
					</div>
				)}

				{isReady && (
					<div className="section">
						<Button className="button" onClick={this.downloadGame}>
							<i className="fa fa-download" /> {strings.downloadGame}
						</Button>
						<Button className="button" onClick={this.downloadSave}>
							<i className="fa fa-download" /> {strings.downloadSave}
						</Button>
						<Button className="button" onClick={this.uploadSave}>
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

				{isWaiting && (
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
		this.setState({ error: null, progress: 0 });

		if (this.dumper) this.dumper.dispose();
		this.dumper = new Dumper(serialPort);

		setTimeout(() => {
			this.dumper
				.readHeader()
				.then((header) => {
					this.setState({ header });
				})
				.catch((e) => {
					this.setState({ error: strings.errors.badHeader });
				});
		}, INITIAL_DELAY);

		this.dumper
			.on("error", () => {
				this.setState({
					error: strings.errors.notConnected
				});
			})
			.on("progress", (progress) => {
				this.setState({ progress });
			});
	}

	downloadGame = () => {
		const lastPath = memory.get("lastDownloadGamePath", "");

		const newPath = dialog.showSaveDialog(null, {
			title: strings.downloadGame,
			defaultPath: path.join(lastPath, `${this.state.header.title}.gb`)
		});
		if (!newPath) return;

		memory.set("lastDownloadGamePath", path.dirname(newPath));
	};

	downloadSave = () => {
		const lastPath = memory.get("lastDownloadSavePath", "");

		const newPath = dialog.showSaveDialog(null, {
			title: strings.downloadSave,
			defaultPath: path.join(lastPath, `${this.state.header.title}.sav`)
		});
		if (!newPath) return;

		memory.set("lastDownloadSavePath", path.dirname(newPath));
	};

	uploadSave = () => {
		const lastPath = memory.get("lastDownloadSavePath", "");

		const newPaths = dialog.showOpenDialog(null, {
			title: strings.uploadSave,
			properties: ["openFile"],
			filters: [
				{ name: strings.gameBoySaveFiles, extensions: ["sav"] },
				{ name: strings.allFiles, extensions: ["*"] }
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
