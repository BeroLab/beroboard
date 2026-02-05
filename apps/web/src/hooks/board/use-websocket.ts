"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useEffect, useRef, useState } from "react";
import { env } from "@blaboard/env/web";
import { boardKeys } from "./keys";
import type {
    WebSocketMessage,
    WebSocketStatus,
    TaskCreatedMessage,
    TaskUpdatedMessage,
    TaskDeletedMessage,
    TaskMovedMessage,
    ColumnCreatedMessage,
    ColumnUpdatedMessage,
    ColumnDeletedMessage,
    ColumnsReorderedMessage,
    UseWebSocketOptions
} from "~/lib/types";

export function useWebSocket({
	organizationId,
	enabled = true,
	onError = () => {},
}: UseWebSocketOptions) {
	const [status, setStatus] = useState<WebSocketStatus>("disconnected");
	const wsRef = useRef<WebSocket | null>(null);
	const queryClient = useQueryClient();
	const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const heartbeatIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
	const reconnectAttemptsRef = useRef(0);

	const onErrorRef = useRef(onError);

	useEffect(() => {
		onErrorRef.current = onError;
	}, [onError]);

	const MAX_RECONNECT_ATTEMPTS = 10;
	const BASE_RECONNECT_DELAY = 1000; 
	const MAX_RECONNECT_DELAY = 30000; 
	const HEARTBEAT_INTERVAL = 30000; 

	const getReconnectDelay = (attempt: number) => {
		const delay = Math.min(
			BASE_RECONNECT_DELAY * Math.pow(2, attempt),
			MAX_RECONNECT_DELAY,
		);
		const jitter = delay * 0.2 * (Math.random() * 2 - 1);
		return delay + jitter;
	};

	const connect = useCallback(() => {
		if (!enabled || !organizationId) return;

		if (
			wsRef.current?.readyState === WebSocket.OPEN ||
			wsRef.current?.readyState === WebSocket.CONNECTING
		) {
			return;
		}

		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
			reconnectTimeoutRef.current = null;
		}

		try {
			setStatus("connecting");

			const wsUrl = env.NEXT_PUBLIC_SERVER_URL.replace(/^http/, "ws");
			const ws = new WebSocket(`${wsUrl}/ws?orgId=${organizationId}`);

			ws.onopen = () => {
				setStatus("connected");
				reconnectAttemptsRef.current = 0;

				if (heartbeatIntervalRef.current) {
					clearInterval(heartbeatIntervalRef.current);
				}
				heartbeatIntervalRef.current = setInterval(() => {
					if (ws.readyState === WebSocket.OPEN) {
						try {
							ws.send(JSON.stringify({ type: "ping" }));
						} catch (error) {
							onErrorRef.current?.(error);
						}
					}
				}, HEARTBEAT_INTERVAL);
			};

			ws.onmessage = (event) => {
				try {
					const message: WebSocketMessage = JSON.parse(event.data);

					if (message.type === "pong") {
						return;
					}

                    switch (message.type) {
						case "task:created":
						case "task:updated":
						case "task:deleted":
						case "task:moved":
						case "column:created":
						case "column:updated":
						case "column:deleted":
						case "columns:reordered":
							queryClient.invalidateQueries({
								queryKey: boardKeys.columns(organizationId),
							});
							break;   					}
				} catch (error) {
						onErrorRef.current?.(error);
				}
			};

			ws.onerror = (error) => {
				setStatus("error");
				onErrorRef.current?.(error);
			};

			ws.onclose = () => {
				setStatus("disconnected");

				if (heartbeatIntervalRef.current) {
					clearInterval(heartbeatIntervalRef.current);
					heartbeatIntervalRef.current = null;
				}

				if (
					enabled &&
					reconnectAttemptsRef.current < MAX_RECONNECT_ATTEMPTS
				) {
					const delay = getReconnectDelay(reconnectAttemptsRef.current);
					reconnectAttemptsRef.current++;


					reconnectTimeoutRef.current = setTimeout(() => {
						connect();
					}, delay);
				}
			};

			wsRef.current = ws;
		} catch (error) {
				onErrorRef.current?.(error);
			setStatus("error");
		}
	}, [enabled, organizationId, queryClient]);

	const disconnect = useCallback(() => {
		if (reconnectTimeoutRef.current) {
			clearTimeout(reconnectTimeoutRef.current);
			reconnectTimeoutRef.current = null;
		}

		if (heartbeatIntervalRef.current) {
			clearInterval(heartbeatIntervalRef.current);
			heartbeatIntervalRef.current = null;
		}

		if (wsRef.current) {
			wsRef.current.close();
			wsRef.current = null;
		}
	}, []);

	const sendMessage = useCallback((message: WebSocketMessage) => {
		if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
			return;
		}

		try {
			const payload = JSON.stringify(message);
			if (payload.length > 100 * 1024) {
				onErrorRef.current?.(
					new Error(`Mensagem muito grande: ${payload.length} bytes`),
				);
				return;
			}
			wsRef.current.send(payload);
		} catch (error) {
			onErrorRef.current?.(error);
		}
	}, []);

	const sendTaskCreated = useCallback(
		(data: TaskCreatedMessage["data"]) => {
			sendMessage({ type: "task:created", data });
		},
		[sendMessage],
	);

	const sendTaskUpdated = useCallback(
		(data: TaskUpdatedMessage["data"]) => {
			sendMessage({ type: "task:updated", data });
		},
		[sendMessage],
	);

	const sendTaskDeleted = useCallback(
		(data: TaskDeletedMessage["data"]) => {
			sendMessage({ type: "task:deleted", data });
		},
		[sendMessage],
	);

	const sendTaskMoved = useCallback(
		(data: TaskMovedMessage["data"]) => {
			sendMessage({ type: "task:moved", data });
		},
		[sendMessage],
	);

	const sendColumnCreated = useCallback(
		(data: ColumnCreatedMessage["data"]) => {
			sendMessage({ type: "column:created", data });
		},
		[sendMessage],
	);

	const sendColumnUpdated = useCallback(
		(data: ColumnUpdatedMessage["data"]) => {
			sendMessage({ type: "column:updated", data });
		},
		[sendMessage],
	);

	const sendColumnDeleted = useCallback(
		(data: ColumnDeletedMessage["data"]) => {
			sendMessage({ type: "column:deleted", data });
		},
		[sendMessage],
	);

	const sendColumnsReordered = useCallback(
		(data: ColumnsReorderedMessage["data"]) => {
			sendMessage({ type: "columns:reordered", data });
		},
		[sendMessage],
	);

	useEffect(() => {
		if (enabled) {
			connect();
		}

		return () => {
			disconnect();
		};
	}, [enabled, connect, disconnect]);

	return {
		status,
		isConnected: status === "connected",
		sendTaskCreated,
		sendTaskUpdated,
		sendTaskDeleted,
		sendTaskMoved,
		sendColumnCreated,
		sendColumnUpdated,
		sendColumnDeleted,
		sendColumnsReordered,
		sendMessage,
		reconnect: connect,
		disconnect,
	};
}
