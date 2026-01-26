"use client";

import AuthLayout from "~/components/auth-layout";
import SignUpForm from "~/components/sign-up-form";

export default function RegisterPage() {
	return (
		<AuthLayout>
			<SignUpForm />
		</AuthLayout>
	);
}
