import React from 'react';
import { useQuery } from 'react-query';
import { fetchMenuCategoryList } from '@ApiFarm/menu-management';
import { IMenuMasterRes, ISearcPopupProps } from '@InterfaceFarm/search-modal';
import { Select } from '@ComponentFarm/atom/Select/Select';
import SearchPopup, { ICommonResultData } from './SearchPopup';

interface IMenuMasterResultData extends ICommonResultData {
  classification: string;
  category: string;
  label: string;
}

const MenuMasterSearchPopup = ({
  setConfig,
  data,
}: {
  setConfig: ISearcPopupProps;
  data?: IMenuMasterRes;
}) => {
  const {
    isOpen,
    setIsOpen,
    selectItems,
    setSelectItems,
    initialValues,
    filters,
    setFilters,
  } = setConfig;

  // 메뉴 구분 옵션
  const menuClassificationOptions = [
    { value: '', label: '전체' },
    { value: 'GENERAL', label: '일반' },
    { value: 'FLAGSHIP', label: '플래그십' },
    { value: 'PROMOTION', label: '프로모션' },
  ];

  // 카테고리 목록 조회
  const { data: categoryData } = useQuery(
    ['menuCategory', filters.menu_classification],
    () =>
      fetchMenuCategoryList({
        menu_classification: (filters.menu_classification as any) || undefined,
      }),
    {
      enabled: isOpen && !!filters.menu_classification,
    }
  );

  // 카테고리 옵션
  const categoryOptions = React.useMemo(() => {
    const options = [{ value: '', label: '전체' }];
    if (categoryData?.result_list) {
      categoryData.result_list.forEach(category => {
        options.push({
          value: String(category.menu_category_idx),
          label: category.menu_category_name,
        });
      });
    }
    return options;
  }, [categoryData]);

  // 테이블 셋팅
  const tableCofig = {
    th: ['메뉴 구분', '카테고리', '메뉴명'],
    col: [120, 120, 180],
  };

  // 검색 테이블에 맞추어 정리
  const resultData: IMenuMasterResultData[] =
    data?.result_list
      ?.map(el => {
        return {
          idx: el.menu_master_idx,
          classification:
            el.menu_classification === 'GENERAL'
              ? '일반'
              : el.menu_classification === 'FLAGSHIP'
              ? '플래그십'
              : '프로모션',
          originalClassification: el.menu_classification,
          category: el.menu_category_name,
          label: el.menu_name,
        };
      })
      .sort((a, b) => {
        const order = {
          GENERAL: 1,
          FLAGSHIP: 2,
          PROMOTION: 3,
        };

        return (
          order[a.originalClassification as keyof typeof order] -
          order[b.originalClassification as keyof typeof order]
        );
      })
      .map(({ originalClassification, ...rest }) => rest) || [];

  const customFilter = (
    <div className="wrap_input">
      <Select
        options={menuClassificationOptions}
        selectedOption={filters.menu_classification || ''}
        setSelectedOption={option => {
          // 메뉴 구분이 변경되면 카테고리 초기화
          setFilters(prev => ({
            ...prev,
            menu_classification:
              typeof option === 'string' ? option : option.value,
            menu_category_idx: '',
          }));
        }}
        prefixLabel="메뉴 구분"
        placeholder="전체"
      />
      <Select
        options={categoryOptions}
        selectedOption={filters.menu_category_idx || ''}
        setSelectedOption={option =>
          setFilters(prev => ({
            ...prev,
            menu_category_idx:
              typeof option === 'string' ? option : option.value,
          }))
        }
        prefixLabel="카테고리"
        placeholder="전체"
      />
    </div>
  );

  return (
    <SearchPopup<IMenuMasterResultData>
      title="메뉴 상세 설정"
      searchBoxPlaceHolder="메뉴명을 입력해주세요"
      keyWordSearchTitle="메뉴명"
      width={646}
      customFilter={customFilter}
      tableCofig={tableCofig}
      resultData={resultData}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      filters={filters}
      setFilters={setFilters}
      initialValues={initialValues}
      selectItems={selectItems}
      setSelectItems={setSelectItems}
      badge={['표시', '숨김']}
    />
  );
};

export default MenuMasterSearchPopup;
