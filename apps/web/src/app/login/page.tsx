"use client";

import AuthLayout from "~/components/auth-layout";
import SignInForm from "~/components/sign-in-form";

export default function LoginPage() {
	return (
		<AuthLayout>
			<SignInForm />
		</AuthLayout>
	);
}
