import {getAllNotifications} from "@/utils/http/users.js";
import {useQuery} from "@tanstack/react-query";
import {IoNotifications} from "react-icons/io5";
import {useNavigate} from "react-router-dom";

export default function NotificationsPage() {
	const {data: notifications, isPending: isPendingNotifications} = useQuery({
		queryKey: ['notifications'],
		queryFn: getAllNotifications,
	})
	
	const navigate = useNavigate()

	if(isPendingNotifications) {
		return <p>Fetching notifications</p>
	}

	return(
		<div className="gradient-bg-light justify-center items-center  flex">
			<div className="container bg-surface-50 max-w-2xl h-full pb-8">
				<div className="py-4 px-8 border-b border-gray-200 mb-2">
					<h1 className="font-bold gradient-text-reversed">Notifications</h1>
				</div>
				{!isPendingNotifications && notifications.length > 0 && (
					notifications.map((notification, index) => (
						<NotificationItem key={index} notification={notification} />
					))
				)}
			</div>
		</div>
	)

	function NotificationItem({ notification }) {
		const parsedNotification = JSON.parse(notification.notificationDto);
		return (
			<div className="border-b p-2 px-8 space-y-3 hover:bg-lightPurple-10" onClick={() => navigate(`/articles/${parsedNotification.PreviewId}`)}>
				<div className="header flex gap-3 ">
					<div
						className={ `
                      bg-lightPurple-50
                      text-lightPurple-500
                      px-2 
                      rounded-[15px]
                      flex items-center justify-center
                      hover:bg-lightPurple-200   transition-all duration-300
                ` }
					>
						<IoNotifications size={ 28 } className={ `hover:scale-110 transition-all duration-200` }/>
					</div>
					<img
						src={ parsedNotification.NotificationSubject.SubjectProfilePic }
						alt=""
						className="w-10 h-10 rounded-full object-cover"
					/>
				</div>
				<div className="details">
					<p className="text-md"><span
						className="font-bold">{ parsedNotification.NotificationSubject.SubjectName }</span>
						<span>{ parsedNotification.Action }</span> <span
							className="font-bold">{ parsedNotification.NotificationObject.Title }</span></p>
				</div>
				<div className="content flex items-center gap-3 border px-3 py-1 rounded-2xl">
					<img
						src={ parsedNotification.PreviewImageUrl }
						alt=""
						className="w-36  rounded-2xl object-cover "
					/>
					<p className="font-bold text-md">{ parsedNotification.SubDetails}</p>
				</div>

			</div>
		);
	}
}