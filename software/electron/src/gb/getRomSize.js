export default (romType, cartridgeType) => {
	if (romType === 0) return "32KByte (no ROM banking)";
	else if (romType === 1) return "64KByte (4 banks)";
	else if (romType === 2) return "128KByte (8 banks)";
	else if (romType === 3) return "256KByte (16 banks)";
	else if (romType === 4) return "512KByte (32 banks)";
	else if (
		romType === 5 &&
		(cartridgeType === 1 || cartridgeType === 2 || cartridgeType === 3)
	)
		return "1MByte (63 banks)";
	else if (romType === 5) return "1MByte (64 banks)";
	else if (
		romType === 6 &&
		(cartridgeType === 1 || cartridgeType === 2 || cartridgeType === 3)
	)
		return "2MByte (125 banks)";
	else if (romType === 6) return "2MByte (128 banks)";
	else if (romType === 7) return "4MByte (256 banks)";
	else if (romType === 82) return "1.1MByte (72 banks)";
	else if (romType === 83) return "1.2MByte (80 banks)";
	else if (romType === 84) return "1.5MByte (96 banks)";
	else return "Not found";
};
