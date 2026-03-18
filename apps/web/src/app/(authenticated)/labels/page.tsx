"use client";

import { LabelsTable } from "~/components/labels/labels-table";
import { authClient } from "~/lib/auth-client";

export default function LabelsPage() {
	const { data: session } = authClient.useSession();

	if (!session?.user || !session?.session?.activeOrganizationId) {
    return null;
  }
	
	return (
		<LabelsTable organizationId={session.session.activeOrganizationId} />
	);
}
