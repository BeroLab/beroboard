"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "~/lib/auth-client";
import Loader from "../loader";

interface OrgGuardProps {
	children: React.ReactNode;
	requireOrg?: boolean;
}

export default function OrgGuard({
	children,
	requireOrg = true,
}: OrgGuardProps) {
	const router = useRouter();
	const { data: session, isPending: isSessionPending } =
		authClient.useSession();
	const { data: organizations, isPending: isOrgsLoading } =
		authClient.useListOrganizations();

	const [isSettingOrg, setIsSettingOrg] = useState(false);
	const hasSetOrg = useRef(false);

	useEffect(() => {
		if (!isSessionPending && !session?.user) {
			router.push("/login");
			return;
		}
		if (!requireOrg) return;

		if (isSessionPending) return;

		if (isSettingOrg || hasSetOrg.current) return;

		const activeOrgId = session?.session?.activeOrganizationId;

		if (activeOrgId) return;

		if (isOrgsLoading) return;

		const orgs = organizations || [];

		if (orgs.length === 0) {
			router.push("/onboarding");
			return;
		}

		setIsSettingOrg(true);
		hasSetOrg.current = true;

		authClient.organization
			.setActive({ organizationId: orgs[0].id })
			.then(async () => {
				await authClient.getSession({ fetchOptions: { cache: "no-cache" } });
				setIsSettingOrg(false);
				router.refresh();
			})
			.catch(() => {
				setIsSettingOrg(false);
				hasSetOrg.current = false;
				router.push("/onboarding");
			});
	}, [
		isSessionPending,
		isOrgsLoading,
		session,
		organizations,
		router,
		requireOrg,
		isSettingOrg,
	]);

	if (isSessionPending || isSettingOrg) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader />
			</div>
		);
	}

	if (!session?.user) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader />
			</div>
		);
	}

	if (requireOrg && !session?.session?.activeOrganizationId && isOrgsLoading) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader />
			</div>
		);
	}

	if (requireOrg && !session?.session?.activeOrganizationId) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader />
			</div>
		);
	}

	return <>{children}</>;
}
