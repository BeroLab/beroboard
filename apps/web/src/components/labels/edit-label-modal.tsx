import { XIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { type Color, parseColor } from "react-aria-components";
import type { TaskLabel, UpdateLabelInput } from "~/lib/types";
import { HexPicker } from "../hex-picker";
import { Button } from "../ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";

interface EditLabelModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (id: string, input: UpdateLabelInput) => Promise<void>;
	label: TaskLabel | null;
}

export function EditLabelModal({
	isOpen,
	onClose,
	onSubmit,
	label,
}: EditLabelModalProps) {
	const [isEditing, setIsEditing] = useState(false);
	const [labelText, setLabelText] = useState("");
	const [color, setColor] = useState<Color>(parseColor("#ff0000"));

	useEffect(() => {
		if (label) {
			setLabelText(label.text);
			setColor(parseColor(label.color));
		}
	}, [label]);

	const handleUpdate = async () => {
		if (!label) return;

		setIsEditing(true);

		try {
			await onSubmit(label.id, {
				text: labelText,
				color: color.toString("hex"),
			});
			onClose();
		} finally {
			setIsEditing(false);
		}
	};

	if (!label) {
		return null;
	}

	const hasChanged =
		labelText !== label.text || color.toString("hex") !== label.color;

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
			<DialogContent
				showCloseButton={false}
				className="w-120 max-w-120 gap-0 rounded-xl border border-border bg-card p-0 sm:max-w-120"
			>
				<DialogHeader className="flex-row items-center justify-between border-border border-b px-5 py-4">
					<DialogTitle className="font-semibold text-base text-foreground">
						Edit label
					</DialogTitle>
					<DialogClose className="flex size-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
						<XIcon size={16} />
					</DialogClose>
				</DialogHeader>

				<div className="flex flex-col gap-4 p-5">
					<div className="flex items-end gap-1.5">
						<div className="flex w-full flex-col gap-1.5">
							<label className="font-medium text-muted-foreground text-xs">
								Label name
							</label>
							<input
								type="text"
								value={labelText}
								onChange={(e) => setLabelText(e.target.value)}
								placeholder="Enter label name..."
								className="h-9 rounded-lg border border-border bg-background px-3 text-foreground text-sm placeholder:text-muted-foreground focus:border-foreground/30 focus:outline-none"
							/>
						</div>
						<HexPicker color={color} setColor={setColor} />
					</div>
				</div>

				<DialogFooter className="flex-row justify-end gap-2 border-border border-t px-5 py-4">
					<DialogClose className="flex h-8 items-center justify-center rounded-lg border border-border px-3 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
						<span className="text-sm">Cancel</span>
					</DialogClose>

					<Button
						type="button"
						onClick={handleUpdate}
						disabled={!hasChanged || isEditing}
						variant="default"
						className="h-8 rounded-lg px-4"
					>
						{isEditing ? "Editing..." : "Edit"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
