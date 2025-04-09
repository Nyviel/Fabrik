"use client";

import {
	Carousel,
	CarouselContent,
	CarouselItem,
	CarouselNext,
	CarouselPrevious,
} from "@/components/ui/carousel";
import { Product } from "@/types";
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";
import Link from "next/link";

interface ProductCarouselProps {
	data: Product[];
}

const ProductCarousel = ({ data }: ProductCarouselProps) => {
	return (
		<Carousel
			className="w-full mb-12"
			opts={{ loop: true }}
			plugins={[
				Autoplay({
					delay: 2000,
					stopOnInteraction: true,
					stopOnMouseEnter: true,
				}),
			]}
		>
			<CarouselContent>
				{data.map((item) => (
					<CarouselItem key={item.id}>
						<Link href={`/product/${item.slug}`}>
							<div className="relative mx-auto">
								<Image
									src={item.banner!}
									alt={item.name}
									height={0}
									width={0}
									sizes="100vw"
									className="w-full h-auto"
								/>
								<div className="absolute inset-0 flex items-end justify-center">
									<h2 className="bg-muted-foreground bg-opacity-50 text-2xl font-bold px-2">
										{item.name}
									</h2>
								</div>
							</div>
						</Link>
					</CarouselItem>
				))}
			</CarouselContent>
			<CarouselPrevious />
			<CarouselNext />
		</Carousel>
	);
};
export default ProductCarousel;
