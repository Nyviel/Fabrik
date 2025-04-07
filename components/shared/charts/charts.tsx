"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";

interface ChartsProps {
	data: {
		month: string;
		totalSales: number;
	}[];
}

const Charts = ({ data }: ChartsProps) => {
	return (
		<ResponsiveContainer width="100%" height={350}>
			<BarChart data={data}>
				<XAxis
					dataKey={"month"}
					stroke="#444444"
					fontSize={12}
					tickLine={false}
					axisLine={false}
				/>
				<YAxis
					stroke="#444444"
					fontSize={12}
					tickLine={false}
					axisLine={false}
					tickFormatter={(value) => {
						return `${value}zł`;
					}}
				/>
				<Bar
					dataKey="totalSales"
					fill="currentColor"
					radius={[4, 4, 0, 0]}
					className="fill-primary"
				/>
			</BarChart>
		</ResponsiveContainer>
	);
};
export default Charts;
