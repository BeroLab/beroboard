"use client";

import { TaskBoard } from "~/components/board";
import { authClient } from "~/lib/auth-client";

export default function Home() {
  const { data: session } = authClient.useSession();

  if (!session?.user || !session?.session?.activeOrganizationId) {
    return null;
  }

  return (
    <TaskBoard
      organizationId={session.session.activeOrganizationId}
      userId={session.user.id}
    />
  );
}
