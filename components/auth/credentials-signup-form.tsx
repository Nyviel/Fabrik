"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { APP_NAME } from "@/lib/constants";
import Link from "next/link";
import { signUpUser } from "@/lib/actions/user.actions";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { useSearchParams } from "next/navigation";

const CredentialsSignupForm = () => {
	const [data, action] = useActionState(signUpUser, {
		success: false,
		message: "",
	});

	const searchParams = useSearchParams();
	const callbackUrl = searchParams.get("callbackUrl") || "/";

	const SignUpButton = () => {
		const { pending } = useFormStatus();

		return (
			<Button disabled={pending} className="w-full" variant={"default"}>
				{pending ? "Signing Up..." : "Sign Up"}
			</Button>
		);
	};

	return (
		<form action={action}>
			<input type="hidden" name="callbackUrl" value={callbackUrl} />
			<div className="space-y-6">
				<div className="space-y-2">
					<Label htmlFor="name">Name</Label>
					<Input
						id="name"
						name="name"
						type="text"
						required
						autoComplete="name"
						placeholder="Your name..."
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="email">Email</Label>
					<Input
						id="email"
						name="email"
						type="email"
						required
						autoComplete="email"
						placeholder="Your@email.com..."
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="password">Password</Label>
					<Input
						id="password"
						name="password"
						type="password"
						required
						autoComplete="password"
						placeholder="Your secure password..."
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="confirmPassword">Confirm password</Label>
					<Input
						id="confirmPassword"
						name="confirmPassword"
						type="password"
						required
						autoComplete="confirmPassword"
						placeholder="Confirm your password..."
					/>
				</div>
				<SignUpButton />

				{data && !data.success && (
					<div className="text-center text-destructive">
						{data.message}
					</div>
				)}

				<div className="text-sm text-muted-foreground text-center">
					Already registered with {APP_NAME}?{" "}
					<Link
						href={"/sign-in"}
						target="_self"
						className="link underline text-primary"
					>
						Sign in
					</Link>
				</div>
			</div>
		</form>
	);
};
export default CredentialsSignupForm;
