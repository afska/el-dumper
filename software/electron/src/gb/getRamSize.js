export default (ramType, cartridgeType) => {
	if (ramType === 0 && cartridgeType === 6) return "512 bytes (nibbles)";
	else if (ramType === 0) return "None";
	else if (ramType === 1) return "2 KBytes";
	else if (ramType === 2) return "8 KBytes";
	else if (ramType === 3) return "32 KBytes (4 banks of 8Kbytes)";
	else if (ramType === 4) return "128 KBytes (16 banks of 8Kbytes)";
	else return "Not Found";
};
