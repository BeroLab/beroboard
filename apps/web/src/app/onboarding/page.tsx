"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import AuthLayout from "~/components/auth-layout";
import { CreateOrganizationForm } from "~/components/org";
import Loader from "~/components/loader";
import { authClient } from "~/lib/auth-client";

export default function OnboardingPage() {
	const router = useRouter();
	const { data: session, isPending: isSessionPending } =
		authClient.useSession();

	useEffect(() => {
		if (!isSessionPending && !session?.user) {
			router.push("/login");
			return;
		}
	}, [isSessionPending, session, router]);

	if (isSessionPending) {
		return <Loader />;
	}

	return (
		<AuthLayout>
			<div className="flex w-full max-w-md flex-col items-center gap-8">
				{/* Header */}
				<div className="flex flex-col items-center gap-2 text-center">
					<h1 className="font-semibold text-2xl text-foreground tracking-tight">
						Create your organization
					</h1>
					<p className="text-muted-foreground text-sm">
						Let's create a new organization!
					</p>
				</div>

				{/* Form */}
				<CreateOrganizationForm />
			</div>
		</AuthLayout>
	);
}
