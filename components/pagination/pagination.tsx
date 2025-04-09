"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { formUrlQuery } from "@/lib/utils";
import { PAGE_SIZE } from "@/lib/constants";
import { Button } from "@/components/ui/button";

interface PaginationProps {
	page: number | string;
	totalPages: number;
	totalItems: number;
	urlParamName?: string;
}

const Pagination = ({
	page,
	totalPages,
	totalItems,
	urlParamName,
}: PaginationProps) => {
	const router = useRouter();
	const searchParams = useSearchParams();

	const handleClick = (btnType: string) => {
		const nextPage =
			btnType === "next" ? Number(page) + 1 : Number(page) - 1;

		const newUrl = formUrlQuery({
			params: searchParams.toString(),
			key: urlParamName || "page",
			value: nextPage.toString(),
		});

		router.push(newUrl);
	};

	return (
		<div className="flex flex-col py-4 gap-4">
			<p className="text-sm text-muted-foreground">
				Displaying {1 + PAGE_SIZE * (Number(page) - 1)}-
				{Number(page) * PAGE_SIZE > totalItems
					? totalItems
					: Number(page) * PAGE_SIZE}{" "}
				of {totalItems} entries
			</p>
			<span>
				<Button
					className="w-28 me-2"
					size={"lg"}
					variant={"outline"}
					disabled={Number(page) <= 1}
					onClick={() => handleClick("prev")}
				>
					Previous
				</Button>
				<Button
					className="w-28"
					size={"lg"}
					variant={"outline"}
					disabled={Number(page) >= totalPages}
					onClick={() => handleClick("next")}
				>
					Next
				</Button>
			</span>
		</div>
	);
};
export default Pagination;
