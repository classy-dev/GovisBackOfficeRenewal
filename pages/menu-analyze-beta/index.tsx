/* eslint-disable no-unused-vars */
import { useEffect } from 'react';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useQueryClient } from 'react-query';
import { css } from '@emotion/react';
import ExportButtonV3 from '@ComponentFarm/modules/ExportButton/ExportButtonV3';
import { Button } from '@ComponentFarm/atom/Button/Button';
import { Tabs } from '@ComponentFarm/atom/Tab/Tab';
import TitleArea from '@ComponentFarm/layout/TitleArea';
import { AreaBox } from '@ComponentFarm/template/common/AreaBox';
import FilterTableFormMenuMaster from '@ComponentFarm/template/common/FilterTable/FilterTableFormMenuMaster';
import SubTitleBox from '@ComponentFarm/template/common/SubTitleBox';
import { MenuAnalyzeTable } from '@ComponentFarm/template/menu-analyze-beta/MenuAnalyzeTable';
import useQueryParams from '@HookFarm/useQueryParams';
import { menuAnalyzeStore } from '@MobxFarm/MenuAnalyzeStore';

const MenuAnalyze = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [params, updateParams, resetParams] = useQueryParams<any>({
    order_dt_start: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
    order_dt_finish: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
  });

  useEffect(() => {
    console.log('params', params, 'router', router);
    updateParams({
      ...router.query,
    });
  }, []);

  const handleGoChatClick = () => {
    const { chat_room_idx, ...restParams } = params;

    queryClient.removeQueries('chatRoomData');

    router.push({
      pathname: '/menu-analyze-beta/llm',
      query: {
        ...restParams,
      },
    });

    menuAnalyzeStore.setDates(
      params.order_dt_start,
      params.order_dt_finish as string
    );
  };

  return (
    <div
      css={css`
        .SubTitleBoxWrap {
          padding-top: 0;
        }
      `}
    >
      <TitleArea title="메뉴 분석 및 통계" />
      <Tabs
        id="tab_menu_analyze_beta"
        tabs={[
          {
            title: '메뉴 분석 및 통계',
          },
        ]}
        activeTabIndex={0}
      />
      <SubTitleBox
        title="메뉴 판매 데이터 활용하기"
        hideUnderline
        descBottomTxt="메뉴와 관련된 자세한 판매 데이터를 조회하거나 파일로 내려받고 분석해보세요."
      />
      <FilterTableFormMenuMaster
        type="menu_analyze"
        params={params}
        updateParams={updateParams}
        resetParams={resetParams}
      />

      <AreaBox
        title="고피자 베스트 셀러 메뉴"
        descBottomTxt="설정한 조건에 따라 메뉴 판매량 순위를 확인해 보세요."
        className="noPadding descBottom"
        addFunc={
          <span
            css={css`
              display: flex;
              align-items: center;
            `}
          >
            <ExportButtonV3
              params={params}
              endPoint="/analytics/menu/sales/export/order_raw_data"
              title="메뉴 판매 데이터"
            />
            <span
              css={css`
                margin-left: 8px;

                &:first-of-type button {
                  border: none;
                  background-color: #fbd02c !important;
                }
              `}
            >
              <Button variant="gostSecondary" onClick={handleGoChatClick}>
                <span
                  css={css`
                    img {
                      width: 9rem;
                    }
                  `}
                >
                  <img src="/images/llm/ico_btn_gochat.webp" alt="GOCHAT" />
                </span>
              </Button>
            </span>
            {/* <button
              type="button"
              onClick={handleGoChatClick}
              css={css`
                height: 4.4rem;
                padding: 8px 16px;
                margin-right: 8px;
                color: white;
                border: none;
                font-weight: 500;
                border-radius: 4px;
                cursor: pointer;
                border: 1px solid #fbd02c;
                background-color: #fff;

                img {
                  width: 10.8rem;
                  height: 1.8rem;
                }

                &:hover {
                  background-color: #edbc00;
                }
              `}
            >
              <img src="/images/llm/ico_btn_gochat.webp" alt="GOCHAT" />
            </button> */}
          </span>
        }
      >
        <MenuAnalyzeTable params={params} />
      </AreaBox>
    </div>
  );
};

export default MenuAnalyze;
