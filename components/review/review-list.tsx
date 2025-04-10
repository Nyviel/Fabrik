"use client";

import { Review } from "@/types";
import Link from "next/link";
import { useEffect, useState } from "react";
import ReviewForm from "./review-form";
import { getReviews } from "@/lib/actions/review.actions";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "../ui/card";
import { formatDateTime } from "@/lib/utils";
import { User, Calendar } from "lucide-react";
import Rating from "../rating/rating";

interface ReviewListProps {
	userId: string;
	productId: string;
	productSlug: string;
}

const ReviewList = ({ userId, productId, productSlug }: ReviewListProps) => {
	const [reviews, setReviews] = useState<Review[]>([]);

	useEffect(() => {
		const loadReviews = async () => {
			const res = await getReviews({ productId });
			setReviews(res.data);
		};
		loadReviews();
	}, [productId]);
	const reload = async () => {
		const res = await getReviews({ productId });
		setReviews([...res.data]);
	};
	console.log(userId, productId, productSlug);
	return (
		<div>
			{reviews.length === 0 && (
				<div className="text-xl my-8">No reviews yet...</div>
			)}
			{userId ? (
				<ReviewForm
					userId={userId}
					productId={productId}
					onReviewSubmitted={reload}
				/>
			) : (
				<div>
					Please{" "}
					<Link
						href={`/sign-in?callbackUrl=/product/${productSlug}`}
						className="text-primary"
					>
						sign in
					</Link>{" "}
					to leave a review
				</div>
			)}
			<div className="flex flex-col gap-3 my-4">
				{reviews.map((review) => (
					<Card key={review.id}>
						<CardHeader>
							<div className="flex-between">
								<CardTitle>{review.title}</CardTitle>
							</div>
							<CardDescription>
								{review.description}
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex space-x-4 text-sm text-muted-foreground">
								<Rating value={review.rating} />
								<div className="flex items-center">
									<User className="mr-1 h-3 w-3" />
									{review.user ? review.user.name : "User"}
								</div>
								<div className="flex items-center">
									<Calendar className="mr-1 h-3 w-3" />
									{formatDateTime(review.createdAt).dateTime}
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
};
export default ReviewList;
