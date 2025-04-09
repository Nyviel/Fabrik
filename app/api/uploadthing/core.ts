import { auth } from "@/auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
	imageUploader: f({
		image: {
			maxFileSize: "4MB",
		},
	})
		// Set permissions and file types for this FileRoute
		.middleware(async ({}) => {
			// This code runs on your server before upload
			const session = await auth();
			const user = session?.user;

			// If you throw, the user will not be able to upload
			if (!user) throw new UploadThingError("Unauthorized");
			if (user.role !== "admin")
				throw new UploadThingError("Unauthorized");

			// Whatever is returned here is accessible in onUploadComplete as `metadata`
			return { userId: user.id };
		})
		.onUploadComplete(async ({ metadata }) => {
			// !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
			return { uploadedBy: metadata.userId };
		}),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
