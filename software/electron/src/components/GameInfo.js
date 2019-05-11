import React, { Component } from "react";
import strings from "./locales/strings";

export default class GameInfo extends Component {
	render() {
		const { title, cartridgeType, romSize, ramSize } = this.props;

		return (
			<div className="section">
				<strong>{strings.info.title}</strong> <span>{title}</span>
				<br />
				<strong>{strings.info.cartridgeType}</strong>{" "}
				<span>{cartridgeType}</span>
				<br />
				<strong>{strings.info.romSize}</strong> <span>{romSize.text}</span>
				<br />
				<strong>{strings.info.ramSize}</strong> <span>{ramSize.text}</span>
			</div>
		);
	}
}
