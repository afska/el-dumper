/* eslint-disable */

String.prototype.allValidCharacters = function() {
	return this.match(/[^a-z0-9áéíóúñü !\.,_-]/gim) === null;
};

String.prototype.ellipsize = function(limit) {
	return `${this.substring(0, limit)}${this.length > limit ? "…" : ""}`;
};
