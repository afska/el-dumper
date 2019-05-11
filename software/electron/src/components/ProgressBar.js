import React, { Component } from "react";
import { Line } from "rc-progress";

export default class ProgressBar extends Component {
	render() {
		const { progress } = this.props;

		return (
			<Line
				className="progressbar"
				percent={progress}
				strokeWidth={4}
				strokeColor="#d3d3d3"
			/>
		);
	}
}
