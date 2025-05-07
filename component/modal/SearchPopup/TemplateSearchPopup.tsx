import React from 'react';
import dayjs from 'dayjs';
import { css } from '@emotion/react';
import { ISearcPopupProps } from '@InterfaceFarm/search-modal';
import { ISalesKeyinTemplateListRes } from '@InterfaceFarm/store-sales-hand';
import SearchPopup, { ICommonResultData } from './SearchPopup';

interface ITemplateResultData extends ICommonResultData {
  store_count: number;
  registrant: string;
  registration_date: string;
}

const TemplateSearchPopup = ({
  setConfig,
  data,
}: {
  setConfig: ISearcPopupProps;
  data?: ISalesKeyinTemplateListRes;
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

  // 테이블 설정
  const tableCofig = {
    th: ['템플릿명', '매장 수', '등록자', '등록일시'],
    col: [100, 140, 120, 150, 150],
  };

  // 검색 대상 옵션
  const searchTargetOptions = [
    { value: 'template_name', label: '템플릿명' },
    { value: 'registrant_name', label: '등록자' },
  ];

  // 검색 테이블에 맞추어 정리
  const resultData =
    data?.result_list?.map(el => {
      return {
        idx: el.sales_keyin_template_idx,
        label: el.template_name,
        store_count: el.store_count,
        registrant: el.registrant_name,
        registration_date: dayjs(el.registration_date).format(
          'YYYY-MM-DD HH:mm'
        ),
      };
    }) || [];

  return (
    <div
      css={css`
        table {
          display: none !importnat;
        }
      `}
    >
      <SearchPopup<ITemplateResultData>
        title="템플릿 검색"
        type="radio"
        keyWordSearchTitle="검색"
        width={670}
        tableCofig={tableCofig}
        resultData={resultData}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        filters={filters}
        setFilters={setFilters}
        initialValues={initialValues}
        selectItems={selectItems}
        setSelectItems={setSelectItems}
        badge={[]}
        searchTargetOptions={searchTargetOptions}
      />
    </div>
  );
};

export default TemplateSearchPopup;
