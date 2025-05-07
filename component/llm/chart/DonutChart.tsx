import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { ResponsiveContainer, PieChart, Pie, Legend, Tooltip } from 'recharts';
import { BasicTooltip } from './BasicTooltip';
import { DonutBasicLegend } from './DonutBasicLegend';

type renderCustomizedLabelProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: renderCustomizedLabelProps) => {
  // 중앙에 텍스트를 정렬하기 위한 x, y 좌표 계산
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white" // 텍스트 색상을 흰색으로 변경
      textAnchor="middle" // 텍스트를 가운데 정렬
      dominantBaseline="central"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const DonutChart = ({
  chartData,
  height,
  legend = <DonutBasicLegend />,
  toolTip = <BasicTooltip />,
}: {
  chartData: any;
  height: string;
  legend?: any;
  toolTip?: any;
}) => {
  // Mock data

  return (
    <div style={{ height }}>
      {chartData ? (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              innerRadius="50%"
              outerRadius="70%"
              fill="#8884d8"
              paddingAngle={5}
              dataKey="base_sales_count"
            />

            <Legend
              layout="vertical"
              verticalAlign="bottom"
              align="center"
              content={legend}
              wrapperStyle={{ width: '100%' }}
            />
            <Tooltip content={toolTip} />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <Skeleton height={height} baseColor="#fcfcfc" />
      )}
    </div>
  );
};

export default DonutChart;
