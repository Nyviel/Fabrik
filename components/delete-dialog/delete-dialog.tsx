"use client";

import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
	AlertDialogCancel,
	AlertDialogDescription,
} from "@radix-ui/react-alert-dialog";
import { useState, useTransition } from "react";
import { toast } from "sonner";

interface DeleteDialogProps {
	id: string;
	action: (id: string) => Promise<{ success: boolean; message: string }>;
}

const DeleteDialog = ({ id, action }: DeleteDialogProps) => {
	const [open, setOpen] = useState(false);
	const [isPending, startTransition] = useTransition();

	const handleDeleteClick = () => {
		startTransition(async () => {
			const res = await action(id);
			if (res.success) {
				setOpen(false);
				toast.success(res.message);
			} else {
				toast.error(res.message);
			}
		});
	};

	return (
		<AlertDialog open={open} onOpenChange={setOpen}>
			<AlertDialogTrigger asChild>
				<Button size={"sm"} variant={"destructive"}>
					Delete
				</Button>
			</AlertDialogTrigger>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>Are you sure?</AlertDialogTitle>
					<AlertDialogDescription>
						This action can&apos;t be reversed
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel className="border px-2 rounded-md">
						Cancel
					</AlertDialogCancel>
					<Button
						variant={"destructive"}
						size={"sm"}
						disabled={isPending}
						onClick={handleDeleteClick}
					>
						{isPending ? "Deleting..." : "Delete"}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
export default DeleteDialog;
