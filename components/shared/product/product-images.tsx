"use client";

import { cn } from "@/lib/utils";
import Image from "next/image";
import { useState } from "react";

interface ProductImagesProps {
	images: string[];
}

const ProductImages = ({ images }: ProductImagesProps) => {
	const [current, setCurrent] = useState(0);

	return (
		<div className="space-y-4 pr-4">
			<Image
				src={images[current]}
				alt="current product image"
				width={1000}
				height={1000}
				className="min-h-[300px] object-cover object-center"
			/>

			<div className="flex">
				{images.map((image, i) => {
					return (
						<div
							key={image}
							onClick={() => {
								setCurrent(i);
							}}
							className={cn(
								"border mr-2 cursor-pointer hover:border-orange-600",
								current === i && "border-orange-500"
							)}
						>
							<Image
								src={image}
								alt="another product image"
								width={100}
								height={100}
							/>
						</div>
					);
				})}
			</div>
		</div>
	);
};
export default ProductImages;
