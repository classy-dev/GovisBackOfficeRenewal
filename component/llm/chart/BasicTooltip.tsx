import React from 'react';
import styled from '@emotion/styled';

const BasicTooltipWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 1.6rem;
  position: relative;
  padding: 1.6rem;
  border: 1px solid #e5e5e5;
  border-radius: 0.4rem;
  background: #fff;
  box-shadow: 0px 2.55556px 5.11111px 0px rgba(0, 0, 0, 0.04);
  .btn_close {
    position: absolute;
    bottom: -13px;
    left: 50%;
    transform: translateX(-50%);
  }

  dl {
    dt {
      margin-bottom: 0.6rem;
      color: var(--gray400);
      font-size: 1.2rem;
      font-weight: 400;
      line-height: 120%;
    }
    dd {
      display: flex;
      span {
        &:nth-of-type(1) {
          margin-right: 0.4rem;
          color: #242424;
          font-family: 'Inter';
          font-size: 2rem;
          font-weight: 500;
        }
      }
    }
  }
`;

export const BasicTooltip = ({
  active,
  payload,
  tooltipLabel,
}: {
  active?: boolean;
  payload?: any;
  tooltipLabel?: string;
}) => {
  if (active && payload?.[0]?.payload) {
    const data = payload[0].payload;
    const isDonutChart = 'base_sales_count' in data;

    return (
      <BasicTooltipWrap>
        <dl>
          <dt>상세 정보</dt>
          <dd>
            <span>{data.fullLabel || data.item_label}</span>
          </dd>
        </dl>
        <dl>
          <dt>{tooltipLabel || '매장별 메뉴 주문 수량'}</dt>
          <dd>
            <span>
              {isDonutChart
                ? data.base_sales_count?.toLocaleString()
                : data.value?.toLocaleString()}
            </span>
          </dd>
        </dl>
      </BasicTooltipWrap>
    );
  }

  return null;
};
