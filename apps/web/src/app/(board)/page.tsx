"use client";

import { TaskBoard } from "~/components/board";
import { authClient } from "~/lib/auth-client";

export default function Home() {
	const { data: session, isPending } = authClient.useSession();

	if (isPending) {
		return (
			<div className="flex h-screen items-center justify-center bg-[#0B0B0E]">
				<div className="text-[#6B6B70]">Loading...</div>
			</div>
		);
	}

	if (!session?.user) {
		return (
			<div className="flex h-screen items-center justify-center bg-[#0B0B0E]">
				<div className="text-[#6B6B70]">Please log in to view the board.</div>
			</div>
		);
	}

	// TODO: Get organizationId from user's current organization
	// For now, use a placeholder that will need to be replaced with actual org selection
	const organizationId = session.user.id; // Temporary: using user ID as org ID

	return <TaskBoard organizationId={organizationId} userId={session.user.id} />;
}
