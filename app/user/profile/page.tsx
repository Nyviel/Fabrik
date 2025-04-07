import { auth } from "@/auth";
import UserProfileForm from "@/components/shared/user-profile-form/user-profile-form";
import { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
	title: "My Profile",
};

const ProfilePage = async () => {
	const session = await auth();
	return (
		<SessionProvider session={session}>
			<div className="max-w-md mx-auto space-y-4">
				<h1 className="h2-bold">Profile</h1>
				<UserProfileForm />
			</div>
		</SessionProvider>
	);
};
export default ProfilePage;
