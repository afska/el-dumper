import React, { Component } from "react";
import Dumper from "../gb/Dumper";
import "./App.css";
import gb from "../assets/gb.png";

const INITIAL_DELAY = 2000;

export default class App extends Component {
	state = { header: null, error: null };

	render() {
		return (
			<div className="centered container">
				<div className="centered section">
					<img className="logo" src={gb} alt="logo" />
					<span className="title">ElDumper</span>
					<img className="logo" src={gb} alt="logo" />
				</div>

				{!this.state.header && (
					<div className="centered section">
						{this.state.error ? (
							<span className="error">{this.state.error}</span>
						) : (
							<span>Reading...</span>
						)}
					</div>
				)}

				{this.state.header && (
					<div>
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
			</div>
		);
	}

	componentWillMount() {
		this.initializeDumper();
	}

	initializeDumper() {
		this.dumper = new Dumper();

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
