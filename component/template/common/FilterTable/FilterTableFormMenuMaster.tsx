import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { useQuery } from 'react-query';
import {
  fetchMenuMasterList,
  fetchStoreSearchModal,
} from '@ApiFarm/search-modal';
import {
  DiffDateRanger,
  DiffDateType,
} from '@ComponentFarm/modules/DateRange/DiffDateRanger';
import { Button } from '@ComponentFarm/atom/Button/Button';
import MenuMasterSearchPopup from '@ComponentFarm/modal/SearchPopup/MenuMasterSearchPopup';
import StoreSearchPopup from '@ComponentFarm/modal/SearchPopup/StoreSearchPopup';
import { QueryParams } from '@HookFarm/useQueryParams';
import { getTableWidthPercentage } from '@UtilFarm/calcSize';
import SelectItemsList from './SelectItemsList';
import { FilterTable, FilterTableBtnBox } from './style';
import useSelectItems from './useFilterHandler';

interface FilterTableFormProps {
  type?: string;
  dateKeys?: {
    startKey: string;
    endKey: string;
  };
  maxDateRanger?: number;
  params: QueryParams;
  periodHidden?: boolean;
  updateParams: (newParams: QueryParams) => void;
  resetParams: () => void;
}

const FilterTableForm = ({
  type,
  dateKeys = {
    startKey: 'order_dt_start',
    endKey: 'order_dt_finish',
  },
  maxDateRanger,
  params,
  periodHidden = false,
  updateParams,
  resetParams,
}: FilterTableFormProps) => {
  // 기간 선택
  const [selectedDateRanges, setSelectedDateRanges] = useState<DiffDateType>({
    range1: [null, null],
  });

  // 팝업
  const menuMasterSelect = useSelectItems('menu_name');
  const storeSelect = useSelectItems('store_name');

  const { data: menuMasterData } = useQuery(
    ['menuMaster', menuMasterSelect.filters],
    () => fetchMenuMasterList(menuMasterSelect?.filters),
    {
      cacheTime: 0,
      enabled: menuMasterSelect.isOpen || !!params.menu_master_idx,
    }
  );

  const { data: storeModalData } = useQuery(
    ['searchModal', 'store', storeSelect.filters],
    () => fetchStoreSearchModal(storeSelect.filters),
    { cacheTime: 0, enabled: storeSelect.isOpen || !!params.store_idx }
  );

  const filterItems = [
    {
      title: '메뉴 구분',
      select: menuMasterSelect,
    },
    {
      title: '매장 구분',
      select: storeSelect,
    },
  ];

  // params에 따른 초기화
  useEffect(() => {
    if (params.menu_master_idx && menuMasterSelect?.isFirstLoad) {
      const setMenuItems = menuMasterData?.result_list
        ?.filter(item =>
          String(params.menu_master_idx)
            .split(',')
            .includes(item.menu_master_idx.toString())
        )
        ?.map(item => ({
          idx: String(item.menu_master_idx),
          name: item.menu_name,
        }));
      if (setMenuItems) {
        menuMasterSelect?.setSelectItems(setMenuItems);
        menuMasterSelect?.setIsFirstLoad(false);
      }
    }
    if (params.store_idx && storeSelect?.isFirstLoad) {
      const setStoreItems = storeModalData?.list
        .filter(item =>
          String(params.store_idx)
            .split(',')
            .includes(item.store_idx.toString())
        )
        ?.map(item => ({
          idx: String(item.store_idx),
          name: item.store_name,
        }));
      if (setStoreItems) {
        storeSelect?.setSelectItems(setStoreItems);
        storeSelect?.setIsFirstLoad(false);
      }
    }
  }, [
    params.menu_master_idx,
    menuMasterData?.result_list,
    params.store_idx,
    storeModalData?.list,
  ]);

  useEffect(() => {
    // URL 파라미터에 날짜가 있는 경우 해당 값을 사용
    if (params[dateKeys.startKey] && params[dateKeys.endKey]) {
      setSelectedDateRanges({
        range1: [
          dayjs(params[dateKeys.startKey]).toDate(),
          dayjs(params[dateKeys.endKey]).toDate(),
        ],
        range2: undefined,
      });
    } else {
      // URL 파라미터에 날짜가 없는 경우에만 기본 날짜 설정
      setSelectedDateRanges({
        range1: [
          dayjs().subtract(1, 'day').toDate(),
          dayjs().subtract(1, 'day').toDate(),
        ],
        range2: undefined,
      });
    }
  }, [params[dateKeys.startKey], params[dateKeys.endKey]]);

  const handleFilterResult = async () => {
    const { range1 } = selectedDateRanges;

    let newParams: any = {};

    // 날짜 파라미터 추가
    if (range1 && range1.every(date => date !== null)) {
      newParams = {
        ...newParams,
        order_dt_start: dayjs(range1[0]).format('YYYY-MM-DD'),
        order_dt_finish: dayjs(range1[1]).format('YYYY-MM-DD'),
      };
    }

    // menu_master_idx와 텍스트 추가
    const menuMasterIds = menuMasterSelect.selectItems
      .map(item => item.idx)
      .join(',');
    if (menuMasterIds) {
      newParams.menu_master_idx = menuMasterIds;
      // 텍스트 생성 및 추가
      newParams.menu_master_text =
        menuMasterSelect.selectItems.length > 4
          ? `${menuMasterSelect.selectItems[0].name} 외 ${
              menuMasterSelect.selectItems.length - 1
            }개`
          : menuMasterSelect.selectItems.map(item => item.name).join(', ');
    }

    // store_idx와 텍스트 추가
    const storeIds = storeSelect.selectItems.map(item => item.idx).join(',');
    if (storeIds) {
      newParams.store_idx = storeIds;
      // 텍스트 생성 및 추가
      newParams.store_text =
        storeSelect.selectItems.length > 4
          ? `${storeSelect.selectItems[0].name} 외 ${
              storeSelect.selectItems.length - 1
            }개`
          : storeSelect.selectItems.map(item => item.name).join(', ');
    }

    updateParams(newParams);
  };

  const handlerReset = () => {
    // 기본 날짜 설정
    const defaultDates: DiffDateType = {
      range1: [
        dayjs().subtract(1, 'day').toDate(),
        dayjs().subtract(1, 'day').toDate(),
      ] as [Date | null, Date | null],
      range2:
        type === 'diff'
          ? ([null, null] as [Date | null, Date | null])
          : undefined,
    };

    setSelectedDateRanges(defaultDates);
    menuMasterSelect.setSelectItems([]);
    storeSelect.setSelectItems([]);

    // periodHidden이 true면 날짜 파라미터 제외하고 리셋
    if (periodHidden) {
      resetParams();
    } else {
      // 날짜만 포함된 초기 상태로 리셋
      updateParams({
        order_dt_start: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        order_dt_finish: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        menu_master_idx: undefined, // 메뉴 관련 파라미터 초기화
        menu_master_text: undefined,
        store_idx: undefined, // 매장 관련 파라미터 초기화
        store_text: undefined,
      });
    }
  };

  return (
    <>
      <FilterTable>
        <colgroup>
          <col width={getTableWidthPercentage(120)} />
          <col width={getTableWidthPercentage(1416)} />
        </colgroup>
        <tbody>
          {!periodHidden && (
            <tr>
              <th scope="row">기간 선택</th>
              <td>
                <DiffDateRanger
                  type={type}
                  selectedDateRanges={selectedDateRanges}
                  setSelectedDateRanges={setSelectedDateRanges}
                  params={params}
                  dateKeys={dateKeys}
                  maxDateRanger={maxDateRanger}
                />
              </td>
            </tr>
          )}
          {filterItems.map(({ title, select }) => (
            <SelectItemsList
              key={title}
              title={title}
              items={select.selectItems}
              itemsSetting={select.setSelectItems}
              openModal={() => select.setIsOpen(true)}
              deleteItem={select.handleDeleteItem}
            />
          ))}
        </tbody>
      </FilterTable>
      <MenuMasterSearchPopup
        setConfig={menuMasterSelect}
        data={menuMasterData}
      />
      <StoreSearchPopup setConfig={storeSelect} data={storeModalData} />
      <FilterTableBtnBox>
        <Button variant="gostSecondary" onClick={handlerReset}>
          초기화
        </Button>
        <Button variant="primary" onClick={handleFilterResult}>
          조회
        </Button>
      </FilterTableBtnBox>
    </>
  );
};

export default FilterTableForm;
