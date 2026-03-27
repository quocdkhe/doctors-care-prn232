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

export function useUserNotifications(
	onNotification: (appointmentId: string) => void,
	userId: string | undefined
) {
	const eventSourceRef = useRef<EventSource | null>(null);
	const apiUrl = process.env.NEXT_PUBLIC_API_URL;
	useEffect(() => {
		if (!userId) return;

		eventSourceRef.current = new EventSource(`${apiUrl}/api/notification/stream/user/${userId}`);

		eventSourceRef.current.onmessage = (event) => {
			const appointmentId: string = JSON.parse(event.data);
			onNotification(appointmentId);
		};

		eventSourceRef.current.onerror = () => {
			console.warn("SSE user connection lost, reconnecting...");
		};

		return () => {
			eventSourceRef.current?.close();
		};
	}, [userId, onNotification]);
}
