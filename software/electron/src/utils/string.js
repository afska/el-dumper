/* eslint-disable */

String.prototype.asciiOnly = function() {
	return this.replace(/[^\x00-\x7F]/g, "");
};
