"use client";
export default function Error() {
	return (
		<div className="flex items-center flex-col h-full space-y-10">
			<div className=" relative ">
				<iframe
					src="https://giphy.com/embed/ku4DKHgQmyauWXbLMA"
					width="480"
					height="360"
					className="giphy-embed hover:"
				></iframe>

				<div className=" absolute top-0 left-0 w-full h-full"></div>
			</div>

			<h1>Try to Refresh</h1>
		</div>
	);
}
