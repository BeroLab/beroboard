"use client";

import { GithubLogo, GoogleLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { toast } from "sonner";

import { authClient } from "~/lib/auth-client";

import Loader from "./loader";

export default function SignInForm() {
	const { isPending } = authClient.useSession();

	const handleSocialSignIn = async (provider: "google" | "github") => {
		await authClient.signIn.social(
			{
				provider,
				callbackURL: `${window.location.origin}/`,
			},
			{
				onSuccess: () => {
					toast.success("Signed in successfully");
				},
				onError: (error) => {
					toast.error(error.error.message || error.error.statusText);
				},
			},
		);
	};

	if (isPending) {
		return <Loader />;
	}

	return (
		<div className="flex w-full max-w-sm flex-col items-center gap-8">
			{/* Header */}
			<div className="flex flex-col items-center gap-2 text-center">
				<h1 className="font-semibold text-2xl text-foreground tracking-tight">
					Welcome back
				</h1>
				<p className="text-muted-foreground text-sm">
					Sign in to continue to Blaboard
				</p>
			</div>

			{/* Social Buttons */}
			<div className="flex w-full flex-col gap-3">
				<button
					type="button"
					onClick={() => handleSocialSignIn("google")}
					className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-border bg-card font-medium text-foreground text-sm transition-colors hover:bg-accent"
				>
					<GoogleLogo className="h-5 w-5" weight="bold" />
					<span>Continue with Google</span>
				</button>

				<button
					type="button"
					onClick={() => handleSocialSignIn("github")}
					className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-border bg-card font-medium text-foreground text-sm transition-colors hover:bg-accent"
				>
					<GithubLogo className="h-5 w-5" weight="bold" />
					<span>Continue with GitHub</span>
				</button>
			</div>

			{/* Footer */}
			<p className="text-muted-foreground text-sm">
				Don't have an account?{" "}
				<Link
					href="/register"
					className="font-medium text-foreground underline-offset-4 hover:underline"
				>
					Sign up
				</Link>
			</p>
		</div>
	);
}
