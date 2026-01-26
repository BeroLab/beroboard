"use client";

import { GithubLogo, GoogleLogo } from "@phosphor-icons/react";
import Link from "next/link";
import { toast } from "sonner";

import { authClient } from "~/lib/auth-client";

import Loader from "./loader";

export default function SignUpForm() {
	const { isPending } = authClient.useSession();

	const handleSocialSignIn = async (provider: "google" | "github") => {
		await authClient.signIn.social(
			{
				provider,
				callbackURL: `${window.location.origin}/`,
			},
			{
				onSuccess: () => {
					toast.success("Account created successfully");
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
					Create an account
				</h1>
				<p className="text-muted-foreground text-sm">
					Get started with Blaboard
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

			{/* Terms */}
			<p className="max-w-xs text-center text-muted-foreground text-xs leading-relaxed">
				By continuing, you agree to our{" "}
				<span className="cursor-pointer text-foreground underline-offset-4 hover:underline">
					Terms of Service
				</span>{" "}
				and{" "}
				<span className="cursor-pointer text-foreground underline-offset-4 hover:underline">
					Privacy Policy
				</span>
			</p>

			{/* Footer */}
			<p className="text-muted-foreground text-sm">
				Already have an account?{" "}
				<Link
					href="/login"
					className="font-medium text-foreground underline-offset-4 hover:underline"
				>
					Sign in
				</Link>
			</p>
		</div>
	);
}
