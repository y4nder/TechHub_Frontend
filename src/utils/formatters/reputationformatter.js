export function formatNumberToK(number) {
	if (number >= 1000) {
		const formattedNumber = (number / 1000).toFixed(1); // Divide by 1000 and round to 1 decimal place
		return `${formattedNumber}k`;
	}
	return number.toString(); // If less than 1000, return the number as is
}