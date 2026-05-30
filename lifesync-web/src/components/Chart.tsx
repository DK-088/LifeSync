import React from 'react';
import {
  ResponsiveContainer,
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { ChevronDown } from 'lucide-react';

interface ChartData {
  month: string;
  revenue: number;
  expenses: number;
}

const data: ChartData[] = [
  { month: 'Apr', revenue: 26000, expenses: 10000 },
  { month: 'May', revenue: 38000, expenses: 20000 },
  { month: 'Jun', revenue: 37000, expenses: 15000 },
  { month: 'Jul', revenue: 34000, expenses: 9000 },
  { month: 'Aug', revenue: 30000, expenses: 18000 },
  { month: 'Sep', revenue: 30000, expenses: 10000 },
  { month: 'Oct', revenue: 37000, expenses: 16000 },
  { month: 'Nov', revenue: 34000, expenses: 20000 },
  { month: 'Dec', revenue: 24000, expenses: 8000 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
  label,
}) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="bg-white rounded-[20px] border border-slate-100 shadow-xl p-5 min-w-[220px]">
      <h4 className="text-sm font-medium text-slate-900 mb-4">
        {label} 2026
      </h4>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-violet-600" />
            <span className="text-sm text-slate-600">
              Total Expenses
            </span>
          </div>

          <span className="font-semibold text-slate-900">
            ₹{Number(payload[1]?.value).toLocaleString()}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-violet-200" />
            <span className="text-sm text-slate-600">
              Total Revenue
            </span>
          </div>

          <span className="font-semibold text-slate-900">
            ₹{Number(payload[0]?.value).toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

const Chart: React.FC = () => {
  return (
    <div className="bg-white rounded-[28px] border border-slate-100 p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <h2 className="text-[24px] font-semibold text-slate-900">
            Performance Overview
          </h2>

          <div className="flex items-center gap-6 mt-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-violet-600" />
              <span className="text-sm text-slate-500">
                Total Expenses
              </span>
            </div>

            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-violet-200" />
              <span className="text-sm text-slate-500">
                Total Revenue
              </span>
            </div>
          </div>
        </div>

        <button className="h-12 px-5 rounded-full border border-slate-200 flex items-center gap-2 text-sm text-slate-700">
          This Year
          <ChevronDown size={16} />
        </button>
      </div>

      {/* Chart */}
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            data={data}
            barGap={-58}
            margin={{
              top: 10,
              right: 10,
              left: 0,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient
                id="expenseGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="0%"
                  stopColor="#9F7AEA"
                />
                <stop
                  offset="100%"
                  stopColor="#8B5CF6"
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              vertical={false}
              stroke="#ECECEC"
              strokeDasharray="4 4"
            />

            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#374151',
                fontSize: 14,
                fontWeight: 500,
              }}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: '#6B7280',
                fontSize: 13,
              }}
              tickFormatter={(value) =>
                `${String(value / 1000).padStart(2, '0')}k`
              }
            />

            <Tooltip
              cursor={false}
              content={<CustomTooltip />}
            />

            {/* Revenue Background */}
            <Bar
              dataKey="revenue"
              fill="#ECE9FF"
              radius={[14, 14, 14, 14]}
              barSize={58}
            />

            {/* Expenses Foreground */}
            <Bar
              dataKey="expenses"
              fill="url(#expenseGradient)"
              radius={[14, 14, 14, 14]}
              barSize={58}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default Chart;
