import React from 'react';
import styled from '@emotion/styled';

const OrderDonutLegendWrap = styled.ul`
  display: grid;
  width: fit-content;
  margin: 0 auto;
  gap: 3.2rem;
  grid-template-columns: 1fr 1fr 1fr;
  margin: 0 auto;

  li {
    display: flex;
    align-items: center;
    margin-bottom: 0.4rem;

    dt {
      display: flex;
      align-items: center;
      .dot {
        display: block;
        width: 1.2rem;
        height: 1.2rem;
        margin-right: 0.8rem;
        border-radius: 50%;
      }
      .txt {
        color: var(--color-neutral50);
        font-size: 1.4rem;
        font-weight: 400;
        line-height: 120%;
      }
    }

    dd {
      margin-top: 1rem;
      padding-left: 2rem;

      .base_sales_count {
        color: var(--color-neutral10);
        font-size: 2.4rem;
        font-weight: 700;
        line-height: 110%;
      }

      .comparison_sales_count,
      .rate {
        display: none;
      }
    }
  }
`;

export const OrderDonutLegend = (props: any) => {
  const { payload } = props;

  return (
    <OrderDonutLegendWrap>
      {payload.map((data: any, index: number) => (
        <li key={`item-${index}`}>
          <dl>
            <dt>
              <span className="dot" style={{ background: data.payload.fill }} />
              <span className="txt">{data.payload.item_label}</span>
            </dt>
            <dd>
              <div>
                <span className="base_sales_count">
                  {data.payload.base_sales_count.toLocaleString()}
                </span>
              </div>
            </dd>
          </dl>
        </li>
      ))}
    </OrderDonutLegendWrap>
  );
};
