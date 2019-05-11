export default (ramType, cartridgeType) => {
	if (ramType === 0 && cartridgeType === 6)
		return { text: "512 bytes (nibbles)", bytes: 512 };
	else if (ramType === 0) return { text: "None", bytes: 0 };
	else if (ramType === 1) return { text: "2 KBytes", bytes: 2048 };
	else if (ramType === 2) return { text: "8 KBytes", bytes: 8192 };
	else if (ramType === 3)
		return { text: "32 KBytes (4 banks of 8Kbytes)", bytes: 32768 };
	else if (ramType === 4)
		return { text: "128 KBytes (16 banks of 8Kbytes)", bytes: 131072 };
	else return { text: "Not Found", bytes: null };
};
