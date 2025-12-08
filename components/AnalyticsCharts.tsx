"use client";

import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#EC4899",
  "#6366F1",
];

interface ChartDataPoint {
  name: string;
  value?: number;
  cases?: number;
  [key: string]: unknown;
}

type ChartProps = {
  data: ChartDataPoint[];
};

export function StatusChart({ data }: ChartProps) {
  const router = useRouter();

  const handleClick = (entry: ChartDataPoint) => {
    if (entry && entry.name) {
      router.push(`/dashboard/cases?status=${encodeURIComponent(entry.name)}`);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
        Case Status
      </h3>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              onClick={handleClick}
              className="cursor-pointer focus:outline-none"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  strokeWidth={0}
                  className="hover:opacity-80 transition-opacity cursor-pointer"
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              itemStyle={{ color: "#374151", fontSize: "12px" }}
            />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "12px" }}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TypeChart({ data }: ChartProps) {
  const router = useRouter();

  const handleClick = (entry: unknown) => {
    const typedEntry = entry as {
      activePayload?: { payload: ChartDataPoint }[];
    };
    if (typedEntry && typedEntry.activePayload && typedEntry.activePayload[0]) {
      const name = typedEntry.activePayload[0].payload.name;
      router.push(`/dashboard/cases?type=${encodeURIComponent(name)}`);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
        Incident Types
      </h3>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
            onClick={handleClick}
            className="cursor-pointer"
          >
            <CartesianGrid
              strokeDasharray="3 3"
              horizontal={false}
              stroke="#E5E7EB"
              opacity={0.5}
            />
            <XAxis type="number" hide />
            <YAxis
              dataKey="name"
              type="category"
              width={100}
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              cursor={{ fill: "transparent" }}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              itemStyle={{ color: "#374151", fontSize: "12px" }}
            />
            <Bar
              dataKey="value"
              name="Cases"
              fill="#8B5CF6"
              radius={[0, 4, 4, 0]}
              barSize={16}
              className="hover:opacity-80 transition-opacity"
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export function TrendChart({ data }: ChartProps) {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
        Monthly Trends
      </h3>
      <div className="flex-1 min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorCases" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="#E5E7EB"
              opacity={0.5}
            />
            <XAxis
              dataKey="name"
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              dy={10}
            />
            <YAxis
              tick={{ fill: "#6B7280", fontSize: 11 }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.95)",
                borderRadius: "8px",
                border: "none",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
              }}
              itemStyle={{ color: "#374151", fontSize: "12px" }}
            />
            <Area
              type="monotone"
              dataKey="cases"
              name="Cases"
              stroke="#10B981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorCases)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
