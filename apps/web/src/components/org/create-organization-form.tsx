"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useCreateOrganization, useSetActiveOrganization } from "~/hooks/org";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";

export default function CreateOrganizationForm() {
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const createOrganization = useCreateOrganization();
	const setActiveOrganization = useSetActiveOrganization();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!name.trim()) {
			toast.error("Organization name is required");
			return;
		}

		createOrganization.mutate(
			{ name, description },
			{
				onSuccess: async (newOrg) => {
					toast.success("Organization created successfully");

					setActiveOrganization.mutate(newOrg.id, {
						onSuccess: () => {
							window.location.href = "/";
						},
						onError: () => {
							toast.error("Failed to activate organization");
							window.location.href = "/";
						},
					});
				},
				onError: (error) => {
					toast.error(error.message || "Failed to create organization");
				},
			},
		);
	};

	return (
		<form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
			<div className="space-y-2">
				<Label htmlFor="name" className="text-foreground">
					Organization Name
				</Label>
				<Input
					id="name"
					type="text"
					placeholder="Acme Inc."
					value={name}
					onChange={(e) => setName(e.target.value)}
					className="w-full"
					disabled={createOrganization.isPending}
					required
				/>
			</div>

			<div className="space-y-2">
				<Label htmlFor="description" className="text-foreground">
					Description (optional)
				</Label>
				<Input
					id="description"
					type="text"
					placeholder="A brief description of your organization"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					className="w-full"
					disabled={createOrganization.isPending}
				/>
			</div>

			<Button
				type="submit"
				className="w-full"
				disabled={createOrganization.isPending}
			>
				{createOrganization.isPending ? "Creating..." : "Create Organization"}
			</Button>
		</form>
	);
}
