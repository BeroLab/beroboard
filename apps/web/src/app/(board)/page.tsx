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

	const organizationId = session.user.id;

	return <TaskBoard organizationId={organizationId} userId={session.user.id} />;
}
