import React, { Component } from "react";
import Title from "./Title";
import GameInfo from "./GameInfo";
import DumpButtons from "./DumpButtons";
import Loading from "./Loading";
import ProgressBar from "./ProgressBar";
import Reconnect from "./Reconnect";
import Dumper from "../gb/Dumper";
import memory from "../memory";
import strings from "./locales/strings";
import _ from "lodash";
import "./App.css";

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
				<Title />

				{isReady && <GameInfo {...this.state.header} />}

				{isReady && (
					<DumpButtons
						onDownloadGame={this.downloadGame}
						onDownloadSave={this.downloadSave}
						onUploadSave={this.uploadSave}
						header={this.state.header}
					/>
				)}

				{isWaiting && (
					<div>
						{this.state.error ? (
							<Reconnect
								serialPort={this.state.serialPort}
								onSerialPortChange={(serialPort) => {
									this.setState({ serialPort });
									memory.set("serialPort", serialPort);
								}}
								onReconnect={() => {
									this.initializeDumper(this.state.serialPort);
								}}
								error={this.state.error}
							/>
						) : (
							<Loading hasHeader={!!this.state.header} />
						)}
					</div>
				)}

				{isWaiting && !this.state.error && (
					<ProgressBar progress={this.state.progress} />
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
					this.setState({ error: strings.errors.readError });
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

		if (!savePath) return;

		this.dumper
			.readGame(this.state.header)
			.then((buffer) => {
				fs.writeFileSync(savePath, buffer);
			})
			.catch((e) => {
				console.error("Error downloading game", e);
				this.setState({ error: strings.errors.readError });
			});
	};

	downloadSave = () => {
		const savePath = this._showSaveDialog(
			strings.downloadSave,
			"lastDownloadSavePath",
			"sav"
		);

		if (!savePath) return;

		this.dumper
			.readSave(this.state.header)
			.then((buffer) => {
				fs.writeFileSync(savePath, buffer);
			})
			.catch((e) => {
				console.error("Error downloading save", e);
				this.setState({ error: strings.errors.readError });
			});
	};

	uploadSave = () => {
		const loadPath = this._showLoadDialog(
			strings.uploadSave,
			"lastDownloadSavePath",
			"sav",
			strings.gameBoySaveFiles
		);

		if (!loadPath) return;
		if (!window.confirm(strings.areYouSure)) return;

		const data = fs.readFileSync(loadPath);
		this.dumper.writeSave(this.state.header, data).catch((e) => {
			console.error("Error uploading save", e);
			this.setState({ error: strings.errors.writeError });
		});
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
