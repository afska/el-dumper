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
}
