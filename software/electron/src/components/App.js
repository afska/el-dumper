import React, { Component } from "react";
import "./App.css";
import gb from "../assets/gb.png";

export default class App extends Component {
	render() {
		return (
			<div className="centered container">
				<div className="centered section">
					<img className="logo" src={gb} alt="logo" />
					<span className="title">Dumper</span>
					<img className="logo" src={gb} alt="logo" />
				</div>

				<div className="centered section">...</div>
			</div>
		);
	}

	componentWillMount() {
		const SerialPort = window.DESKTOP_REQUIRE("serialport");
		const Readline = window.DESKTOP_REQUIRE("@serialport/parser-readline");

		const port = new SerialPort("/dev/ttyACM0", { baudRate: 57600 });
		const parser = new Readline();
		port.pipe(parser);

		port.on("open", () => {
			console.log("serial port open");

			port.write("HEADER");
		});

		parser.on("data", (data) => {
			console.log("got word from arduino:", data);
		});

		window.port = port;
		window.parser = parser;
	}
}
