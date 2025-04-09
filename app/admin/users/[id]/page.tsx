import UpdateUserForm from "@/components/admin/user-form/user-form";
import { getUserById } from "@/lib/actions/user.actions";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
	title: "Admin User Update",
};

const AdminUserUpdatePage = async (props: {
	params: Promise<{ id: string }>;
}) => {
	const { id } = await props.params;
	const user = await getUserById(id);
	if (!user) notFound();
	return (
		<div className="space-y-8 max-w-md mx-auto">
			<h1 className="h2-bold">Update User</h1>
			<div>
				<UpdateUserForm user={user} />
			</div>
		</div>
	);
};
export default AdminUserUpdatePage;
