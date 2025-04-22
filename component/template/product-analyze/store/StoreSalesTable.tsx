import React from 'react';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { css } from '@emotion/react';
import { IChannelStoreListItem } from '@InterfaceFarm/product-analyze';
import { Badge } from '@ComponentFarm/atom/Badge/Badge';
import Empty from '@ComponentFarm/atom/Empty/Empty';
import Arrow2Down from '@ComponentFarm/atom/icons/Arrow2Down';
import Arrow2Up from '@ComponentFarm/atom/icons/Arrow2Up';
import { TableSty1 } from '@ComponentFarm/template/common/table/TableSty';

const pageStyle = css`
  td {
    height: 5.6rem;
    padding: 0 1.6rem !important;

    &.comparison_sales_count {
      color: var(--color-gray8);
    }
    &:first-of-type {
      .badge {
        width: 2.42rem;
        height: 2.42rem;
        padding: 0;
        margin-right: 1.6rem;
        justify-content: center;
      }
    }
    .store_name {
      padding-left: 1.6rem;
      font-weight: 600;
    }
  }
`;

const StoreSalesTable = ({
  rankingData,
}: {
  rankingData: IChannelStoreListItem[];
}) => {
  return (
    <TableSty1 css={pageStyle}>
      <colgroup>
        <col width="39%" />
        <col width="20%" />
        <col width="20%" />
        <col width="20%" />
      </colgroup>
      <thead>
        <tr>
          <th scope="col">매장명</th>
          <th scope="col">기준일 판매</th>
          <th scope="col">비교일 판매</th>
          <th scope="col">증감율</th>
        </tr>
      </thead>
      <tbody>
        {rankingData.length === 0 ? (
          <tr>
            <td colSpan={4}>
              <Empty Icon={<IoAlertCircleOutline size={42} />}>
                해당 조회 조건의 판매 현황 데이터가 없습니다.
              </Empty>
            </td>
          </tr>
        ) : (
          rankingData.map(el => (
            <tr key={el.store_idx}>
              <td>
                <Badge
                  color={el.ranking > 3 ? 'gray' : 'indigo'}
                  size="circle"
                  hasBorder={false}
                >
                  {el.ranking}
                </Badge>
                <span className="store_name"> {el.store_name}</span>
              </td>
              <td>{el.base_sales_count.toLocaleString()}</td>
              <td className="comparison_sales_count">
                {el.comparison_sales_count.toLocaleString()}
              </td>
              <td>
                <Badge
                  type="square"
                  color={
                    el.increase_decrease_rate > 0
                      ? 'green'
                      : el.increase_decrease_rate < 0
                      ? 'red'
                      : 'yellow'
                  }
                  LeadingIcon={
                    el.increase_decrease_rate > 0 ? (
                      <Arrow2Up
                        customCss={css`
                          path {
                            fill: var(--bage-greenLabel);
                          }
                        `}
                      />
                    ) : el.increase_decrease_rate < 0 ? (
                      <Arrow2Down
                        customCss={css`
                          path {
                            fill: var(--bage-redLabel);
                          }
                        `}
                      />
                    ) : (
                      <></>
                    )
                  }
                >
                  {String(
                    Math.ceil(el.increase_decrease_rate).toLocaleString()
                  ).replace('-', '')}
                  %
                </Badge>
              </td>
            </tr>
          ))
        )}
      </tbody>
    </TableSty1>
  );
};

export default StoreSalesTable;
