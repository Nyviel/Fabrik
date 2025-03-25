import loader from "@/assets/loader.gif";
import Image from "next/image";

const LoadingPage = () => {
	return (
		<div className="flex-center w-screen h-screen">
			<Image src={loader} height={150} width={150} alt="Loading..." />
		</div>
	);
};
export default LoadingPage;
