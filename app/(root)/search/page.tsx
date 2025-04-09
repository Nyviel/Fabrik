import Pagination from "@/components/pagination/pagination";
import ProductCard from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import {
	getAllCategories,
	getAllProducts,
} from "@/lib/actions/product.actions";
import { PAGE_SIZE, PRICES, RATINGS, SORT_ORDERS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Link from "next/link";

export async function generateMetadata(props: {
	searchParams: Promise<{
		q: string;
		category: string;
		price: string;
		rating: string;
	}>;
}) {
	const {
		q = "all",
		category = "all",
		price = "all",
		rating = "all",
	} = await props.searchParams;

	const isQuerySet = q && q !== "all" && q.trim() !== "";
	const isCategorySet =
		category && category !== "all" && category.trim() !== "";
	const isPriceSet = price && price !== "all" && price.trim() !== "";
	const isRatingSet = rating && rating !== "all" && rating.trim() !== "";

	if (isQuerySet || isCategorySet || isPriceSet || isRatingSet) {
		return {
			title: `
		Search ${isQuerySet ? q : ""} 
		${isCategorySet ? `: Category ${category}` : ""}
		${isPriceSet ? `: Price ${price}` : ""}
		${isRatingSet ? `: Rating ${rating}` : ""}`,
		};
	} else {
		return {
			title: "Search Products",
		};
	}
}

const SearchPage = async (props: {
	searchParams: Promise<{
		category?: string;
		q?: string;
		price?: string;
		rating?: string;
		sort?: string;
		page?: string;
	}>;
}) => {
	const {
		category = "all",
		q = "all",
		price = "all",
		rating = "all",
		sort = "newest",
		page = "1",
	} = await props.searchParams;

	const getFilterUrl = ({
		c,
		p,
		s,
		r,
		pg,
	}: {
		c?: string;
		p?: string;
		s?: string;
		r?: string;
		pg?: string;
	}) => {
		const params = { q, category, price, rating, sort, page };

		if (c) params.category = c;
		if (p) params.price = p;
		if (s) params.sort = s;
		if (r) params.rating = r;
		if (pg) params.page = pg;

		return `/search?${new URLSearchParams(params).toString()}`;
	};

	const products = await getAllProducts({
		query: q,
		limit: PAGE_SIZE,
		page: Number(page),
		category,
		price,
		rating,
		sort,
	});

	const categories = [
		{ category: "all", _count: 0 },
		...(await getAllCategories()),
	];

	return (
		<div className="grid md:grid-cols-5 md:gap-5">
			<div className="filter-links">
				<h3 className="text-xl mb-2 mt-3">Department</h3>
				<div>
					<ul>
						<li className="flex flex-col gap-2">
							{categories.map(({ category: cat }) => (
								<Link
									key={Math.random()}
									href={getFilterUrl({ c: cat })}
									className={cn(
										category === cat ? "font-bold" : ""
									)}
								>
									{cat.charAt(0).toUpperCase() + cat.slice(1)}
								</Link>
							))}
						</li>
					</ul>
				</div>
				<h3 className="text-xl mb-2 mt-3">Pricing</h3>
				<div>
					<ul>
						<li className="flex flex-col gap-2">
							{PRICES.map(({ value, name }) => (
								<Link
									key={Math.random()}
									href={getFilterUrl({ p: value })}
									className={cn(
										price === value ? "font-bold" : ""
									)}
								>
									{name}
								</Link>
							))}
						</li>
					</ul>
				</div>
				<h3 className="text-xl mb-2 mt-3">Rating</h3>
				<div>
					<ul>
						<li className="flex flex-col gap-2">
							{RATINGS.map((cRating) => (
								<Link
									key={Math.random()}
									href={getFilterUrl({
										r: cRating,
									})}
									className={cn(
										rating === cRating ? "font-bold" : ""
									)}
								>
									{cRating} stars{" "}
									{cRating < "5" ? "& up" : ""}
								</Link>
							))}
						</li>
					</ul>
				</div>
			</div>
			<div className="space-y-4 md:col-span-4">
				<div className="flex-between flex-col md:flex-row my-4">
					<div className="flex gap-2 items-center">
						{q !== "all" && q !== "" && (
							<p>
								<span className="font-bold">Query: </span>
								{q}
							</p>
						)}
						{category !== "all" && (
							<p>
								<span className="font-bold">Category: </span>
								{category}
							</p>
						)}
						{price !== "all" && (
							<p>
								<span className="font-bold">Price: </span>
								{price}
							</p>
						)}
						{rating !== "all" && (
							<p>
								<span className="font-bold">Rating: </span>
								{rating} - {5}
							</p>
						)}
						{q !== "all" ||
						category !== "all" ||
						price !== "all" ||
						rating !== "all" ? (
							<Button asChild variant={"link"}>
								<Link href={"/search"}>Clear</Link>
							</Button>
						) : null}
					</div>
					<div>
						Sort by:
						{SORT_ORDERS.map((sortOrder) => {
							return (
								<Link
									key={sortOrder}
									href={getFilterUrl({ s: sortOrder })}
									className={cn(
										sortOrder === sort ? "font-bold" : "",
										"mx-2"
									)}
								>
									{sortOrder}
								</Link>
							);
						})}
					</div>
				</div>
				<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
					{products.data.length === 0 ? (
						<h2>No Products Found!</h2>
					) : (
						products.data.map((product) => {
							return (
								<ProductCard
									key={product.id}
									product={product}
								/>
							);
						})
					)}
				</div>
				{products.data.length > 0 && (
					<Pagination
						page={page}
						totalPages={products.totalPages}
						totalItems={products.totalItems}
					/>
				)}
			</div>
		</div>
	);
};
export default SearchPage;
