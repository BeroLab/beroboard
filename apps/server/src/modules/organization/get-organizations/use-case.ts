import { auth } from "@blaboard/auth";

export async function getUserOrganizationsUseCase(headers: Headers) {
	const organizations = await auth.api.listOrganizations({
		headers,
	});

	return organizations.sort(
		(a, b) =>
			new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
	);
}
