export default {
	get(key, defaultValue = null) {
		try {
			const json = this._readData();
			return json[key];
		} catch (e) {
			return defaultValue;
		}
	},

	set(key, value) {
		try {
			const data = this._readData();
			data[key] = value;
			this._writeData(data);
		} catch (e) {
			this._writeData({ [key]: value });
		}
	},

	_readData() {
		return JSON.parse(
			window.DESKTOP_REQUIRE("fs").readFileSync(this._getFilePath(), "utf-8")
		);
	},

	_writeData(data) {
		try {
			const fs = window.DESKTOP_REQUIRE("fs");
			fs.writeFileSync(this._getFilePath(), JSON.stringify(data));
		} catch (e) {}
	},

	_getFilePath() {
		const appDataPath = window
			.DESKTOP_REQUIRE("electron")
			.remote.app.getPath("appData");

		return `${appDataPath}/eldumper.json`;
	}
};
