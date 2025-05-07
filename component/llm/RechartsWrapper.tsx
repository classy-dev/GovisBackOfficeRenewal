import React from 'react';
import styled from '@emotion/styled';
import { BarCharts } from './chart/BarCharts';
import DonutChart from './chart/DonutChart';
import LineChart from './chart/LineChart';
import { OrderDonutLegend } from './chart/OrderDonutLegend';

interface ChartData {
  item_label: string;
  value?: number;
  base_sales_count?: number;
  comparison_sales_count?: number;
  increase_decrease_rate?: number;
  fill?: string;
  fullLabel?: string;
}

interface RechartsWrapperProps {
  type: 'bar' | 'donut' | 'line';
  data: ChartData[];
  options: any;
  title?: string;
}

const RechartsWrapper: React.FC<RechartsWrapperProps> = ({
  type,
  data,
  options = {},
  title,
}) => {
  const transformData = (
    rawData: Array<{
      item_label: string;
      value: number;
      fullLabel?: string;
    }>
  ) => {
    if (type === 'bar') {
      return rawData.map(item => ({
        item_label: item.item_label,
        value: item.value || 0,
        fullLabel: item.fullLabel || item.item_label,
      }));
    }

    if (type === 'donut') {
      return rawData;
    }

    if (type === 'line') {
      return rawData.map(item => ({
        item_label: item.item_label,
        value: item.value || 0,
        fullLabel: item.fullLabel || item.item_label,
      }));
    }

    return rawData;
  };

  const ChartContainer = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
  `;

  const ChartTitle = styled.h3`
    text-align: center;
    margin-bottom: 1rem;
    font-size: 1.6rem;
    font-weight: 500;
    color: var(--color-neutral10);
  `;

  const ScrollableContainer = styled.div`
    width: 100%;
    height: 100%;
    overflow-x: auto;
    overflow-y: hidden;

    /* 스크롤바 스타일링 */
    &::-webkit-scrollbar {
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: #888;
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb:hover {
      background: #555;
    }
  `;

  const ChartWrapper = styled.div<{ minWidth?: string }>`
    min-width: ${props =>
      props.minWidth || '800px'}; // 데이터 수에 따라 동적으로 조정
    height: 100%;
    padding-bottom: 2rem;
  `;

  const transformedData = transformData(
    data as Array<{
      item_label: string;
      value: number;
      fullLabel?: string;
    }>
  );
  // console.log('Transformed Chart Data:', transformedData);

  // 데이터 수에 따라 최소 너비 계산
  const getMinWidth = () => {
    if (type === 'bar') {
      const dataLength = transformedData.length || 0;
      // 각 바의 최소 너비를 30px로 가정하고, 여백 포함
      return `${Math.max(800, dataLength * 50)}px`;
    }
    return '800px';
  };

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <BarCharts
            height={options?.height || '55rem'}
            chartData={transformedData}
            barSize={options?.barSize || 6}
            tickCount={options?.tickCount || 11}
            xTickFormatter={options?.xTickFormatter}
            fill={options?.fill || 'var(--color-orange90)'}
            tooltipLabel={options?.tooltipLabel}
          />
        );
      case 'donut':
        return (
          <DonutChart
            height="55rem"
            chartData={transformedData}
            legend={<OrderDonutLegend />}
          />
        );
      case 'line':
        return (
          <LineChart
            data={transformedData}
            options={{
              height: options?.height || '55rem',
              margin: options?.margin,
              xAxisAngle: options?.xAxisAngle,
              tooltipLabel: options?.tooltipLabel,
              connectNulls: options?.connectNulls,
              dot: options?.dot,
              strokeWidth: options?.strokeWidth,
              areaOpacity: options?.areaOpacity,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <ChartContainer>
      {title && <ChartTitle>{title}</ChartTitle>}
      <ScrollableContainer>
        <ChartWrapper minWidth={getMinWidth()}>{renderChart()}</ChartWrapper>
      </ScrollableContainer>
    </ChartContainer>
  );
};

export default RechartsWrapper;
