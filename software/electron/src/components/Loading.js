import React, { Component } from "react";
import strings from "./locales/strings";

export default class Loading extends Component {
	render() {
		const { hasHeader } = this.props;

		return (
			<div className="centered container">
				<span>
					<i className="fa fa-spinner fa-spin" />{" "}
					{hasHeader ? strings.copying : strings.reading}
				</span>
			</div>
		);
	}
}
