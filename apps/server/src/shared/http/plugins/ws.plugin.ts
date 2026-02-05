import { auth } from "@blaboard/auth";
import { Elysia, t } from "elysia";

type WsClient = {
	readyState: number;
	send: (data: string) => void;
};

const orgClients: Map<string, Map<string, WsClient>> = new Map();
const MAX_MESSAGE_SIZE = 1024 * 100; 

function broadcastToOrg(orgId: string, message: unknown, excludeWsId?: string) {
	const clients = orgClients.get(orgId);
	if (!clients) return;

	const messageStr = JSON.stringify(message);
	
	if (messageStr.length > MAX_MESSAGE_SIZE) {
		return;
	}

	for (const [wsId, ws] of clients.entries()) {
		if (wsId !== excludeWsId && ws.readyState === 1) {
			ws.send(messageStr);
		}
	}
}

function addClientToOrg(orgId: string, wsId: string, ws: WsClient) {
	if (!orgClients.has(orgId)) {
		orgClients.set(orgId, new Map());
	}
	orgClients.get(orgId)?.set(wsId, ws);
}

function removeClientFromOrg(orgId: string, wsId: string) {
	const clients = orgClients.get(orgId);
	if (!clients) return;

	clients.delete(wsId);

	if (clients.size === 0) {
		orgClients.delete(orgId);
	}
}

export const wsPlugin = new Elysia({ name: "ws" })
	.ws("/ws", {
		body: t.Union([
			t.Object({
				type: t.Literal("task:created"),
				data: t.Object({
					taskId: t.String(),
					columnId: t.String(),
					title: t.String(),
				}),
			}),
			t.Object({
				type: t.Literal("task:updated"),
				data: t.Object({
					taskId: t.String(),
				}),
			}),
			t.Object({
				type: t.Literal("task:deleted"),
				data: t.Object({
					taskId: t.String(),
				}),
			}),
			t.Object({
				type: t.Literal("task:moved"),
				data: t.Object({
					taskId: t.String(),
					columnId: t.String(),
					order: t.Number(),
				}),
			}),
			t.Object({
				type: t.Literal("column:created"),
				data: t.Object({
					columnId: t.String(),
					name: t.String(),
				}),
			}),
			t.Object({
				type: t.Literal("column:updated"),
				data: t.Object({
					columnId: t.String(),
				}),
			}),
			t.Object({
				type: t.Literal("column:deleted"),
				data: t.Object({
					columnId: t.String(),
				}),
			}),
			t.Object({
				type: t.Literal("columns:reordered"),
				data: t.Object({
					columns: t.Array(
						t.Object({
							id: t.String(),
							order: t.Number(),
						}),
					),
				}),
			}),
			t.Object({
				type: t.Literal("ping"),
			}),
			t.Object({
				type: t.Literal("pong"),
			}),
		]),
		query: t.Object({
			orgId: t.String(),
		}),
		async open(ws) {
			const requestedOrgId = ws.data.query.orgId;

			const headers = new Headers();
			for (const [key, value] of Object.entries(ws.data.headers)) {
				if (value) headers.set(key, value);
			}
			const session = await auth.api.getSession({ headers });

			if (!session) {
				ws.close(1008, "Unauthorized");
				return;
			}

			const activeOrganizationId = session.session.activeOrganizationId;
			if (typeof activeOrganizationId !== "string") {
				ws.close(1008, "Organization required");
				return;
			}

			if (requestedOrgId !== activeOrganizationId) {
				ws.close(1008, "Forbidden");
				return;
			}

			addClientToOrg(activeOrganizationId, ws.id, ws.raw);
		},
		message(ws, message) {
			const orgId = ws.data.query.orgId;

			if (message.type === "ping") {
				if (ws.raw.readyState === 1) {
					ws.raw.send(JSON.stringify({ type: "pong" }));
				}
				return;
			}

			if (message.type === "pong") return;

			broadcastToOrg(orgId, message, ws.id);
		},
		close(ws) {
			const orgId = ws.data.query.orgId;
			removeClientFromOrg(orgId, ws.id);
		},
	});