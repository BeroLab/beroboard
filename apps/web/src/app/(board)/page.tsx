"use client";

import { TaskBoard } from "~/components/board";
import { OrgGuard } from "~/components/org";
import { authClient } from "~/lib/auth-client";

export default function Home() {
	const { data: session } = authClient.useSession();

	return (
		<OrgGuard>
			{session?.user && session?.session?.activeOrganizationId && (
				<TaskBoard
					organizationId={session.session.activeOrganizationId}
					userId={session.user.id}
				/>
			)}
		</OrgGuard>
	);
}
