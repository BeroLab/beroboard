import type { SVGProps } from "react";

export function TodoIcon(props: SVGProps<SVGSVGElement>) {
	return (
		<svg
			width="20"
			height="20"
			viewBox="0 0 20 20"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			{...props}
		>
			<circle
				cx="10"
				cy="10"
				r="8"
				stroke="currentColor"
				strokeWidth="1.75007"
				strokeLinecap="round"
				strokeDasharray="3.5 3.5"
			/>
		</svg>
	);
}
