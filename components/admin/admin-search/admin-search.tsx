"use client";

import { Input } from "@/components/ui/input";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

const AdminSearch = () => {
	const pathname = usePathname();
	const formActionUrl = pathname.includes("/admin/orders")
		? "/admin/orders"
		: pathname.includes("/admin/products")
		? "/admin/products"
		: pathname.includes("/admin/users")
		? "/admin/users"
		: "";

	const searchParams = useSearchParams();
	const [queryValue, setQueryValue] = useState(
		searchParams.get("query") || ""
	);

	useEffect(() => {
		setQueryValue(searchParams.get("query") || "");
	}, [searchParams]);

	return (
		<form action={formActionUrl} method="GET">
			<Input
				placeholder="Search..."
				name="query"
				value={queryValue}
				type="search"
				onChange={(e) => {
					setQueryValue(e.target.value);
				}}
				className="md:w-[100px] lg:w-[300px]"
			/>
			<button className="sr-only" type="submit">
				Search
			</button>
		</form>
	);
};
export default AdminSearch;
