"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { authClient } from "~/lib/auth-client";
import { useOrganizations, useSetActiveOrganization } from "~/hooks/org";
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
	const { data: organizations = [], isLoading: isOrgsLoading } =
		useOrganizations();
	const setActiveOrganization = useSetActiveOrganization();
	const [isSettingOrg, setIsSettingOrg] = useState(false);

	useEffect(() => {
		if (!isSessionPending && !session?.user) {
			router.push("/login");
			return;
		}

		if (
			requireOrg &&
			!isSessionPending &&
			!isOrgsLoading &&
			session?.user &&
			!session?.session?.activeOrganizationId
		) {
			if (organizations.length > 0 && !isSettingOrg) {
				setIsSettingOrg(true);
				setActiveOrganization.mutate(organizations[0].id, {
					onSuccess: () => {
						setIsSettingOrg(false);
						router.refresh();
					},
					onError: () => {
						setIsSettingOrg(false);
						router.push("/onboarding");
					},
				});
			} else if (organizations.length === 0 && !isSettingOrg) {
				router.push("/onboarding");
			}
		}

		if (
			requireOrg &&
			!isSessionPending &&
			!isOrgsLoading &&
			session?.session?.activeOrganizationId &&
			organizations.length > 0
		) {
			const activeOrgExists = organizations.some(
				(org) => org.id === session.session.activeOrganizationId,
			);

			if (!activeOrgExists && !isSettingOrg) {
				setIsSettingOrg(true);
				setActiveOrganization.mutate(organizations[0].id, {
					onSuccess: () => {
						setIsSettingOrg(false);
						router.refresh();
					},
					onError: () => {
						setIsSettingOrg(false);
						router.push("/onboarding");
					},
				});
			}
		}
	}, [
		isSessionPending,
		isOrgsLoading,
		session,
		router,
		requireOrg,
		organizations,
		setActiveOrganization,
		isSettingOrg,
	]);

	if (isSessionPending || isOrgsLoading || isSettingOrg) {
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

	if (requireOrg && !session?.session?.activeOrganizationId) {
		return (
			<div className="flex h-screen items-center justify-center">
				<Loader />
			</div>
		);
	}

	return <>{children}</>;
}
