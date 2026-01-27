"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { authClient } from "~/lib/auth-client";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function CreateOrganizationForm() {
	const router = useRouter();
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [isCreating, setIsCreating] = useState(false);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim()) {
			toast.error("Organization name is required");
			return;
		}

		if (isCreating) return;

		setIsCreating(true);

		const slug = name
			.toLowerCase()
			.replace(/[^a-z0-9]+/g, "-")
			.replace(/^-+|-+$/g, "");

		const { error } = await authClient.organization.create({
			name,
			slug,
			metadata: description ? { description } : undefined,
		});

		if (error) {
			const errorMessage = error.message || "Failed to create organization";
			toast.error(errorMessage);
			setIsCreating(false);
			return;
		}

		await authClient.getSession({ fetchOptions: { cache: "no-cache" } });
		toast.success("Organization created successfully");
		setIsCreating(false);
		router.push("/");
		router.refresh();
	};

	return (
		<form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
			<div className="space-y-3">
				<Label
					htmlFor="name"
					className="text-muted-foreground text-sm font-normal"
				>
					Organization name
				</Label>
				<Input
					id="name"
					type="text"
					placeholder="Enter organization name..."
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="h-12 rounded-xl border-border bg-background px-4 text-foreground placeholder:text-muted-foreground/50"
					disabled={isCreating}
					required
				/>
			</div>

			<div className="space-y-3">
				<Label
					htmlFor="description"
					className="text-muted-foreground text-sm font-normal"
				>
					Description (optional)
				</Label>
				<Input
					id="description"
					type="text"
					placeholder="Add a description..."
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="h-12 rounded-xl border-border bg-background px-4 text-foreground placeholder:text-muted-foreground/50"
					disabled={isCreating}
				/>
			</div>

			<Button
				type="submit"
				className="h-12 w-full rounded-xl bg-foreground font-medium text-background transition-colors hover:bg-foreground/90"
				disabled={isCreating}
			>
				{isCreating ? "Creating..." : "Create organization"}
			</Button>
		</form>
	);
}
