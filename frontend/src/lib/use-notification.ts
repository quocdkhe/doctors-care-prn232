import { useEffect, useRef } from "react";
import { AppointmentItem } from "../types/appointment";

export function useNotifications(
	onNotification: (notification: AppointmentItem) => void,
	doctorId: string | undefined
) {
	const eventSourceRef = useRef<EventSource | null>(null);
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	useEffect(() => {
		if (!doctorId) return;

		eventSourceRef.current = new EventSource(`${apiUrl}/api/notification/stream/${doctorId}`);

		eventSourceRef.current.onmessage = (event) => {
			const notification: AppointmentItem = JSON.parse(event.data);
			console.log(notification);
			onNotification(notification);
		};

		eventSourceRef.current.onerror = () => {
			console.warn("SSE connection lost, reconnecting...");
		};

		return () => {
			eventSourceRef.current?.close();
		};
	}, [doctorId, onNotification]);
}