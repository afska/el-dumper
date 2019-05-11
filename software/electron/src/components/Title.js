import React, { Component } from "react";
import strings from "./locales/strings";
import gb from "../assets/gb.png";

export default class Title extends Component {
	render() {
		return (
			<div className="centered section">
				<img className="logo" src={gb} alt="logo" />
				<span className="title">{strings.title}</span>
				<img className="logo" src={gb} alt="logo" />
			</div>
		);
	}
}
