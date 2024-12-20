import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";
import {getToken} from "@/utils/token/token.js";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
const notificationUrl = import.meta.env.VITE_API_NOTIFICATION_URL

const SIGNALR_URL = apiBaseUrl+"/"+notificationUrl;

class SignalRService {
	constructor() {
		this.connection = null;
	}

	// Start the connection
	startConnection() {
		this.connection = new HubConnectionBuilder()
			.withUrl(SIGNALR_URL, {
				accessTokenFactory : () => getToken()
			})
			.configureLogging(LogLevel.Information)
			.build();

		// Start the connection
		this.connection.start()
			.then(() => console.log("SignalR connection established"))
			.catch(err => console.error("Error while starting connection: ", err));
	}

	// Listen for messages from the SignalR server
	onNotificationReceived(callback) {
		if (this.connection) {
			this.connection.on("ReceiveNotification", (message) => {
				callback(message);
			});
		}
	}

	// Stop the connection when you're done
	stopConnection() {
		if (this.connection) {
			this.connection.stop().then(() => console.log("SignalR connection stopped"));
		}
	}
}

export default new SignalRService();
