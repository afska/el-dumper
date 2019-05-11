export default (romType, cartridgeType) => {
	if (romType === 0) return { text: "32KByte (no ROM banking)", bytes: 32768 };
	else if (romType === 1) return { text: "64KByte (4 banks)", bytes: 65536 };
	else if (romType === 2) return { text: "128KByte (8 banks)", bytes: 131072 };
	else if (romType === 3) return { text: "256KByte (16 banks)", bytes: 262144 };
	else if (romType === 4) return { text: "512KByte (32 banks)", bytes: 524288 };
	else if (
		romType === 5 &&
		(cartridgeType === 1 || cartridgeType === 2 || cartridgeType === 3)
	)
		return { text: "1MByte (63 banks)", bytes: 1048576 };
	else if (romType === 5) return { text: "1MByte (64 banks)", bytes: 1048576 };
	else if (
		romType === 6 &&
		(cartridgeType === 1 || cartridgeType === 2 || cartridgeType === 3)
	)
		return { text: "2MByte (125 banks)", bytes: 2097152 };
	else if (romType === 6) return { text: "2MByte (128 banks)", bytes: 2097152 };
	else if (romType === 7) return { text: "4MByte (256 banks)", bytes: 4194304 };
	else if (romType === 82)
		return { text: "1.1MByte (72 banks)", bytes: 1153434 };
	else if (romType === 83)
		return { text: "1.2MByte (80 banks)", bytes: 1258292 };
	else if (romType === 84)
		return { text: "1.5MByte (96 banks)", bytes: 1572864 };
	else return { text: "Not found", bytes: null };
};
