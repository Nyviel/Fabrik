"use client";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { updateUserProfile } from "@/lib/actions/user.actions";
import { updateUserProfileSchema } from "@/lib/validators";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const ProfileForm = () => {
	const { data: session, update } = useSession();
	console.log(session);

	const form = useForm<z.infer<typeof updateUserProfileSchema>>({
		resolver: zodResolver(updateUserProfileSchema),
		defaultValues: {
			name: session?.user?.name ?? "",
			email: session?.user?.email ?? "",
		},
	});

	const onSubmit = async (
		values: z.infer<typeof updateUserProfileSchema>
	) => {
		const res = await updateUserProfile(values);

		if (!res.success) {
			return toast.error(res.message);
		}

		const newSession = {
			...session,
			user: {
				...session?.user,
				name: values.name,
			},
		};

		await update(newSession);

		toast.success(res.message);
	};

	return (
		<Form {...form}>
			<form
				className="flex flex-col gap-5"
				onSubmit={form.handleSubmit(onSubmit)}
			>
				<div className="flex flex-col gap-5">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<Input
										disabled
										placeholder="Email"
										className="input-field"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="name"
						render={({ field }) => (
							<FormItem className="w-full">
								<FormControl>
									<Input
										placeholder="Name"
										className="input-field"
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<Button type="submit" disabled={form.formState.isSubmitting}>
					{form.formState.isSubmitting ? (
						<>
							<Loader className="w-4 h-4 animate-spin" />{" "}
							Submitting...
						</>
					) : (
						"Update Profile"
					)}
				</Button>
			</form>
		</Form>
	);
};

export default ProfileForm;
