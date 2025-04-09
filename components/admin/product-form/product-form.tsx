"use client";

import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { productDefaultValues } from "@/lib/constants";
import { insertProductSchema, updateProductSchema } from "@/lib/validators";
import { Product } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { ControllerRenderProps, SubmitHandler, useForm } from "react-hook-form";
import { z } from "zod";
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import { createProduct, updateProduct } from "@/lib/actions/product.actions";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { UploadButton } from "@uploadthing/react";
import { OurFileRouter } from "@/app/api/uploadthing/core";
import { Checkbox } from "@/components/ui/checkbox";

const ProductForm = ({
	type,
	product,
}: {
	type: "create" | "update";
	product?: Product;
}) => {
	const router = useRouter();

	const form = useForm<z.infer<typeof insertProductSchema>>({
		resolver: zodResolver(
			type === "create" ? insertProductSchema : updateProductSchema
		),
		defaultValues:
			product && type === "update" ? product : productDefaultValues,
	});

	const onSubmit: SubmitHandler<z.infer<typeof insertProductSchema>> = async (
		values
	) => {
		let res;
		if (type === "create") {
			res = await createProduct(values);
		} else {
			if (!product || !product.id) {
				router.push("/admin/products");
				return;
			}
			res = await updateProduct({ ...values, id: product.id });
		}

		if (!res.success) {
			toast.error(res.message);
		} else {
			toast.success(res.message);
		}

		router.push("/admin/products");
	};

	const images = form.watch("images");
	const isFeatured = form.watch("isFeatured");
	const banner = form.watch("banner");

	return (
		<Form {...form}>
			<form
				method="POST"
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-8"
			>
				<div className="flex flex-col md:flex-row gap-5">
					<FormField
						control={form.control}
						name="name"
						render={({
							field,
						}: {
							field: ControllerRenderProps<
								z.infer<typeof insertProductSchema>,
								"name"
							>;
						}) => {
							return (
								<FormItem className="w-full items-start flex flex-col gap-4">
									<FormLabel>Name</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter product name..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<FormField
						control={form.control}
						name="slug"
						render={({
							field,
						}: {
							field: ControllerRenderProps<
								z.infer<typeof insertProductSchema>,
								"slug"
							>;
						}) => {
							return (
								<FormItem className="w-full flex flex-col gap-4">
									<FormLabel>Slug</FormLabel>
									<FormControl>
										<div className="relative">
											<Input
												placeholder="Enter slug..."
												{...field}
											/>
											<Button
												type="button"
												className="px-4 py-1 mt-4"
												onClick={() => {
													form.setValue(
														"slug",
														slugify(
															form.getValues(
																"name"
															),
															{ lower: true }
														)
													);
												}}
											>
												Generate
											</Button>
										</div>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
				</div>
				<div className="flex flex-col md:flex-row gap-5">
					<FormField
						control={form.control}
						name="category"
						render={({
							field,
						}: {
							field: ControllerRenderProps<
								z.infer<typeof insertProductSchema>,
								"category"
							>;
						}) => {
							return (
								<FormItem className="w-full items-start flex flex-col gap-4">
									<FormLabel>Category</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter category..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<FormField
						control={form.control}
						name="brand"
						render={({
							field,
						}: {
							field: ControllerRenderProps<
								z.infer<typeof insertProductSchema>,
								"brand"
							>;
						}) => {
							return (
								<FormItem className="w-full items-start flex flex-col gap-4">
									<FormLabel>Brand</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter brand..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
				</div>
				<div className="flex flex-col md:flex-row gap-5">
					<FormField
						control={form.control}
						name="price"
						render={({
							field,
						}: {
							field: ControllerRenderProps<
								z.infer<typeof insertProductSchema>,
								"price"
							>;
						}) => {
							return (
								<FormItem className="w-full items-start flex flex-col gap-4">
									<FormLabel>Price</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter price..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
					<FormField
						control={form.control}
						name="stock"
						render={({
							field,
						}: {
							field: ControllerRenderProps<
								z.infer<typeof insertProductSchema>,
								"stock"
							>;
						}) => {
							return (
								<FormItem className="w-full items-start flex flex-col gap-4">
									<FormLabel>Stock</FormLabel>
									<FormControl>
										<Input
											placeholder="Enter stock..."
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
				</div>
				<div>
					<FormField
						control={form.control}
						name="description"
						render={({
							field,
						}: {
							field: ControllerRenderProps<
								z.infer<typeof insertProductSchema>,
								"description"
							>;
						}) => {
							return (
								<FormItem className="w-full items-start flex flex-col gap-4">
									<FormLabel>Description</FormLabel>
									<FormControl>
										<Textarea
											placeholder="Enter description..."
											className="resize-none"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
				</div>
				<div className="upload-field flex flex-col gap-5 md:flex-row">
					<FormField
						control={form.control}
						name="images"
						render={() => {
							return (
								<FormItem className="w-full items-start flex flex-col gap-4">
									<FormLabel>Images</FormLabel>
									<Card className="w-full py-1">
										<CardContent className="space-y-2 mt-2 min-h-48">
											<div className="flex-start space-x-2">
												{images.map((image) => {
													return (
														<Image
															key={image}
															src={image}
															alt="img thumbnail"
															width={0}
															height={0}
															className="w-20 h-20 object-cover object-center rounded-sm"
														/>
													);
												})}
												<FormControl>
													<UploadButton<
														OurFileRouter,
														"imageUploader"
													>
														endpoint="imageUploader"
														onClientUploadComplete={(
															res: {
																url: string;
															}[]
														) => {
															form.setValue(
																"images",
																[
																	...images,
																	res[0].url,
																]
															);
														}}
														onUploadError={(
															error: Error
														) => {
															toast.error(
																`Error: ${error.message}`
															);
														}}
													/>
												</FormControl>
												<FormMessage />
											</div>
										</CardContent>
									</Card>
									<FormMessage />
								</FormItem>
							);
						}}
					/>
				</div>
				<div className="upload-field space-y-2">
					<p className="text-sm font-medium">Featured Product</p>
					<FormField
						control={form.control}
						name="isFeatured"
						render={({
							field,
						}: {
							field: ControllerRenderProps<
								z.infer<typeof insertProductSchema>,
								"isFeatured"
							>;
						}) => {
							return (
								<Card>
									<CardContent>
										<FormItem className="space-x-2 items-center flex">
											<FormControl>
												<Checkbox
													id="isFeaturedCheckbox"
													checked={field.value}
													onCheckedChange={
														field.onChange
													}
												/>
											</FormControl>
											<FormLabel
												htmlFor="isFeaturedCheckbox"
												className="font-normal"
											>
												Is Featured?
											</FormLabel>
											<FormMessage />
										</FormItem>
									</CardContent>
								</Card>
							);
						}}
					/>
				</div>
				{isFeatured && (
					<div className="upload-field space-y-2">
						<p className="font-medium text-sm">Banner</p>
						<Card className="py-2">
							<CardContent>
								{banner && (
									<Image
										src={banner}
										alt="banner image"
										width={1920}
										height={680}
										className="w-full object-cover object-center rounded-md"
									/>
								)}
								{!banner && (
									<FormField
										control={form.control}
										name="banner"
										render={() => {
											return (
												<FormItem className="w-full flex pb-4 items-start">
													<FormControl>
														<UploadButton<
															OurFileRouter,
															"imageUploader"
														>
															endpoint="imageUploader"
															onClientUploadComplete={(
																res: {
																	url: string;
																}[]
															) => {
																form.setValue(
																	"banner",
																	res[0].url
																);
															}}
															onUploadError={(
																error: Error
															) => {
																toast.error(
																	`Error: ${error.message}`
																);
															}}
														/>
													</FormControl>
													<FormMessage />
												</FormItem>
											);
										}}
									/>
								)}
							</CardContent>
						</Card>
					</div>
				)}
				<div>
					<Button
						type="submit"
						size="lg"
						disabled={form.formState.isSubmitting}
						className="w-full"
					>
						{form.formState.isSubmitting
							? "Submitting..."
							: `${
									type.charAt(0).toUpperCase() + type.slice(1)
							  } Product`}
					</Button>
				</div>
			</form>
		</Form>
	);
};
export default ProductForm;
