import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { getAllCategories } from "@/lib/actions/product.actions";
import { SearchIcon } from "lucide-react";

const Search = async () => {
	const categories = [
		{ category: "all", _count: 0 },
		...(await getAllCategories()),
	];

	return (
		<form action="/search" method="GET">
			<div className="flex gap-2 w-full max-w-sm items-center">
				<Select name="category" defaultValue="all">
					<SelectTrigger className="w-[180px]">
						<SelectValue placeholder="All" />
					</SelectTrigger>
					<SelectContent>
						{categories.map(({ category }) => (
							<SelectItem
								key={category}
								value={category.toLowerCase()}
								className="py-1 px-2 cursor-pointer hover:bg-gray-300 dark:hover:bg-gray-800"
							>
								{category.charAt(0).toUpperCase() +
									category.slice(1)}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Input
					name="q"
					type="text"
					placeholder="Search..."
					className="md:w-[100px] lg:w-[300px]"
				/>
				<Button type="submit">
					<SearchIcon />
				</Button>
			</div>
		</form>
	);
};
export default Search;
