import React, { useState } from 'react';
import { IoAlertCircleOutline } from 'react-icons/io5';
import { useQuery } from 'react-query';
import { css } from '@emotion/react';
import { fetchMenuSalesOverall } from '@ApiFarm/menu-analyze-beta';
import { Button } from '@ComponentFarm/atom/Button/Button';
import Empty from '@ComponentFarm/atom/Empty/Empty';
import SkeletonTh from '@ComponentFarm/atom/Skeleton/SkeletonTh';
import { TableSty1 } from '@ComponentFarm/template/common/table/TableSty';
import { QueryParams } from '@HookFarm/useQueryParams';
import { MenuSalesModal } from './MenuSalesModal';

interface SelectedMenu {
  menuMasterId: number;
  menuName: string;
  menuClassification: string;
  menuCategoryName: string;
  type: 'child' | 'parent';
}

export const MenuAnalyzeTable = ({ params }: { params: QueryParams }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState<SelectedMenu | null>(null);

  const { isLoading, data } = useQuery(['menuSalesOverall', params], () =>
    fetchMenuSalesOverall(params as any)
  );

  const getMenuClassification = (classification: string) => {
    switch (classification) {
      case 'GENERAL':
        return '일반';
      case 'FLAGSHIP':
        return '플래그십';
      case 'PROMOTION':
        return '프로모션';
      default:
        return '';
    }
  };

  const handleViewMenu = (
    menuMasterIdx: number,
    menuName: string,
    menuClassification: string,
    menuCategoryName: string,
    type: 'child' | 'parent'
  ) => {
    setSelectedMenu({
      menuMasterId: menuMasterIdx,
      menuName,
      menuClassification,
      menuCategoryName,
      type,
    });
    setIsModalOpen(true);
  };

  return (
    <>
      <TableSty1
        css={css`
          tr:last-of-type td {
            border-bottom: none;
          }
          th {
            &:not(:nth-of-type(1)) {
              padding: 0;
            }
          }
          th,
          td {
            border: 1px solid var(--color-neutral90);
            text-align: center !important;

            &:first-of-type {
              border-left: none;
            }
            &:last-of-type {
              border-right: none;
            }
          }
        `}
      >
        <colgroup>
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="20%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
          <col width="10%" />
        </colgroup>
        <thead>
          <tr>
            <th>순위</th>
            <th>메뉴 구분</th>
            <th>카테고리</th>
            <th>메뉴명</th>
            <th>총 판매량</th>
            <th>주 메뉴 판매량</th>
            <th>옵션 판매량</th>
            <th>상/하위 메뉴 보기</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <SkeletonTh colLength={5} />
          ) : data?.result_list && data.result_list.length > 0 ? (
            data.result_list.map(item => (
              <tr key={item.menu_master_idx}>
                <td>{item.ranking}</td>
                <td>{getMenuClassification(item.menu_classification)}</td>
                <td>{item.menu_category_name}</td>
                <td>{item.menu_name}</td>
                <td>{item.sum_quantity.toLocaleString()}</td>
                <td>{item.main_quantity.toLocaleString()}</td>
                <td>{item.option_quantity.toLocaleString()}</td>
                <td>
                  <div
                    css={css`
                      display: flex;
                      justify-content: center;

                      button:first-child {
                        margin-right: 0.5rem;
                      }
                    `}
                  >
                    <Button
                      variant="gostSecondary"
                      size="sm"
                      onClick={() =>
                        handleViewMenu(
                          item.menu_master_idx,
                          item.menu_name,
                          item.menu_classification,
                          item.menu_category_name,
                          'parent'
                        )
                      }
                    >
                      상위
                    </Button>
                    <Button
                      variant="gostSecondary"
                      size="sm"
                      onClick={() =>
                        handleViewMenu(
                          item.menu_master_idx,
                          item.menu_name,
                          item.menu_classification,
                          item.menu_category_name,
                          'child'
                        )
                      }
                    >
                      하위
                    </Button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={8}>
                <Empty Icon={<IoAlertCircleOutline size={42} />}>
                  조회된 결과가 없습니다.
                </Empty>
              </td>
            </tr>
          )}
        </tbody>
      </TableSty1>
      <MenuSalesModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMenu(null);
        }}
        selectedMenu={selectedMenu}
        params={params}
      />
    </>
  );
};
