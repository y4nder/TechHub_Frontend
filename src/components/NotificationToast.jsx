import NotificationItemToast from "@/components/NotificationItemToast.jsx";

export default function NotificationToast({ notification }) {
	let parsedNotification;
	try {
		parsedNotification = JSON.parse(notification);
	} catch (error) {
		// If parsing fails, treat it as a plain string
		parsedNotification = notification
		return (
			<div className="p-4 bg-yellow-100 text-yellow-800 border-l-4 border-yellow-600 rounded-md shadow-md">
				<p>{parsedNotification}</p>
			</div>
		);
	}



	return (
		<NotificationItemToast parsedNotification={parsedNotification} />
	);
}
