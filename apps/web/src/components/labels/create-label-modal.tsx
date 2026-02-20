import { PlusIcon, XIcon } from "@phosphor-icons/react";
import { useState } from "react";
import { type Color, parseColor } from "react-aria-components";
import type { CreateLabelInput } from "~/lib/types";
import { HexPicker } from "../hex-picker";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "../ui/dialog";

interface CreateLabelModalProps {
	isOpen: boolean;
	onClose: () => void;
	onSubmit: (data: Omit<CreateLabelInput, "organizationId">) => Promise<void>;
}

export function CreateLabelModal({
	isOpen,
	onClose,
	onSubmit,
}: CreateLabelModalProps) {
	const [labelText, setLabelText] = useState("");
	const [color, setColor] = useState<Color>(parseColor("#ff0000"));
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = async () => {
		if (!labelText.trim()) {
			return;
		}

		setIsSubmitting(true);
		try {
			await onSubmit({ text: labelText, color: color.toString("hex") });
			resetForm();
			onClose();
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetForm = () => {
		setLabelText("");
		setColor(parseColor("#ff0000"));
	};

	const handleClose = () => {
		resetForm();
		onClose();
	};

	return (
		<Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
			<DialogContent
				showCloseButton={false}
				className="w-120 max-w-120 gap-0 rounded-xl border border-border bg-card p-0 sm:max-w-120"
			>
				<DialogHeader className="flex-row items-center justify-between border-border border-b px-5 py-4">
					<DialogTitle className="font-semibold text-base text-foreground">
						Create new label
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
					<button
						type="button"
						onClick={handleSubmit}
						disabled={!labelText.trim() || isSubmitting}
						className="flex h-8 items-center justify-center gap-1.5 rounded-full bg-foreground px-4 text-background transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<PlusIcon size={14} weight="bold" />
						<span className="font-medium text-sm">
							{isSubmitting ? "Creating..." : "Create label"}
						</span>
					</button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
