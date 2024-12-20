import { IoNotifications } from 'react-icons/io5';

function NotificationItemToast({ parsedNotification }) {
	return (
		<div className="toast-container flex items-center gap-3 p-3 bg-white shadow-lg rounded-lg space-x-3 max-w-xs w-full">
			<div
				className={`
                    bg-lightPurple-50
                    text-lightPurple-500
                    px-2
                    rounded-full
                    flex items-center justify-center
                    hover:bg-lightPurple-200 transition-all duration-300
                `}
			>
				<IoNotifications size={28} className="hover:scale-110 transition-all duration-200" />
			</div>
			<div className="toast-content flex-grow">
				<p
					className="font-bold text-sm"
					style={{ cursor: 'pointer' }}
				>
					{parsedNotification.NotificationSubject.SubjectName}
				</p>
				<p className="text-xs text-gray-500">{parsedNotification.Action} <span className="font-semibold">{parsedNotification.NotificationObject.Title}</span></p>
				<p className="text-xs mt-1">{parsedNotification.SubDetails}</p>
			</div>
			<img
				src={parsedNotification.NotificationSubject.SubjectProfilePic}
				alt="User Profile"
				className="w-8 h-8 rounded-full object-cover"
			/>
		</div>
	);
}

export default NotificationItemToast;
