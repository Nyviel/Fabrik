import Pagination from "@/components/pagination/pagination";
import DeleteDialog from "@/components/delete-dialog/delete-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { deleteUser, getAllUsers } from "@/lib/actions/user.actions";
import { PAGE_SIZE } from "@/lib/constants";
import { formatId, formatDateTime } from "@/lib/utils";
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
	title: "Admin Users",
};

const AdminUsersPage = async (props: {
	searchParams: Promise<{ page: string; query: string }>;
}) => {
	const { page = "1", query } = await props.searchParams;
	const users = await getAllUsers(Number(page), query, PAGE_SIZE);
	return (
		<div>
			<div className="flex items-end gap-3">
				<h1 className="h2-bold">Users</h1>
				{query && (
					<div className="flex items-end gap-3">
						<p>
							Filtered by <i>&quot;{query}&quot;</i>
						</p>
						<Link href={"/admin/users"}>
							<Badge
								variant={"outline"}
								className="border-red-600"
							>
								Remove filter
							</Badge>
						</Link>
					</div>
				)}
			</div>
			{users.data.length === 0 ? (
				<h2 className="text-muted-foreground font-light">
					No users found
				</h2>
			) : (
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Id</TableHead>
							<TableHead>Created At</TableHead>
							<TableHead>Name</TableHead>
							<TableHead>Email</TableHead>
							<TableHead>Role</TableHead>
							<TableHead>Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{users.data.map((user) => {
							return (
								<TableRow key={user.id}>
									<TableCell>{formatId(user.id)}</TableCell>
									<TableCell>
										{
											formatDateTime(user.createdAt)
												.dateTime
										}
									</TableCell>
									<TableCell>{user.name} </TableCell>
									<TableCell>{user.email}</TableCell>
									<TableCell>
										{user.role === "user" ? (
											<Badge variant={"secondary"}>
												{user.role}
											</Badge>
										) : user.role === "admin" ? (
											<Badge variant={"destructive"}>
												{user.role}
											</Badge>
										) : (
											user.role
										)}
									</TableCell>
									<TableCell className="space-x-2">
										<Button
											asChild
											variant={"outline"}
											size={"sm"}
										>
											<Link
												href={`/admin/users/${user.id}`}
											>
												Edit
											</Link>
										</Button>
										<DeleteDialog
											id={user.id}
											action={deleteUser}
										/>
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			)}
			{users.totalPages > 0 && (
				<Pagination
					page={page}
					totalPages={users.totalPages}
					totalItems={users.totalItems}
				/>
			)}
		</div>
	);
};
export default AdminUsersPage;
