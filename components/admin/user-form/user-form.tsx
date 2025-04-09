"use client";

import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { updateUserSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ControllerRenderProps, useForm } from "react-hook-form";
import { z } from "zod";
import { USER_ROLES } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { updateUser } from "@/lib/actions/user.actions";

const UpdateUserForm = ({
	user,
}: {
	user: z.infer<typeof updateUserSchema>;
}) => {
	const router = useRouter();

	const form = useForm<z.infer<typeof updateUserSchema>>({
		resolver: zodResolver(updateUserSchema),
		defaultValues: user,
	});

	const onSubmit = async (values: z.infer<typeof updateUserSchema>) => {
		try {
			const res = await updateUser({ ...values, id: user.id });

			if (!res.success) {
				toast.error(res.message);
				return;
			}

			toast.success(res.message);
			form.reset();
			router.push("/admin/users");
		} catch (error) {
			toast.error((error as Error).message);
		}
	};
	return (
		<Form {...form}>
			<form
				method="post"
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4"
			>
				{/* name */}
				<FormField
					control={form.control}
					name="name"
					render={({
						field,
					}: {
						field: ControllerRenderProps<
							z.infer<typeof updateUserSchema>,
							"name"
						>;
					}) => {
						return (
							<FormItem className="w-full items-start flex flex-col gap-4">
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										placeholder="Enter new name..."
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				{/* email */}
				<FormField
					control={form.control}
					name="email"
					render={({
						field,
					}: {
						field: ControllerRenderProps<
							z.infer<typeof updateUserSchema>,
							"email"
						>;
					}) => {
						return (
							<FormItem className="w-full items-start flex flex-col gap-4">
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										disabled
										placeholder="Enter new email..."
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				{/* role */}
				<FormField
					control={form.control}
					name="role"
					render={({
						field,
					}: {
						field: ControllerRenderProps<
							z.infer<typeof updateUserSchema>,
							"role"
						>;
					}) => {
						return (
							<FormItem className="w-full items-start flex flex-col gap-4">
								<FormLabel>Role</FormLabel>
								<Select
									onValueChange={field.onChange}
									value={field.value.toString()}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="Select a role..." />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										{USER_ROLES.map((role) => {
											return (
												<SelectItem
													key={role}
													value={role}
												>
													{role}
												</SelectItem>
											);
										})}
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						);
					}}
				/>
				<Button
					type="submit"
					size="lg"
					disabled={form.formState.isSubmitting}
					className="w-full"
				>
					{form.formState.isSubmitting
						? "Submitting..."
						: `Update User`}
				</Button>
			</form>
		</Form>
	);
};
export default UpdateUserForm;
