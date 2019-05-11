import React, { Component } from "react";
import { Button, FormControl } from "react-bootstrap";
import strings from "./locales/strings";

export default class Reconnect extends Component {
	render() {
		const { serialPort, onSerialPortChange, onReconnect, error } = this.props;

		return (
			<div className="centered container">
				<span className="error">{error}</span>

				<FormControl
					className="line input"
					placeholder={strings.serialPortPlaceholder}
					value={serialPort}
					onChange={(e) => {
						const serialPort = e.target.value;
						onSerialPortChange(serialPort);
					}}
				/>

				<Button className="line" onClick={onReconnect}>
					<i className="fa fa-refresh" /> {strings.tryAgain}
				</Button>
			</div>
		);
	}
}
