import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export const formatNumber = (value: number): string => {
  // 1000 단위로 쉼표 추가
  return new Intl.NumberFormat('ko-KR').format(value);
};

interface LineChartProps {
  data: Array<{
    item_label: string;
    value: number;
    fullLabel?: string;
  }>;
  options: {
    height?: string;
    margin?: { top: number; right: number; bottom: number; left: number };
    xAxisAngle?: number;
    tooltipLabel?: string;
    connectNulls?: boolean;
    dot?: boolean;
    strokeWidth?: number;
    areaOpacity?: number;
  };
}

const CustomLineChart: React.FC<LineChartProps> = ({ data, options }) => {
  const {
    height = '400px',
    margin = { top: 20, right: 30, bottom: 120, left: 60 },
    tooltipLabel = '데이터 값',
    connectNulls = true,
    dot = true,
    strokeWidth = 2,
  } = options;

  const normalizedData = data.map(item => ({
    item_label: item.item_label,
    value: Number(item.value),
    fullLabel: item.fullLabel || item.item_label,
  }));

  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={normalizedData} margin={margin}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="item_label"
            angle={-30}
            interval={0}
            textAnchor="end"
            height={100}
          />
          <YAxis tickFormatter={value => formatNumber(value)} />
          <Tooltip
            formatter={(value: number) => [formatNumber(value), tooltipLabel]}
            labelFormatter={label =>
              normalizedData.find(item => item.item_label === label)
                ?.fullLabel || label
            }
          />
          <Line
            type="monotone"
            dataKey="value"
            stroke="#3B82F6"
            strokeWidth={strokeWidth}
            dot={dot}
            connectNulls={connectNulls}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CustomLineChart;
