import React, { Component } from "react";
import { Button } from "react-bootstrap";
import strings from "./locales/strings";

export default class DumpButtons extends Component {
	render() {
		const { onDownloadGame, onDownloadSave, onUploadSave, header } = this.props;

		return (
			<div className="section">
				<Button
					className="button"
					onClick={onDownloadGame}
					disabled={!header.romSize.bytes}
				>
					<i className="fa fa-download" /> {strings.downloadGame}
				</Button>
				<Button
					className="button"
					onClick={onDownloadSave}
					disabled={!header.ramSize.bytes}
				>
					<i className="fa fa-download" /> {strings.downloadSave}
				</Button>
				<Button
					className="button"
					onClick={onUploadSave}
					disabled={!header.ramSize.bytes}
				>
					<i className="fa fa-upload" /> {strings.uploadSave}
				</Button>
			</div>
		);
	}
}
