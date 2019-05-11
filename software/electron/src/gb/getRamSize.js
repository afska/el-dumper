export default (ramType, cartridgeType) => {
	if (ramSize == 0 && cartridgeType == 6) return "512 bytes (nibbles)";
	else if (ramSize == 0) return "None";
	else if (ramSize == 1) return "2 KBytes";
	else if (ramSize == 2) return "8 KBytes";
	else if (ramSize == 3) return "32 KBytes (4 banks of 8Kbytes)";
	else if (ramSize == 4) return "128 KBytes (16 banks of 8Kbytes)";
	else return "Not Found";
};
