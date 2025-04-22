import { useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useQuery } from 'react-query';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import {
  fetchMenuStoreAnalyze,
  fetchMenuStoreRankingAnalyze,
} from '@ApiFarm/menu-analyze';
import { IMenuAnalyzeReq } from '@InterfaceFarm/menu-analyze';
import ExportButton from '@ComponentFarm/modules/ExportButton/ExportButton';
import { Button } from '@ComponentFarm/atom/Button/Button';
import { Tabs } from '@ComponentFarm/atom/Tab/Tab';
import TitleArea from '@ComponentFarm/layout/TitleArea';
import { AddTab, AreaBox } from '@ComponentFarm/template/common/AreaBox';
import FilterTableFormMenu from '@ComponentFarm/template/common/FilterTable/FilterTableFormMenu';
import SubTitleBox from '@ComponentFarm/template/common/SubTitleBox';
import {
  initialDay,
  menuAnalyzeTabData,
} from '@ComponentFarm/template/menu-analyze/const';
import useTabWithDateQuery from '@ComponentFarm/template/menu-analyze/useTabWithDateQuery';
import SalesProductTable from '@ComponentFarm/template/product-analyze/store/SalesProductTable';
import StoreDayVirtualTable from '@ComponentFarm/template/product-analyze/store/StoreDayVirtualTable';
import StoreSalesTable from '@ComponentFarm/template/product-analyze/store/StoreSalesTable';
import useQueryParams from '@HookFarm/useQueryParams';

const SelectStoreType = styled.div`
  margin: 0 2.4rem 0 auto;

  button {
    min-width: auto;
    width: 6.9rem;
  }
`;

const StoreAnalyze = () => {
  const [params, updateParams, resetParams] = useQueryParams<any>(initialDay);
  const [selectStoreType, setSelectStoreType] = useState('direct');
  const { activeTabIndex, handleTabWithDateQuery } = useTabWithDateQuery({
    tabIdx: 0,
    params,
    menuAnalyzeTabData,
  });
  // AreaBox Tab
  const [statusSelect, setstatusSelect] = useState(0);

  const { data: rankingData } = useQuery(
    ['MenuStoreRankingAnalyze', params],
    () => fetchMenuStoreRankingAnalyze(params as IMenuAnalyzeReq)
  );

  const { isLoading, data } = useQuery(['MenuStoreAnalyze', params], () =>
    fetchMenuStoreAnalyze(params as IMenuAnalyzeReq)
  );

  return (
    <>
      <TitleArea title="메뉴 분석 및 통계" />
      <Tabs
        id="store-analyze"
        tabs={menuAnalyzeTabData}
        activeTabIndex={activeTabIndex}
        onTabChange={index => handleTabWithDateQuery(index)}
      />
      <SubTitleBox title="매장별 현황" hideUnderline />
      <FilterTableFormMenu
        type="diff"
        params={params}
        maxDateRanger={6}
        updateParams={updateParams}
        resetParams={resetParams}
      />
      <SubTitleBox
        title="조회 결과"
        hideUnderline
        descBottom={[
          {
            label: '기준일 메뉴 총 판매 수',
            value: `${data?.total.total_base_sales_count.toLocaleString()}`,
          },
          {
            label: '비교일 메뉴 총 판매 수',
            value: `${data?.total.total_comparison_sales_count.toLocaleString()}`,
          },
        ]}
      />
      <AreaBox
        title="매장별 메뉴 판매 현황"
        className="noPadding"
        addFunc={
          <SelectStoreType>
            {['direct', 'franchisee'].map(el => (
              <Button
                key={el}
                variant={selectStoreType === el ? 'primary' : 'transparent'}
                onClick={() => setSelectStoreType(el)}
              >
                {el === 'direct' ? '직영점' : '가맹점'}
              </Button>
            ))}
          </SelectStoreType>
        }
      >
        {rankingData ? (
          <StoreSalesTable
            rankingData={
              selectStoreType === 'direct'
                ? rankingData?.direct_store_list
                : rankingData?.franchisee_store_list
            }
          />
        ) : (
          <Skeleton height={217} baseColor="#fcfcfc" />
        )}
      </AreaBox>
      <AreaBox
        title="판매 메뉴 수"
        className="underline tab"
        css={css`
          margin-top: 3.2rem;
          .content {
            padding: 3.6rem 0 !important;
          }
        `}
        addFunc={
          <div
            css={css`
              display: flex;
              button {
                margin-top: -1rem;
              }
            `}
          >
            <AddTab
              css={css`
                margin-right: 3rem;
              `}
            >
              {['전체', '일별'].map((el, i: number) => (
                <li key={i} className={i === statusSelect ? 'on' : ''}>
                  <button type="button" onClick={() => setstatusSelect(i)}>
                    {el}
                  </button>
                </li>
              ))}
            </AddTab>
            <ExportButton
              params={params}
              endPoint="/analytics/product/sales/export/order_raw_data"
              title="판매 메뉴 수"
            />
          </div>
        }
      >
        {statusSelect === 0 ? (
          <SalesProductTable data={data} isLoading={isLoading} />
        ) : (
          <StoreDayVirtualTable params={params} />
        )}
      </AreaBox>
    </>
  );
};

export default StoreAnalyze;
