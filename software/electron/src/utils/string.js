/* eslint-disable */

String.prototype.onlyAscii = function() {
	return this.replace(/[^\x00-\x7F]/g, "");
};
