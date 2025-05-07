import React from 'react';
import { useQuery } from 'react-query';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import {
  fetchMenuSalesChild,
  fetchMenuSalesParent,
} from '@ApiFarm/menu-analyze-beta';
import Modal from '@ComponentFarm/modules/Modal/Modal';
import { TableSty1 } from '@ComponentFarm/template/common/table/TableSty';
import { QueryParams } from '@HookFarm/useQueryParams';

interface SelectedMenu {
  menuMasterId: number;
  menuName: string;
  menuClassification: string;
  menuCategoryName: string;
  type: 'child' | 'parent';
}

interface MenuSalesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMenu: SelectedMenu | null;
  params: QueryParams;
}

const ListContainer = styled.div`
  border: 1px solid var(--color-neutral90);

  ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
    width: 100%;
  }

  .list-header,
  .list-item {
    display: flex;
    align-items: center;
    border-bottom: 1px solid var(--color-neutral90);
  }

  .list-header {
    height: 4.8rem;
    background: var(--color-blue_gray10);
    font-weight: 500;
    color: var(--color-gray500);
    border-top: 1px solid var(--color-neutral90);
  }

  .list-item {
    padding: 1.2rem 0;
    background-color: var(--color-gray1);
  }

  .list-header > div,
  .list-item > div {
    padding-left: 2rem;
    text-align: center;
  }
`;

const ScrollableList = styled.div`
  overflow-y: auto;
  max-height: 19.3rem;
`;

const TableExpectWrap = styled(ListContainer)`
  border-color: var(--color-blue60);

  h3 {
    padding: 2rem;
    font-size: 1.4rem;
    font-weight: 600;

    .desc {
      margin-left: 1rem;
      font-size: 1.2rem;
      color: #687182;
    }
  }
`;

export const MenuSalesModal = ({
  isOpen,
  onClose,
  selectedMenu,
  params,
}: MenuSalesModalProps) => {
  const { data: childMenuData } = useQuery(
    ['MenuSalesChild', selectedMenu?.menuMasterId, params],
    () =>
      selectedMenu?.type === 'child'
        ? fetchMenuSalesChild(selectedMenu.menuMasterId, params as any)
        : null,
    {
      enabled: !!selectedMenu && isOpen && selectedMenu.type === 'child',
    }
  );

  const { data: parentMenuData } = useQuery(
    ['MenuSalesParent', selectedMenu?.menuMasterId, params],
    () =>
      selectedMenu?.type === 'parent'
        ? fetchMenuSalesParent(selectedMenu.menuMasterId, params as any)
        : null,
    {
      enabled: !!selectedMenu && isOpen && selectedMenu.type === 'parent',
    }
  );

  const menuData =
    selectedMenu?.type === 'child' ? childMenuData : parentMenuData;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${
        selectedMenu?.type === 'child' ? '하위' : '상위'
      } 메뉴 판매 순위`}
      showButtons={false}
      showCloseButton
    >
      {selectedMenu && (
        <TableExpectWrap>
          <h3>
            선택된 메뉴
            <span className="desc">
              해당 판매 메뉴가 옵션으로 포함되어 있는{' '}
              {selectedMenu.type === 'child' ? '하위' : '상위'} 메뉴 판매량과
              순위를 분석합니다.
            </span>
          </h3>
          <ul>
            <li className="list-header">
              <div style={{ width: '30%' }}>구분</div>
              <div style={{ width: '35%' }}>카테고리</div>
              <div style={{ width: '35%' }}>메뉴명</div>
            </li>
          </ul>
          <ScrollableList>
            <ul>
              <li className="list-item">
                <div style={{ width: '30%' }}>
                  {selectedMenu.menuClassification === 'GENERAL'
                    ? '일반'
                    : selectedMenu.menuClassification === 'FLAGSHIP'
                    ? '플래그십'
                    : '프로모션'}
                </div>
                <div style={{ width: '35%' }}>
                  {selectedMenu.menuCategoryName}
                </div>
                <div style={{ width: '35%' }}>{selectedMenu.menuName}</div>
              </li>
            </ul>
          </ScrollableList>
        </TableExpectWrap>
      )}
      <div
        css={css`
          overflow-y: auto;
          width: 60rem;
          max-height: 60rem;
          margin-top: 3rem;
        `}
      >
        {/* 기존 테이블 */}
        {menuData && (
          <TableSty1
            css={css`
              td,
              th {
                border-right: 0;
                text-align: center !important;
              }
            `}
          >
            <colgroup>
              <col width="15%" />
              <col width="20%" />
              <col width="20%" />
              <col width="25%" />
              <col width="20%" />
            </colgroup>
            <thead>
              <tr>
                <th>순위</th>
                <th>메뉴 구분</th>
                <th>카테고리</th>
                <th>메뉴명</th>
                <th>판매량</th>
              </tr>
            </thead>
            <tbody>
              {menuData?.result_list?.length > 0 ? (
                menuData?.result_list?.map((item: any) => (
                  <tr key={item.menu_master_idx}>
                    <td>{item.ranking}</td>
                    <td>
                      {item.menu_classification === 'GENERAL'
                        ? '일반'
                        : item.menu_classification === 'FLAGSHIP'
                        ? '플래그십'
                        : '프로모션'}
                    </td>
                    <td>{item.menu_category_name}</td>
                    <td>{item.menu_name}</td>
                    <td>{item.sum_quantity.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    {selectedMenu?.type === 'child' ? '하위' : '상위'} 메뉴가
                    없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </TableSty1>
        )}
      </div>
    </Modal>
  );
};
