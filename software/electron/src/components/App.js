import React, { Component } from "react";
import { Button, FormControl } from "react-bootstrap";
import Dumper from "../gb/Dumper";
import memory from "../memory";
import "./App.css";
import gb from "../assets/gb.png";

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
									className="line"
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
									variant="primary"
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
						<Button className="button" variant="primary">
							<i className="fa fa-download" /> Download game
						</Button>
						<Button className="button" variant="primary">
							<i className="fa fa-download" /> Download save
						</Button>
						<Button className="button" variant="primary">
							<i className="fa fa-upload" /> Upload save
						</Button>
					</div>
				)}
			</div>
		);
	}

	componentWillMount() {
		const serialPort = memory.get("serialPort", "/dev/ttyACM0");
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
}
