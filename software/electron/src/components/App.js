import React, { Component } from "react";
import Dumper from "../gb/Dumper";
import "./App.css";
import gb from "../assets/gb.png";

const INITIAL_DELAY = 2000;

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
		this.dumper = new Dumper();

		setTimeout(() => {
			this.dumper.readHeader().then((header) => {
				console.log("HEADER", header);
			});
		}, INITIAL_DELAY);
	}
}
