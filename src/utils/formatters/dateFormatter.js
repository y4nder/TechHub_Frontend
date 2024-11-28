export function parseDate(dateString) {
	const date = new Date(dateString);

	// Format the date to the desired format: 'Aug 08 2024'
	const options = {
		year: 'numeric',
		month: 'short',
		day: '2-digit'
	};

	// Use Intl.DateTimeFormat for custom date formatting
	return new Intl.DateTimeFormat('en-US', options).format(date);
}


export function formatDateTimeVersion2(isoString) {
	const date = new Date(isoString);

	// Get month name
	const monthNames = [
		"January", "February", "March", "April", "May", "June",
		"July", "August", "September", "October", "November", "December"
	];
	const month = monthNames[date.getMonth()]; // Get month index and map to name

	// Get day
	const day = date.getDate();

	// Get year
	const year = date.getFullYear();

	// Format hours and minutes
	let hours = date.getHours();
	const minutes = date.getMinutes().toString().padStart(2, "0");
	const ampm = hours >= 12 ? "PM" : "AM";
	hours = hours % 12 || 12; // Convert to 12-hour format

	// Combine into desired format
	return `${month} ${day.toString().padStart(2, "0")}, ${year} ${hours}:${minutes} ${ampm}`;
}