import { APP_NAME } from "@/lib/constants";
import Image from "next/image";
import Link from "next/link";

const NotFoundPage = () => {
	return (
		<div className="flex items-center justify-center min-h-screen">
			<div className="flex flex-col items-center gap-1 p-6 w-1/3 bg-secondary shadow-lg rounded-lg">
				<Image
					src={"/images/logo.svg"}
					width={48}
					height={48}
					alt={`${APP_NAME} logo`}
					priority={true}
				/>
				<h1 className="text-3xl font-bold my-4">Not Found</h1>
				<p className="text-destructive mb-2">Could not find page</p>
				<Link
					href="/"
					className="shadow-lg p-3 rounded-lg border border-primary"
				>
					Return home
				</Link>
			</div>
		</div>
	);
};
export default NotFoundPage;
