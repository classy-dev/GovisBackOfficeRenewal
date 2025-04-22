import React from 'react';
import { IoAlertCircleOutline } from 'react-icons/io5';
import Skeleton from 'react-loading-skeleton';
import { css } from '@emotion/react';
import { IChannelRes } from '@InterfaceFarm/product-analyze';
import { Badge } from '@ComponentFarm/atom/Badge/Badge';
import Empty from '@ComponentFarm/atom/Empty/Empty';
import { StoreStr } from '@ComponentFarm/modal/SearchPopup/const';
import { TableSty2 } from '@ComponentFarm/template/common/table/TableSty';
import { getTableWidthPercentage } from '@UtilFarm/calcSize';

const pageStyle = css`
  td {
    &.tl {
      text-align: left;
    }

    &:nth-of-type(3) {
      padding: 0;
      text-align: center;
    }
  }
`;

const SalesProductTable = ({
  data,
  isLoading,
}: {
  data?: IChannelRes;
  isLoading?: boolean;
}) => {
  if (isLoading) {
    return <Skeleton height="40rem" baseColor="#fcfcfc" />;
  }

  return (
    <TableSty2 css={pageStyle}>
      <colgroup>
        {[140, 260, 110, 342, 342, 342].map((el, i) => (
          <col key={i} width={getTableWidthPercentage(el, 1536)} />
        ))}
      </colgroup>
      <thead>
        <tr>
          <th colSpan={3}>전체 {data?.list.length}개</th>
          <th>{data?.total.total_base_sales_count.toLocaleString()} 개</th>
          <th>{data?.total.total_comparison_sales_count.toLocaleString()}개</th>
          <th>
            {data?.total.total_increase_decrease_number.toLocaleString()}개 (
            {data && data?.total.total_increase_decrease_rate > 0 && '+'}
            {data?.total.total_increase_decrease_rate.toLocaleString()}%)
          </th>
        </tr>
        <tr>
          <th>구분</th>
          <th>매장명</th>
          <th>상태</th>
          <th>기준일 판매</th>
          <th>비교일 판매</th>
          <th>증감율</th>
        </tr>
      </thead>
      <tbody>
        {data?.total.total_base_sales_count === 0 &&
        data?.total.total_comparison_sales_count === 0 ? (
          <tr>
            <td colSpan={6}>
              <Empty Icon={<IoAlertCircleOutline size={42} />}>
                해당 조회 조건의 판매 수 데이터가 없습니다.
              </Empty>
            </td>
          </tr>
        ) : (
          data?.list.map((el, i) => (
            <tr key={i}>
              <td className="tl">{StoreStr[el.store_type_code]}</td>
              <td className="tl">{el.store_name}</td>
              <td className="tl">
                <Badge
                  color={
                    el.store_status_value === '운영중'
                      ? 'green'
                      : el.store_status_value === '폐업'
                      ? 'red'
                      : 'yellow'
                  }
                  size="sm"
                  dot
                >
                  {String(el.store_status_value)}
                </Badge>
              </td>
              <td>{el.base_sales_count.toLocaleString()}개</td>
              <td>{el.comparison_sales_count.toLocaleString()}개</td>
              <td>
                {el.increase_decrease_number.toLocaleString()}개 (
                {el.increase_decrease_rate > 0 && '+'}
                {el.increase_decrease_rate.toLocaleString()}%)
              </td>
            </tr>
          ))
        )}
      </tbody>
    </TableSty2>
  );
};

export default SalesProductTable;
